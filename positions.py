# Single source for position content. Generates the positions page and the
# homepage strip, so the two can never disagree about what a libero does.

POSITIONS = [
    dict(abbr="OH", name="Outside hitter", quiet=False,
         alias="Also called: left side, pin hitter, “outside”",
         short="Hits from the left and passes serve.",
         lead="The busiest attacking spot, and the one most people start in. You hit from the left antenna and you also pass in the back row, so you touch the ball constantly.",
         where="Front left, and all three back-row spots as you rotate.",
         does="Takes the most swings of anyone, including the awkward ones when the pass is bad.",
         begin="A good first hitting spot. The set comes high and slow, which gives you time to see it.",
         hear="“We need an outside” means they want someone who can swing from the left."),

    dict(abbr="OPP", name="Opposite", quiet=False,
         alias="Also called: oppo, right side, RS",
         short="Hits from the right, blocks their best hitter.",
         lead="Named for where they stand in the rotation — always opposite the setter. You attack from the right side and you're the main blocker against the other team's outside hitter.",
         where="Front right, diagonally across from the setter at all times.",
         does="Attacks from the right and blocks. Usually kept out of serve receive.",
         begin="Less passing pressure than outside, but you hit from your off-hand side, which takes a while to feel normal.",
         hear="“Oppo” and “right side” are the same job. Nobody will explain that."),

    dict(abbr="MB", name="Middle blocker", quiet=False,
         alias="Also called: middle, middle hitter, MH",
         short="Blocks everywhere, hits quick sets.",
         lead="You start at the net in the middle and move sideways to block whichever hitter swings. On offence you hit fast, low sets that beat the block.",
         where="Front middle. Often substituted out when you rotate to the back row.",
         does="Reads the setter and gets a block up. Hits quick sets timed before the ball is even set.",
         begin="The hardest spot to start in. It's almost entirely timing and lateral movement, both of which take months.",
         hear="“Middle” means the position. “Middle back” means a place on the floor. Different things."),

    dict(abbr="S", name="Setter", quiet=False,
         alias="Also called: “the setter”, second contact",
         short="Takes the second ball and decides who hits.",
         lead="You touch nearly every ball your team plays. The pass comes to you, and you choose which hitter gets it and how fast.",
         where="Front right when in the front row, then back right. Runs to the ball from wherever they are.",
         does="Delivers the second contact, calls the offence, and takes the blame for everything.",
         begin="The highest-responsibility spot on the court. In pickup, the most experienced player usually takes it — and that's fine.",
         hear="“Run a 5-1” means one setter plays all six rotations. You do not need to know this to play."),

    dict(abbr="L", name="Libero", quiet=True,
         alias="Pronounced LEE-beh-ro, or LIB-uh-ro. Both are used.",
         short="Back-row defender in a different jersey.",
         lead="A defensive specialist with their own rulebook. They wear a contrasting jersey, play only in the back row, and can swap in and out without using a substitution.",
         where="Back row only. Never rotates to the front.",
         does="Passes serve and digs attacks. Cannot block, cannot attack a ball that's above the height of the net, cannot set a front-row attacker overhand from inside the front zone.",
         begin="Uncommon in pickup. The different jersey confuses every newcomer once, and then never again.",
         hear="If someone is wearing a different colour, they aren't lost. That's the libero."),

    dict(abbr="DS", name="Defensive specialist", quiet=True,
         alias="Also called: DS, back-row sub",
         short="Back-row defender using a normal sub.",
         lead="Same idea as a libero — a back-row passer and digger — but they come on with an ordinary substitution, which means they can serve.",
         where="Back row, usually swapped in for a middle blocker who has rotated back.",
         does="Passes, digs, and serves. Often the steadiest passer on the team.",
         begin="A very common way to get court time while you're still learning to hit. Passing is the fastest skill to become useful at.",
         hear="“We'll put you back row” usually means this, and it isn't a demotion."),
]

# The six rotational spots. These are places on the floor, not positions.
ZONES = [
    ("4", "Front left",  True),
    ("3", "Front middle",True),
    ("2", "Front right", True),
    ("5", "Back left",   False),
    ("6", "Back middle", False),
    ("1", "Back right<br>serves", False),
]
