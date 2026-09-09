# Venue data. Coordinates are approximate — good enough to place a pin on the
# right block, not survey-grade. The addresses are real Berkeley/Albany places
# so the directions links actually go somewhere.

VENUES = {
    "kenney": dict(
        name="James Kenney Rec Center",
        addr="1720 Eighth St, Berkeley, CA 94710",
        lat=37.87355, lng=-122.29940, dist="0.8 mi",
        game="Open play, no experience needed", when="Tue 7:00p",
        spots="7 spots", tone="good", new="4 of 11 new"),
    "albany": dict(
        name="Albany Community Center",
        addr="1249 Marin Ave, Albany, CA 94706",
        lat=37.88862, lng=-122.29770, dist="2.1 mi",
        game="Learn to pass, then scrimmage", when="Wed 8:00p",
        spots="3 spots", tone="good", new="First session free"),
    "ymca": dict(
        name="Berkeley YMCA",
        addr="2001 Allston Way, Berkeley, CA 94704",
        lat=37.86862, lng=-122.26800, dist="1.4 mi",
        game="6v6 competitive", when="Thu 7:30p",
        spots="Full", tone="warn", new="Above your level"),
    "ohlone": dict(
        name="Ohlone Park",
        addr="Hearst Ave & Sacramento St, Berkeley, CA 94702",
        lat=37.87360, lng=-122.28300, dist="1.0 mi",
        game="Saturday open play", when="Sat 10:00a",
        spots="12 spots", tone="good", new="Hosting here"),
}

def directions(v):
    """A keyless deep link that opens the user's default maps app."""
    from urllib.parse import quote
    return "https://www.google.com/maps/dir/?api=1&destination=" + quote(v["addr"])
