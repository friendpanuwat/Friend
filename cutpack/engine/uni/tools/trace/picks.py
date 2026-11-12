# keep boxes as fractions of the cell (x0, y0, x1, y1); acc = boxes whose enclosed regions take the accent
P = {
 'cycle': [(.6, .25, .9, 1)], 'stair': [(.44, .2, .86, .97)], 'roadmap': [(.13, .24, .9, .97), (.78, .12, .9, .3)],
 'path': [(.05, .22, .42, 1), (.58, .3, .99, 1)], 'target': [(.08, .22, .45, 1), (.6, .22, .97, 1)],
 'choice': [(.03, .25, .99, .99)], 'maze': [(.1, .2, .9, .99)], 'puzzle': [(.1, .14, .97, .99)],
 'scales': [(.05, .02, .95, .99)], 'tangle': [(.0, .2, 1, .99)], 'compass': [(.67, .05, .92, .95)],
 'stop': [(.1, .25, .45, 1)], 'chain': [(.03, .3, .6, .9), (.6, .608, .6175, .674)], 'fire': [(.1, .2, .44, 1)], 'pit': [(.636, .375, .885, .99)],
 'fragile': [(.16, .07, .4, .97)], 'star': [(.6, .22, .96, .99)], 'treasure': [(.1, .25, .46, 1)],
 'breakwall': [(.09, .28, .46, .98)], 'jigsaw': [(.6, .2, .97, 1)], 'gift': [(.1, .3, .45, 1)],
 'seasons': [(.03, .27, .97, 1)], 'countdown': [(.12, .24, .88, 1)], 'match': [(.08, .25, .36, 1), (.36, .45, .66, 1), (.66, .25, .97, 1)],
 'hammer': [(.03, .1, .97, 1)], 'plane': [(.05, .1, .97, 1)], 'keyhole': [(.38, .3, .62, 1)],
 'iceberg': [(.6, .3, .99, 1)], 'map': [(.64, .24, .91, .98)], 'shortcut': [(.11, .24, .9, .97)],
 'cheat': [(.12, .25, .295, .97)], 'nugget': [(.11, .32, .9, .99)], 'knockout': [(.03, .25, .99, 1)],
 'micdrop': [(.6, .25, .97, 1), (.555, .8, .6, 1)], 'balloon': [(.1, .15, .4, .99)],
 'anatomy': [(.55, .3, .86, 1), (.8, .22, .879, .5), (.775, .66, .866, 1)],
}
# the key part that takes the style's accent (cell fractions)
ACC = {
 'cycle': [(.6, .25, .9, 1)], 'stair': [(.44, .18, .86, .97)], 'roadmap': [(.78, .25, .9, .6)], 'path': [(.58, .4, .97, .75)],
 'target': [(.62, .3, .88, 1)], 'choice': [], 'maze': [], 'puzzle': [(.74, .15, .98, .5)],
 'scales': [(.1, .45, .9, .85)], 'tangle': [], 'compass': [(.69, .15, .9, .9)], 'stop': [(.1, .25, .45, 1)],
 'chain': [(.43, .52, .5, .73), (.505, .52, .6, .73)], 'fire': [(.1, .25, .45, 1)], 'pit': [(.7, .25, .82, .95)], 'fragile': [(.26, .5, .4, .97)],
 'star': [(.6, .22, .96, .99)], 'treasure': [(.15, .25, .42, .55)], 'breakwall': [(.25, .28, .38, .9)], 'jigsaw': [(.75, .2, .97, .6)],
 'gift': [(.1, .3, .45, 1)], 'seasons': [(.75, .35, .97, 1)], 'countdown': [(.66, .3, .88, 1)], 'match': [(.78, .3, .99, 1)],
 'hammer': [(.6, .1, .97, 1)], 'plane': [(.65, .1, .97, 1)], 'keyhole': [(.38, .3, .62, 1)], 'iceberg': [(.6, .585, .95, 1)],
 'map': [(.78, .28, .87, .5), (.82, .7, .9, .9)], 'shortcut': [(.4, .55, .7, .85)], 'cheat': [(.19, .38, .25, .52)], 'nugget': [(.69, .36, .87, .74)],
 'knockout': [(.55, .4, .85, 1)], 'micdrop': [(.74, .22, .99, .62)], 'balloon': [(.1, .15, .34, .95)],
 'anatomy': [(.66, .33, .81, .8)],
}
THR = {'balloon': 150, 'tangle': 100, 'roadmap': 160, 'map': 185, 'nugget': 130, 'path': 120, 'target': 120, 'iceberg': 150, 'scales': 150, 'compass': 125, 'pit': 150}

# pieces dropped when they lie wholly in one of these boxes (stray marks, bits of the cell's title)
DROP = {'chain': [(.598, .59, .612, .615)], 'fire': [(.1, .0, .45, .25)], 'iceberg': [(.58, .4, .7, .62)], 'compass': [(.66, .0, .745, .2)], 'fragile': [(.25, .0, .45, .22)], 'shortcut': [(.35, .24, .65, .57)], 'cheat': [(.285, .2, .31, .5)], 'nugget': [(.4, .3, .62, .56), (.168, .41, .21, .47), (.17, .415, .22, .5)], 'balloon': [(.28, .0, .42, .24), (.33, .25, .42, .5)], 'stair': [(.43, .15, .5, .6), (.44, .19, .86, .215)]}
MINA = {'cycle': 260}                 # smallest piece kept (sheet px²): the cycle's numbers go
THICK = {'treasure'}                 # the solid bright blobs (the chest's light) take the accent
THICKB = {'iceberg'}                 # … or the body (the lit face of the ice above water)
TB = {'choice': .24, 'stop': .2, 'countdown': .22, 'target': .2, 'seasons': .22, 'match': 0, 'compass': 0, 'maze': .3, 'puzzle': .3, 'scales': 0, 'tangle': .3, 'stair': 0, 'roadmap': .2, 'star': .21, 'breakwall': .26, 'map': 0, 'shortcut': 0, 'nugget': 0, 'balloon': .2, 'fragile': 0, 'pit': .2, 'cheat': 0, 'path': .2}   # how far down the cell's title reaches
EDGE = {'map'}      # grey-filled drawings with faint outlines: their edges are found from the grey steps too
CLOSE = {'pit'}              # open drawings: a region is the thing's body when the sheet is grey there
HOLE = {'puzzle', 'pit', 'tangle'}      # enclosed regions that are black on the sheet stay empty (the missing piece, the pit)
GAP = {'fire': 31, 'fragile': 31, 'cheat': 15, 'balloon': 61, 'match': 9, 'target': 21, 'iceberg': 21}   # small breaks in an outline closed before finding what it encloses
SEAL = {'fragile': [((60, 205), (79, 200))]}   # short lines (crop source px) that close an outline the sheet leaves open (the glass foot behind the triangle)

# ---- second check pass (Friend 2026-11-12 "ตรวจสอบว่ามีอันไหนที่ไม่ตรงตามแบบ…") ----
# a threshold of its own inside a box (x0, y0, x1, y1) or a circle (cx, cy, r: cell fractions, r in cell px)
THRB = {'nugget': [((.69, .36, .9, .96), 200), ((.18, .35, .23, .42), 200)],   # the diamond: only its facet lines, not its bright faces; a sheen speck
        'compass': [((.788, .551, 80), 190)],                   # the dial: the rim's sheen is not a line
        'star': [((.66, .3, .86, .9), 215)],                    # the star: ridges only, not the shading steps
        'path': [((.12, .72, .19, .9), 90), ((.34, .72, .43, .95), 90), ((.28, .26, .345, .44), 90)],   # the grey ✗ marks
        'target': [((.355, .75, .425, .95), 90)],
        }
DARK = {'map': [((.66, .635, .696, .792), 85)]}               # a dark solid shape on a grey fill (the start pin) → solid ink
ERASE = {'map': [(.736, .69, .758, .889)], 'iceberg': [(.744, .945, .775, .99)], 'chain': [(.595, .585, .612, .612), (.6, .669, .62, .69)], 'nugget': [(.18, .41, .218, .45)]}                       # boxes wiped of lines: a fold's shading edge found as a stub
BCLOSE = {'path': [((.12, .72, .19, .9), 9, 1), ((.34, .72, .43, .95), 9, 1), ((.28, .26, .345, .44), 9, 1)], 'target': [((.355, .75, .425, .95), 9, 1)]}   # (box, kernel S px, fill holes): solid strokes
SEALF = {'anatomy': [((.735, .357), (.722, .39), 1), ((.774, .693), (.766, .709), 1)],    # the cube's right face, which the sheet leaves open at both ends
         'breakwall': [((.441, .42), (.441, .94), 1)],          # (from, to, drawn): the right wall gets a straight end
         'iceberg': [((.822, .545), (.826, .574), 1), ((.7515, .94), (.759, .962), 1), ((.759, .962), (.7685, .94), 1)],   # the right slope meets the water; the hidden part's tip
         'puzzle': [((.655, .211), (.684, .211), 1), ((.684, .211), (.68, .376), 1), ((.64, .377), (.68, .376), 1),
                    ((.684, .211), (.73, .185), 0), ((.852, .375), (.857, .43), 0)]}   # the edge lost in the lifted piece's shadow; the slot enclosed
ACCC = {'tangle': (.76, .588, 66)}                              # accent = the inside of this circle (cell fractions, r cell px)
HOLEMU = {'tangle': 60, 'puzzle': 45}                                         # how dark a hole is on the sheet (default 26): the knot's gaps glow a little
HOLEF = {'puzzle'}                                              # holes drawn with a shade, so the missing piece reads in every style
HL = {'balloon': (.1, .15, .22, .55)}                           # thick lines inside the accent, in this box, are highlights: drawn light
ACCGAP = {'balloon'}                                            # what the gap closing covered next to the accent takes the accent too
FADE = {'pit': 'lrtb', 'tangle': 'lr'}
FADEW = {'tangle': .1}                                          # how far in the fade reaches (default .22 of the width)                                          # fades at these edges: l r t everything, b the body (the ground and the arrow are cut by the crop)
THICKA = {'path': (.58, .3, .99, 1)}                            # solid bright shapes in this box take the accent (the straight arrow and its ✓)
BOPEN = {}                                                      # (box, kernel S px): lines thinner than the kernel go
ACCLEDGE = {'micdrop': 3.5}                                     # accent ink keeps this far (sheet px) from the outside: the outline stays ink with what sticks to it
ACCSMALL = {'micdrop': 40}                                      # inside bits smaller than this (sheet px²) next to the accent take it
ACCLMIN = {'micdrop': 14}                                       # smallest piece of accent ink kept (sheet px²; default 1): the grille's dots go

# ---- parts for motion (Friend 2026-11-12: "ใส่การเคลื่อนไหวให้ 26 ร่างลายเส้น แล้วย้ายเข้าคลัง") ----
# (name, kind, arg, opts): box (x0, y0, x1, y1) pixels · poly [points] pixels · comp box = the whole pieces whose middle is in it ·
# comps box = one part per piece (opts sort 'x'|'y') · region [seeds] = the enclosed areas at the seeds + the lines round them
# (opts d sheet px, share: lines shared with neighbours stay in both) · opts pivot (x, y) cell fractions · under: what is
# beneath closes over the part's footprint. What no part takes is the part 'rest'.
LO = {'only': ['lines', 'accl']}
QO = {'only': ['lines', 'accl'], 'on': ['lines', 'accl'], 'maxa': 400}   # a small glyph (?) of the lines only   # a part of the lines only (the paper under it stays)
PARTS = {
 'roadmap': [('start', 'box', (.13, .55, .215, .86)), ('pin', 'box', (.455, .27, .505, .405)), ('goal', 'box', (.775, .14, .86, .40))],
 'path': [('x1', 'comp', (.29, .29, .35, .44)), ('x2', 'comp', (.07, .7, .16, .9)), ('x3', 'comp', (.34, .7, .44, .97)),
          ('arrow', 'comp', (.5, .45, .93, .62)), ('check', 'comp', (.74, .68, .93, .98))],
 'target': [('arr', 'comps', (.1, .2, .345, .98)), ('x', 'comp', (.35, .74, .43, .96)), ('check', 'comp', (.84, .72, .93, .96))],
 'choice': [('q1', 'comp', (.03, .58, .24, .86)), ('q2', 'comp', (.7, .33, .97, .6)),
            ('rowA', 'box', (.29, .385, .67, .48), LO), ('rowB', 'box', (.29, .48, .67, .58), LO), ('rowC', 'box', (.29, .58, .67, .68), LO),
            ('rowD', 'box', (.29, .68, .67, .785), LO)],
 'maze': [('q', 'comp', (.45, .42, .58, .64), {**QO, 'maxa': 1500})],
 'puzzle': [('piece', 'region', [(.78, .25)], {'d': 5}), ('q', 'comp', (.45, .42, .58, .66), {**QO, 'maxa': 3000})],
 'scales': [('beam', 'box', (.2, .06, .8, .245), {'pivot': (.52, .2)}), ('panL', 'box', (.12, .245, .4, .79), {'pivot': (.30, .215)}),
            ('panR', 'box', (.58, .245, .86, .79), {'pivot': (.745, .215)})],
 'compass': [('needle', 'poly', [(.828, .394), (.803, .515), (.805, .545), (.801, .578), (.742, .707), (.775, .566), (.773, .536), (.777, .506)], {'under': True, 'pivot': (.789, .542)}), ('arc1', 'comp', (.83, .17, .9, .42)),
             ('arc2', 'comp', (.67, .69, .74, .93))],
 'stop': [('word', 'box', (.17, .47, .35, .70), LO)],
 'pit': [('arrow', 'comp', (.74, .58, .78, .64))],
 'star': [('star', 'comp', (.7, .45, .82, .7))],
 'breakwall': [('wallL', 'comp', (.1, .4, .31, .96)), ('wallR', 'comp', (.36, .4, .46, .96)), ('deb', 'comps', (.25, .25, .37, .95), {'sort': 'y'})],
 'jigsaw': [('pA', 'region', [(.85, .4)], {'share': True}), ('pB', 'region', [(.68, .8)], {'share': True}), ('pC', 'region', [(.85, .8)], {'share': True})],
 'countdown': [('t3', 'comp', (.15, .25, .36, .97)), ('t2', 'comp', (.4, .25, .6, .97)), ('t1', 'comp', (.64, .25, .85, .97))],
 'match': [('match', 'comp', (.1, .25, .36, 1)), ('arrow', 'comp', (.4, .45, .62, .85)), ('flames', 'box', (.69, .28, .9, .715))],
 'iceberg': [('water', 'box', (.55, .54, .95, .575)), ('tip', 'box', (.6, .25, .9, .54))],
 'map': [('pin', 'region', [(.855, .36), (.855, .45)], {'d': 4, 'under': True}), ('x', 'box', (.823, .722, .869, .862), {'only': ['lines', 'acc', 'accl']}),
         ('start', 'box', (.662, .64, .705, .8), LO), ('route', 'box', (.655, .42, .83, .87), LO)],
 'shortcut': [('left', 'comp', (.08, .25, .33, .9)), ('arrow', 'comp', (.33, .4, .66, .8)), ('right', 'comp', (.65, .2, .92, .9))],
 'cheat': [('star', 'region', [(.215, .45)], {'d': 4, 'under': True}), ('ln', 'comps', (.16, .54, .29, .86), {'only': ['lines'], 'sort': 'y'})],
 'nugget': [('rocksL', 'comp', (.1, .3, .35, .97)), ('diamond', 'comp', (.77, .6, .81, .68)), ('rocksR', 'comp', (.68, .66, .9, .97))],
 'knockout': [('gloveL', 'comp', (.37, .68, .41, .73)), ('gloveR', 'comp', (.70, .63, .74, .67)), ('speedL', 'comp', (.05, .4, .40, 1)),
              ('speedR', 'comp', (.8, .4, .95, .75))],
 'anatomy': [('cube', 'comp', (.72, .53, .76, .57)), ('pTL', 'comp', (.61, .41, .65, .45)), ('pTR', 'comp', (.82, .36, .86, .40)),
             ('pBR', 'comp', (.81, .80, .85, .84)), ('pBL', 'comp', (.63, .80, .67, .84))],
}

# the target's arrow (it flies in): measured on a zoom of the trace (px → cell fractions); the shaft band + the fletching are the
# arrow; under it the rings are put back by mirroring the target through its centre ('reflect': the wide band, the target's radius)
def _z(x, y): return (round(.6365 + x / 2875, 4), round(.2318 + y / 975, 4))
def _band(p0, p1, hw, back=0):
    import math
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]; L = math.hypot(dx, dy); ux, uy = dx / L, dy / L; nx, ny = -uy, ux
    a = (p0[0] - ux * back, p0[1] - uy * back)
    return [(a[0] + nx * hw, a[1] + ny * hw), (p1[0] + nx * hw, p1[1] + ny * hw), (p1[0] - nx * hw, p1[1] - ny * hw), (a[0] - nx * hw, a[1] - ny * hw)]
_FL = [(552, 150), (560, 104), (626, 22), (652, 12), (712, 70), (646, 168), (590, 192)]
PARTS['target'].append(('arrow', 'reflectcut', ([_z(*q) for q in _band((343, 384), (566, 174), 34, 40)], [_z(*q) for q in _FL]),
                        {'r': .098, 'pivot': _z(345, 382)}))
