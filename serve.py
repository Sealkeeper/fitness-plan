#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
训练计划 · 本地保存服务

只做两件事：
  1. 把这个文件夹当静态网站提供（这样页面才是一个"安全来源"，能拿到写文件的权限）
  2. 接收页面的保存请求，把内容写回 训练计划.html 本身

只监听 127.0.0.1，外网访问不到。除了本文件夹里的 .html，什么都写不了。
"""

import http.server
import hashlib
import json
import os
import socket
import socketserver
import sys
import threading
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


def file_hash(path):
    """文件当前内容的指纹。页面拿它当"我上次看到的是这一版"的凭据。"""
    try:
        with open(path, 'rb') as f:
            return hashlib.sha1(f.read()).hexdigest()[:16]
    except OSError:
        return ''


class Handler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    # ---------- 保存接口 ----------
    def do_POST(self):
        if self.path != '/__save':
            self.send_json({'ok': False, 'error': '没有这个接口'}, 404)
            return
        try:
            length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(length).decode('utf-8'))
            rel = unquote(data.get('path', '')).lstrip('/\\')
            html = data.get('html', '')

            if not rel.lower().endswith('.html'):
                raise ValueError('只允许写 .html 文件')
            target = os.path.abspath(os.path.join(ROOT, rel))
            if not target.startswith(ROOT + os.sep):        # 防目录穿越
                raise ValueError('不允许写到这个文件夹之外')
            if not html.lstrip()[:20].lower().startswith('<!doctype html'):
                raise ValueError('内容不像一份完整 HTML，已拒绝，以免写坏文件')

            # ---- 冲突保护：文件在页面打开之后被改过，就别盖它 ----
            # 页面带着"我打开时文件长这样"的指纹来；对不上说明磁盘上的
            # 已经被别人（比如我）改过，这时写回去会把新改动冲掉。
            base = data.get('base', '')
            if base:
                now_hash = file_hash(target)
                if now_hash and now_hash != base:
                    self.send_json({'ok': False, 'conflict': True,
                                    'hash': now_hash,
                                    'error': '文件在页面打开之后被改过，这次保存已拦下，'
                                             '以免覆盖别人的改动（刷新页面再改）'}, 409)
                    return

            tmp = target + '.tmp'
            with open(tmp, 'w', encoding='utf-8', newline='') as f:
                f.write(html)
            os.replace(tmp, target)                          # 原子替换，避免写一半被打断
            self.send_json({'ok': True, 'file': rel,
                            'hash': file_hash(target),
                            'bytes': len(html.encode('utf-8'))})
        except Exception as exc:
            self.send_json({'ok': False, 'error': str(exc)}, 400)

    # ---------- 探活 ----------
    def do_GET(self):
        if self.path.startswith('/__ping'):
            # 页面把自己的路径带过来 —— 文件夹里有好几个 HTML，
            # 得给它"它正在编辑的那个文件"的指纹，否则冲突保护会误判。
            rel = ''
            if '?' in self.path:
                for kv in self.path.split('?', 1)[1].split('&'):
                    if kv.startswith('path='):
                        rel = unquote(kv[5:]).lstrip('/\\')
            target = os.path.abspath(os.path.join(ROOT, rel)) if rel else os.path.join(ROOT, PAGE)
            if not target.startswith(ROOT):
                target = os.path.join(ROOT, PAGE)
            self.send_json({'ok': True, 'file': os.path.basename(target),
                            'hash': file_hash(target)})
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
    print('  在页面上改的任何东西，都会自动写回对应的文件本身；')
    print('  两个页面之间用左上角的「训练 / 饮食」一键切换。')
    print('  把这个文件夹放进同步盘，两台电脑就自动同步了。')
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
