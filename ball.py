# One volleyball, drawn once, used by the intro and as page decoration.
BALL = '''<svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <circle cx="50" cy="50" r="47" fill="%(fill)s"/>
          <g stroke="%(seam)s" stroke-width="%(w)s" stroke-linecap="round" fill="none">
            <path d="M50 3c-13 14-18 30-18 47s5 33 18 47"/>
            <path d="M50 3c13 14 18 30 18 47s-5 33-18 47"/>
            <path d="M4.2 39c14 7 29 10 45.8 10s31.8-3 45.8-10"/>
            <path d="M8 68c11-5 24-8 42-8s31 3 42 8"/>
          </g>
          <circle cx="50" cy="50" r="47" stroke="%(seam)s" stroke-width="%(w)s" fill="none" opacity="%(ring)s"/>
        </svg>'''

def ball(fill="#EFBF43", seam="#0B2542", w="2.6", ring="1"):
    return BALL % dict(fill=fill, seam=seam, w=w, ring=ring)
