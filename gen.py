import positions, re, html

P, Z = positions.POSITIONS, positions.ZONES

NAV = '''<header class="topnav" data-topnav>
  <div class="topnav__in">
    <a class="topnav__mark" href="index.html">
      <i aria-hidden="true"></i><span>Bump</span>
    </a>
    <nav class="topnav__links" aria-label="Main">
      <a class="topnav__link topnav__link--hide" href="index.html#how">How it works</a>
      <a class="topnav__link topnav__link--hide" href="positions.html">Positions</a>
      <a class="topnav__link topnav__link--hide" href="index.html#hosts">For hosts</a>
      <a class="cta" href="app.html">Open the app</a>
    </nav>
  </div>
</header>'''

def court():
    cells = []
    for n, label, front in Z:
        cells.append(
            '        <div class="rotzone%s">\n'
            '          <span class="rotzone__n num">%s</span>\n'
            '          <span class="rotzone__l">%s</span>\n'
            '        </div>' % (' rotzone--front' if front else '', n, label))
    return ('    <div class="rotcourt">\n'
            '      <div class="rotcourt__net" aria-hidden="true"></div>\n'
            '      <p class="rotcourt__row">Net</p>\n'
            '      <div class="rotcourt__grid">\n' + '\n'.join(cells) + '\n'
            '      </div>\n'
            '      <p class="rotcourt__row">Back of court</p>\n'
            '    </div>')

def cards():
    out = []
    for p in P:
        out.append('''      <article class="poscard">
        <span class="poscard__badge%s">%s</span>
        <div>
          <h3>%s</h3>
          <p class="poscard__alias">%s</p>
          <p class="poscard__lead">%s</p>
          <dl class="posrows">
            <div class="posrow"><dt>Where</dt><dd>%s</dd></div>
            <div class="posrow"><dt>The job</dt><dd>%s</dd></div>
            <div class="posrow posrow--new"><dt>If you're new</dt><dd>%s</dd></div>
            <div class="posrow"><dt>What you'll hear</dt><dd>%s</dd></div>
          </dl>
        </div>
      </article>''' % ('' if not p['quiet'] else ' poscard__badge--quiet',
                       p['abbr'], p['name'], p['alias'], p['lead'],
                       p['where'], p['does'], p['begin'], p['hear']))
    return '\n'.join(out)

def strip():
    out = []
    for p in P:
        out.append('''        <a class="poschip" href="positions.html">
          <span class="poschip__abbr">%s</span>
          <span class="poschip__name">%s</span>
          <span class="poschip__what">%s</span>
        </a>''' % (p['abbr'], p['name'], p['short']))
    return '\n'.join(out)

import ball as ballmod
INTRO = '''<div class="intro" data-intro aria-hidden="true">
  <div class="intro__panel intro__panel--top"></div>
  <div class="intro__panel intro__panel--bottom"></div>
  <span class="intro__ring" aria-hidden="true"></span>
  <div class="intro__ball">
        %s
  </div>
</div>
''' % ballmod.ball()

PAGE = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Volleyball positions, in plain language — Bump</title>
<meta name="description" content="Outside, opposite, middle, setter, libero and defensive specialist — what each one actually does, what it means for a beginner, and the jargon nobody stops to explain.">
<meta name="theme-color" content="#0B2542">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css?v=14">
<link rel="stylesheet" href="site.css?v=14">\n<link rel="stylesheet" href="intro.css?v=14">
</head>
<body class="sitebody intro-hold">

%(intro)s
%(nav)s

<main>

  <section class="wrap poshero">
    <p class="band__kicker">Positions</p>
    <h1>Six positions, and nobody expects you to know them yet.</h1>
    <p>
      Every listing that says “need an oppo” is asking a question you can't
      answer on your first night. Here is what each position actually does,
      what it means if you're new, and the jargon that gets used without
      anyone stopping to explain it.
    </p>
  </section>

  <section class="band">
    <div class="wrap rot">
%(court)s
      <div class="rotnote">
        <h2>First, the numbers aren't positions.</h2>
        <p>
          The six spots on the floor are numbered <b>1 to 6</b>, and everyone
          shifts one place <b>clockwise</b> each time their team wins the serve
          back. Zone 1 serves.
        </p>
        <p>
          So “middle back” is a <b>place</b> — zone 6. “Middle blocker” is a
          <b>position</b> — a job. A middle blocker standing in zone 6 is in the
          back row and cannot attack from up at the net. This is the single most
          common thing beginners get tangled in, and it isn't your fault: the
          same word is doing two jobs.
        </p>
        <p>
          The three front zones are <b>4, 3 and 2</b>. The three back zones are
          <b>5, 6 and 1</b>. That's the whole system.
        </p>
      </div>
    </div>
  </section>

  <section class="band band--quiet">
    <div class="wrap">
      <div class="band__head">
        <h2>The six positions</h2>
        <p>Read the “if you're new” line first. It's the one that decides whether a spot is worth trying on a Tuesday.</p>
      </div>
      <div class="poslist">
%(cards)s
      </div>
    </div>
  </section>

  <section class="band">
    <div class="wrap">
      <div class="band__head">
        <h2>You don't have to pick one.</h2>
        <p>
          In pickup volleyball almost nobody plays a fixed position. Hosts put
          people where the team is short, and “I'll go wherever” is a completely
          normal answer — often the most useful one in the gym. Learn to pass
          first, and the rest sorts itself out.
        </p>
      </div>
      <div class="closer__actions" style="justify-content:flex-start;">
        <a class="cta cta--lg" href="app.html">Find a game</a>
        <a class="cta cta--ghost cta--lg" href="index.html#how">How Bump works</a>
      </div>
    </div>
  </section>

</main>

<footer class="sitefoot">
  <div class="sitefoot__in">
    <span>Bump. HTML, CSS, and no framework.</span>
    <a href="index.html">Home</a>
    <a href="app.html">App</a>
    <a href="prototype.html">Case study</a>
    <span class="sitefoot__sep">Built as a mini-project on making a hobby more accessible.</span>
  </div>
</footer>

<script src="site.js?v=14"></script>
</body>
</html>
''' % dict(nav=NAV, intro=INTRO, court=court(), cards=cards())

open('positions.html','w').write(PAGE)
open('/private/tmp/claude-501/-Users-jtavu-Downloads-websiteforuxclub/e5bcbbfa-4538-4e37-a6b4-54e6948ca799/scratchpad/strip.html','w').write(strip())
print("positions.html written:", len(PAGE), "bytes")
