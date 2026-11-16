#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
训练计划 · 本地保存服务

只做两件事：
  1. 把这个文件夹当静态网站提供（这样页面才是一个"安全来源"，能拿到写文件的权限）
  2. 接收页面的保存请求，把**你填的内容**写进旁边的数据文件
     （训练计划.html → 训练计划.data.json）

页面 HTML 本身是模板，永远不会被改写 —— 所以它可以安全地放进 git、公开出去。
你的个人数据（方案、体重记录、档案、自建动作）存在 .data.json 里，留在本机。
"""

import http.server
import hashlib
import json
import os
import socket
import socketserver
import sys
import threading
import time
import webbrowser
from urllib.parse import quote, unquote

# 依次尝试的端口。Windows 会把一些端口段动态保留给 Hyper-V / WSL / Docker，
# 而且重启后会变 —— 8763 就被圈进过 8681-8780 那段，bind 直接被系统拒掉，
# 表现出来就是浏览器「拒绝连接」。所以给几个备选，哪个能绑上用哪个。
# 想看看当前哪些段被占：netsh interface ipv4 show excludedportrange protocol=tcp
PORT_TRIES = [8763, 8788, 8799, 8823, 8850, 8877]
ROOT = os.path.dirname(os.path.abspath(__file__))
PAGES = ['训练计划.html', '饮食计划.html']   # 要服务的页面；文件夹里还有备份和临时快照，都不算
PAGE = PAGES[0]

DATA_SUFFIX = '.data.json'      # 页面 HTML 旁边的个人数据文件


def file_hash(path):
    """文件当前内容的指纹。页面拿它当"我上次看到的是这一版"的凭据。"""
    try:
        with open(path, 'rb') as f:
            return hashlib.sha1(f.read()).hexdigest()[:16]
    except OSError:
        return ''


def sidecar_of(page_path):
    """训练计划.html → 训练计划.data.json（同一目录，去掉 .html 后缀）。"""
    base = os.path.splitext(page_path)[0]
    return base + DATA_SUFFIX


def resolve_page(rel):
    """把页面传来的相对路径落到本文件夹里的某个 .html。越界一律拒绝。"""
    rel = unquote(rel or '').lstrip('/\\')
    if not rel.lower().endswith('.html'):
        raise ValueError('只认识 .html 页面')
    target = os.path.abspath(os.path.join(ROOT, rel))
    if not target.startswith(ROOT + os.sep):        # 防目录穿越
        raise ValueError('不允许访问这个文件夹之外')
    return target


class Handler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    # ---------- 保存接口 ----------
    def do_POST(self):
        if self.path == '/__save':
            self.save_doc()
        elif self.path == '/__save_data':
            self.save_data()
        elif self.path == '/__reset_data':
            self.reset_data()
        else:
            self.send_json({'ok': False, 'error': '没有这个接口'}, 404)

    def reset_data(self):
        """「恢复初始」：把个人数据文件删掉，页面回到模板本来的样子。"""
        try:
            length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(length).decode('utf-8'))
            target = sidecar_of(resolve_page(data.get('path', '')))
            if os.path.isfile(target):
                os.remove(target)
            self.send_json({'ok': True, 'removed': os.path.basename(target)})
        except Exception as exc:
            self.send_json({'ok': False, 'error': str(exc)}, 400)

    def save_doc(self):
        """写整份 HTML。只有「导出成独立文件再导入回来」这类老用法会走到这里，
        页面平时自动保存走的是下面的 save_data。"""
        try:
            length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(length).decode('utf-8'))
            target = resolve_page(data.get('path', ''))
            html = data.get('html', '')
            if not html.lstrip()[:20].lower().startswith('<!doctype html'):
                raise ValueError('内容不像一份完整 HTML，已拒绝，以免写坏文件')
            if not self.base_matches(target, data.get('base', '')):
                return
            self.atomic_write(target, html)
            self.send_json({'ok': True, 'file': os.path.basename(target),
                            'hash': file_hash(target),
                            'bytes': len(html.encode('utf-8'))})
        except Exception as exc:
            self.send_json({'ok': False, 'error': str(exc)}, 400)

    def save_data(self):
        """写个人数据（方案、记录、档案、自建动作库）。页面 HTML 一个字节都不动。"""
        try:
            length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(length).decode('utf-8'))
            page = resolve_page(data.get('path', ''))
            doc = data.get('data')
            if not isinstance(doc, dict):
                raise ValueError('数据格式不对，已拒绝')

            target = sidecar_of(page)
            if not self.base_matches(target, data.get('base', '')):
                return

            doc['savedAt'] = time.strftime('%Y-%m-%dT%H:%M:%S')
            text = json.dumps(doc, ensure_ascii=False, indent=1)
            self.atomic_write(target, text)
            self.send_json({'ok': True, 'file': os.path.basename(target),
                            'hash': file_hash(target),
                            'bytes': len(text.encode('utf-8')),
                            'savedAt': doc['savedAt']})
        except Exception as exc:
            self.send_json({'ok': False, 'error': str(exc)}, 400)

    def base_matches(self, target, base):
        """冲突保护：文件在页面打开之后被改过，就别盖它。返回 False 表示已拦下。"""
        if not base:
            return True
        now_hash = file_hash(target)
        if not now_hash or now_hash == base:
            return True
        self.send_json({'ok': False, 'conflict': True, 'hash': now_hash,
                        'error': '文件在页面打开之后被改过，这次保存已拦下，'
                                 '以免覆盖别人的改动（刷新页面再改）'}, 409)
        return False

    def atomic_write(self, target, text):
        tmp = target + '.tmp'
        with open(tmp, 'w', encoding='utf-8', newline='') as f:
            f.write(text)
        os.replace(tmp, target)                          # 原子替换，避免写一半被打断

    # ---------- 探活 ----------
    def do_GET(self):
        if self.path.startswith('/__ping'):
            # 页面把自己的路径带过来 —— 文件夹里有好几个 HTML，
            # 得给它"它正在编辑的那个页面 + 它旁边的数据文件"的指纹，
            # 否则冲突保护会误判。
            rel = ''
            if '?' in self.path:
                for kv in self.path.split('?', 1)[1].split('&'):
                    if kv.startswith('path='):
                        rel = unquote(kv[5:]).lstrip('/\\')
            if rel:
                try:
                    page = resolve_page(rel)
                except ValueError:
                    page = os.path.join(ROOT, PAGE)
            else:
                page = os.path.join(ROOT, PAGE)
            side = sidecar_of(page)
            self.send_json({'ok': True,
                            'file': os.path.basename(page),
                            'hash': file_hash(page),          # 页面 HTML 的指纹
                            'dataFile': os.path.basename(side),
                            'dataHash': file_hash(side),      # 个人数据文件的指纹
                            'hasData': os.path.isfile(side)})
            return
        super().do_GET()

    def send_json(self, obj, code=200):
        body = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self):
        # 页面会被自动保存改写；不加这句，浏览器可能拿旧缓存，
        # 表现就是「改了没生效」「切过去还是老样子」。
        if self.path.split('?')[0].lower().endswith('.html'):
            self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

    def log_message(self, *args):
        pass                                                 # 别刷屏


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def port_is_ours(port):
    """这个端口上跑的是不是我们自己的服务。
    不能用 bind 失败来判断 —— 被系统保留、被别的程序占、以及「已经开着一个」
    在 bind 看来都一样，而前两种情况下直接开浏览器只会得到「拒绝连接」。"""
    try:
        with socket.create_connection(('127.0.0.1', port), timeout=0.4) as s:
            s.sendall(b'GET /__ping HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n')
            return b'"ok": true' in s.recv(512)
    except OSError:
        return False


def main():
    pages = [f for f in PAGES if os.path.isfile(os.path.join(ROOT, f))]

    # 只打开一份 —— 两个页面在浏览器里一键切换，不用每次弹两个标签页。
    # 想指定先开哪一份：python serve.py 饮食   （两个都要：python serve.py 全部）
    want = sys.argv[1] if len(sys.argv) > 1 else ''
    if want in ('全部', 'all', 'both'):
        opening = pages
    else:
        opening = [f for f in pages if want and want in f] or pages[:1]

    def open_pages(port):
        for f in opening:
            webbrowser.open('http://127.0.0.1:%d/%s' % (port, quote(f)))

    # 已经开着一个了？那就只开浏览器
    for p in PORT_TRIES:
        if port_is_ours(p):
            print('服务已经在运行（端口 %d），直接打开页面。' % p)
            open_pages(p)
            return

    httpd = port = None
    blocked = []
    for p in PORT_TRIES:
        try:
            httpd = Server(('127.0.0.1', p), Handler)
            port = p
            break
        except OSError as exc:
            blocked.append('  %d —— %s' % (p, exc.strerror or exc))

    if httpd is None:
        print('=' * 60)
        print('  启动失败：这些端口一个都用不了')
        print('=' * 60)
        print('\n'.join(blocked))
        print()
        print('  多半是被系统动态保留了（Hyper-V / WSL / Docker 会圈走一些端口段，')
        print('  重启后还会变）。改 serve.py 顶部的 PORT_TRIES 换几个端口再试。')
        print('  看当前被占的段：netsh interface ipv4 show excludedportrange protocol=tcp')
        print('=' * 60)
        if not os.environ.get('NO_BROWSER'):
            try: input('（按回车关掉这个窗口）')
            except EOFError: pass
        return

    print('=' * 60)
    print('  训练计划 / 饮食计划 · 本地服务已启动')
    print('=' * 60)
    for f in pages:
        print('  ' + f'{f:<18}' + 'http://127.0.0.1:%d/%s' % (port, f))
    print()
    print('  在页面上改的任何东西，都会自动存进旁边的 训练计划.data.json；')
    print('  页面 HTML 本身是模板，不会被改写 —— 所以它可以放心地进 git、公开出去。')
    print('  两个页面之间用左上角的「训练 / 饮食」一键切换。')
    print('  把这两个文件放进同步盘，两台电脑就自动同步了。')
    print()
    print('  关掉这个黑窗口 = 停止服务（网页会退回浏览器本地保存）。')
    print('=' * 60)
    sys.stdout.flush()

    # 只开这两份 —— 文件夹里还有备份和临时快照，别一起开出来
    if not os.environ.get('NO_BROWSER'):
        threading.Timer(1.0, lambda: open_pages(port)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n已停止。')


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print('启动失败：' + str(e))
        sys.exit(1)
