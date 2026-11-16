"""Browser regression: real meshes, picking, deep layers, export and mobile UI.

Requires Python playwright and Chromium. Run from any directory:
  python anatomy/verify.py --chromium /usr/bin/chromium
This uses a read-only temporary HTTP server, never the autosave server.
"""
import argparse
import functools
import http.server
from pathlib import Path
import re
import tempfile
import threading
from urllib.parse import quote

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent


class ReadOnlyHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def do_GET(self):
        if self.path.startswith('/__ping'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"ok":false}')
        elif self.path == '/favicon.ico':
            self.send_response(204)
            self.end_headers()
        else:
            super().do_GET()


def loaded(page):
    page.locator('#anatomy-explorer').scroll_into_view_if_needed()
    page.wait_for_selector('.an-loading[hidden]', state='attached', timeout=60000)
    assert page.locator('.an-count').inner_text().startswith('467 ')


def run(browser, url, temp):
    errors = []
    desktop = browser.new_context(viewport={'width': 1440, 'height': 1100}, reduced_motion='reduce')
    page = desktop.new_page()
    page.on('pageerror', lambda error: errors.append(str(error)))
    external_models = []

    def block_models(route):
        external_models.append(route.request.url)
        route.abort()

    page.route('**/assets/anatomy/**', block_models)
    page.goto(url)
    loaded(page)
    # Health topics must be functional, linked to the model and available
    # offline; keep evidence qualifications in both detail surfaces.
    assert page.locator('.mh-topic').count() == 7
    assert page.evaluate("Object.keys(MUSCLE_INFO).every(name => Boolean(window.muscleHealthFor(name)))")
    assert page.locator('#muscleLibBody .mh-health').count() == 54
    page.evaluate("document.querySelector('#musclelib .fold-body > p.muted').textContent='旧存档说明'; renderMuscleLib();")
    assert '证据与适用范围' in page.locator('#musclelib .fold-body > p.muted').inner_text()
    page.locator('[data-health-card=head] > summary').click()
    head = page.locator('[data-health-card=head]')
    assert all(text in head.inner_text() for text in ['颈源性头痛', '紧张型头痛', '偏头痛', '不能证明', '脑供血'])
    assert head.locator('a[href^="https://"]').count() == 5
    head.locator('[data-health-muscle="颈深屈肌"]').click()
    assert page.locator('.an-muscle-name').inner_text() == '颈深屈肌'
    page.locator('.an-health-detail summary').click()
    assert '组合训练' in page.locator('.an-health-detail').inner_text()
    assert '脑供血' in page.locator('.an-health-detail').inner_text()
    page.locator('.an-health-filter select').select_option('vein')
    assert page.locator('.an-list button').count() == 2
    assert '静脉回流' in page.locator('.an-health-detail').inner_text()
    page.locator('.an-health-filter select').select_option('spine')
    assert '多裂肌' in page.locator('.an-list').inner_text()
    page.locator('.an-health-filter select').select_option('all')
    page.locator('.an-search input').fill('头痛')
    assert page.locator('.an-list button').count() > 1
    page.locator('.an-search input').fill('')
    page.locator('.an-list [data-muscle=chest]').click()
    page.locator('[data-tool=reset]').click()
    canvas = page.locator('canvas').bounding_box()
    page.mouse.click(canvas['x'] + canvas['width'] * .53, canvas['y'] + canvas['height'] * .25)
    assert '点击部件：' in page.locator('.an-structure').inner_text()
    page.locator('.an-search input').fill('multifidus')
    assert page.locator('.an-list button').count() == 1
    page.locator('.an-list button').click()
    assert page.locator('.an-muscle-name').inner_text() == '多裂肌'
    assert page.locator('[data-mode=xray]').get_attribute('aria-pressed') == 'true'
    assert not page.locator('.an-structure').inner_text().startswith('0 ')
    page.locator('[data-mode=isolate]').click()
    page.locator('.an-focus').click()
    page.locator('.an-search input').fill('latissimus')
    page.locator('.an-list button').click()
    page.locator('.an-exercises button').first.click()
    assert page.locator('.an-dialog').evaluate('(el) => el.open')
    assert len(page.locator('.an-dialog-text').inner_text()) > 30
    page.keyboard.press('Escape')
    page.evaluate('toggleEdit()')
    assert page.locator('#anatomy-explorer [contenteditable=true]').count() == 0
    page.evaluate('toggleEdit()')
    assert page.evaluate("new DOMParser().parseFromString(buildDocument(),'text/html').getElementById('anatomy-explorer').children.length") == 0
    with page.expect_download(timeout=60000) as download:
        page.evaluate('exportHTML()')
    export = temp / 'portable.html'
    download.value.save_as(export)
    html = export.read_text(encoding='utf-8')
    assert len(re.findall(r'^<script id="anatomy-inline-assets"(?:\s|>)', html, re.M)) == 1
    assert not external_models, external_models
    desktop.close()
    print('PASS: original HTML works without external models; picking, search, deep layers, action dialog, edit/save isolation, export', flush=True)

    # The managed browser blocks file:// navigation. Fulfil one navigation from
    # the exported file and abort every other request, with the context offline.
    # This verifies the portable document's complete resource independence.
    offline = browser.new_context(viewport={'width': 1280, 'height': 1000}, offline=True, reduced_motion='reduce')
    isolated = offline.new_page()
    isolated.on('pageerror', lambda error: errors.append(str(error)))
    blocked = []

    def offline_route(route):
        if route.request.is_navigation_request():
            route.fulfill(content_type='text/html', body=ROOT.joinpath('训练计划.html').read_text(encoding='utf-8'))
        else:
            blocked.append(route.request.url)
            route.abort()

    isolated.route('**/*', offline_route)
    isolated.goto('http://offline-fixture.test/portable.html')
    loaded(isolated)
    isolated.locator('.an-search input').fill('腹横肌')
    isolated.locator('.an-list button').click()
    isolated.locator('[data-mode=isolate]').click()
    isolated.locator('.an-focus').click()
    assert isolated.locator('.an-muscle-name').inner_text() == '腹横肌'
    isolated.locator('.an-health-detail summary').click()
    assert 'WHO' in isolated.locator('.an-health-detail').inner_text()
    assert '复位椎间盘' in isolated.locator('.an-health-detail').inner_text()
    assert isolated.locator('.an-health-detail a[href*=who]').count() == 1
    assert isolated.locator('.mh-topic').count() == 7
    with isolated.expect_download(timeout=60000) as repeat:
        isolated.evaluate('exportHTML()')
    reexport = temp / 'reexport.html'
    repeat.value.save_as(reexport)
    assert len(re.findall(r'^<script id="anatomy-inline-assets"(?:\s|>)', reexport.read_text(encoding='utf-8'), re.M)) == 1
    assert not any('models.js' in request for request in blocked)
    offline.close()
    print('PASS: offline single-file rendering and repeated portable export', flush=True)

    mobile = browser.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=1,
                                 is_mobile=True, has_touch=True, reduced_motion='reduce')
    phone = mobile.new_page()
    phone.on('pageerror', lambda error: errors.append(str(error)))
    phone.goto(url)
    loaded(phone)
    assert phone.locator('#anatomy-explorer').evaluate('(el) => el.scrollWidth <= el.clientWidth + 1')
    phone.locator('.an-health-filter select').select_option('head')
    assert '头颈' in phone.locator('.an-health-detail').inner_text()
    phone.locator('[data-view=back]').click()
    phone.locator('[data-tool=in]').click()
    phone.locator('[data-tool=labels]').click()
    assert phone.locator('.an-callout').count() == 0
    phone.locator('[data-tool=labels]').click()
    assert phone.locator('.an-callout').count() > 0
    mobile.close()
    assert not errors, errors
    print('PASS: mobile layout and controls; no JavaScript exceptions', flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--chromium', help='Optional installed Chromium executable')
    args = parser.parse_args()
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(ReadOnlyHandler, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        with tempfile.TemporaryDirectory() as temp, sync_playwright() as playwright:
            options = {'headless': True, 'args': ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']}
            if args.chromium:
                options['executable_path'] = args.chromium
            browser = playwright.chromium.launch(**options)
            try:
                run(browser, f'http://127.0.0.1:{server.server_port}/{quote("训练计划.html")}', Path(temp))
            finally:
                browser.close()
    finally:
        server.shutdown()
        server.server_close()
