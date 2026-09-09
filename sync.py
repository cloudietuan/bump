"""Regenerate the website's showcase phones from app.html.

app.html is the single source for what the app looks like. The two phones on
the homepage are copies of its screens with every interactive hook removed, so
the marketing images cannot show an older UI than the product. Run this after
changing an app screen.
"""
import re

def block(src, start_tag):
    """Return the full element beginning at start_tag, matching nested divs."""
    i = src.index(start_tag)
    j = i + len(start_tag)
    depth = 1
    while depth:
        m = re.compile(r'</?div\b').search(src, j)
        if not m:
            raise ValueError('unbalanced div after ' + start_tag[:40])
        depth += 1 if m.group() == '<div' else -1
        j = m.end()
    return i, src.index('>', j - 1) + 1

def screen(src, n):
    tag = '<section class="app'
    i = src.index('data-screen="%d"' % n)
    i = src.rindex(tag, 0, i)
    j = src.index('</section>', i) + len('</section>')
    return src[i:j]

def strip(html):
    # drop the map surfaces: the site does not load Leaflet, and a dead map
    # region reads worse than no map at all
    while '<div class="mapwrap' in html:
        a, b = block(html, html[html.index('<div class="mapwrap'):].split('>')[0] + '>')
        s = html.index('<div class="mapwrap')
        _, e = block(html[s:], html[s:].split('>')[0] + '>')
        html = html[:s] + html[s + e:]
    html = re.sub(r'\s*<div class="gorow">.*?</div>\s*</div>', '', html, flags=re.S)
    html = re.sub(r'\s*<p class="pickhint">.*?</p>', '', html, flags=re.S)

    # every hook that routing or state depends on
    for a in ['data-goto', 'data-confirm', 'data-confirmed', 'data-level-chip',
              'data-verdict-level', 'data-verdict-note', 'data-view', 'data-view-panel',
              'data-map', 'data-venue', 'data-pick-coords', 'data-screen']:
        html = re.sub(r'\s%s(="[^"]*")?' % a, '', html)

    # decoration must not be focusable or appear in the heading outline
    html = html.replace('<button ', '<button tabindex="-1" ')
    html = re.sub(r'<h3 class="([^"]*)"', r'<p class="\1"', html)
    html = re.sub(r'<h4 class="([^"]*)"', r'<p class="\1"', html)
    html = html.replace('</h3>', '</p>').replace('</h4>', '</p>')
    html = html.replace(' hidden>', '>')
    html = html.replace('class="app ', 'class="app is-active ')
    return html

app = open('app.html').read()
idx = open('index.html').read()

# app.html has a real app bar, not fake phone chrome, so the showcase's status
# bar comes from the prototype page where that chrome still lives
proto = open('prototype.html').read()
sb_i = proto.index('<div class="statusbar">')
sb_j = proto.index('</div>', proto.index('<b class="num">')) + 6
statusbar = proto[sb_i:sb_j]

def device(n, cls):
    return ('<div class="%s" aria-hidden="true">\n'
            '      <div class="phone showcase">\n'
            '        %s\n'
            '        <div class="viewport">\n%s\n'
            '        </div>\n'
            '      </div>\n'
            '    </div>') % (cls, statusbar, strip(screen(app, n)))

for n, cls in ((2, 'hero__device'), (4, 'split__device')):
    tag = '<div class="%s" aria-hidden="true">' % cls
    i, j = block(idx, tag)
    idx = idx[:i] + device(n, cls) + idx[j:]

open('index.html', 'w').write(idx)
print('showcases regenerated from app.html')
