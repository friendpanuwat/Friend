# keep boxes as fractions of the cell (x0, y0, x1, y1); acc = boxes whose enclosed regions take the accent
P = {
 'cycle': [(.6, .25, .9, 1)], 'stair': [(.5, .2, .97, .99)], 'roadmap': [(.12, .3, .9, .95)],
 'path': [(.05, .3, .42, 1), (.58, .3, .99, 1)], 'target': [(.08, .3, .45, 1), (.6, .3, .97, 1)],
 'choice': [(.03, .3, .99, .99)], 'maze': [(.1, .2, .9, .99)], 'puzzle': [(.1, .2, .97, .99)],
 'scales': [(.05, .02, .95, .99)], 'tangle': [(.0, .2, 1, .99)], 'compass': [(.62, .1, .99, .99)],
 'stop': [(.1, .3, .45, 1)], 'chain': [(.03, .3, .6, .9)], 'fire': [(.1, .3, .44, 1)], 'pit': [(.6, .3, .96, 1)],
 'fragile': [(.15, .3, .5, 1)], 'star': [(.6, .2, .96, 1)], 'treasure': [(.1, .25, .46, 1)],
 'breakwall': [(.04, .28, .46, 1)], 'jigsaw': [(.6, .2, .97, 1)], 'gift': [(.1, .3, .45, 1)],
 'seasons': [(.03, .35, .97, 1)], 'countdown': [(.12, .3, .88, 1)], 'match': [(.08, .45, .97, 1)],
 'hammer': [(.03, .1, .97, 1)], 'plane': [(.05, .1, .97, 1)], 'keyhole': [(.38, .3, .62, 1)],
 'iceberg': [(.6, .3, .99, 1)], 'map': [(.55, .3, .98, 1)], 'shortcut': [(.03, .5, .99, 1)],
 'cheat': [(.03, .4, .26, 1)], 'nugget': [(.03, .45, .99, 1)], 'knockout': [(.03, .25, .99, 1)],
 'micdrop': [(.6, .25, .97, 1)], 'balloon': [(.08, .25, .55, 1)], 'fireworks': [(.03, .25, .99, 1)],
 'anatomy': [(.55, .3, .86, 1)],
}
# the key part that takes the style's accent (cell fractions)
ACC = {
 'cycle': [(.6, .25, .9, 1)], 'stair': [(.5, .2, .97, .99)], 'roadmap': [(.78, .25, .9, .6)], 'path': [(.58, .4, .97, .75)],
 'target': [(.62, .3, .88, 1)], 'choice': [], 'maze': [], 'puzzle': [(.75, .2, .97, .45)],
 'scales': [(.1, .45, .9, .85)], 'tangle': [(.65, .2, .85, 1)], 'compass': [(.68, .25, .92, .95)], 'stop': [(.1, .3, .45, 1)],
 'chain': [(.45, .3, .6, .9)], 'fire': [(.15, .3, .4, .8)], 'pit': [(.65, .3, .85, .85)], 'fragile': [(.32, .55, .5, 1)],
 'star': [(.6, .2, .96, 1)], 'treasure': [(.15, .25, .42, .55)], 'breakwall': [(.28, .28, .36, .8)], 'jigsaw': [(.75, .2, .97, .6)],
 'gift': [(.1, .3, .45, 1)], 'seasons': [(.75, .35, .97, 1)], 'countdown': [(.66, .3, .88, 1)], 'match': [(.75, .45, .97, 1)],
 'hammer': [(.6, .1, .97, 1)], 'plane': [(.65, .1, .97, 1)], 'keyhole': [(.38, .3, .62, 1)], 'iceberg': [(.55, .55, .99, 1)],
 'map': [(.78, .4, .97, .8)], 'shortcut': [(.4, .55, .7, .85)], 'cheat': [(.1, .4, .2, .6)], 'nugget': [(.8, .4, .9, .8)],
 'knockout': [(.55, .4, .85, 1)], 'micdrop': [(.74, .22, .99, .62)], 'balloon': [(.08, .25, .4, 1)], 'fireworks': [],
 'anatomy': [(.62, .5, .74, .8)],
}
THR = {'nugget': 185, 'balloon': 135, 'tangle': 150, 'fireworks': 170, 'roadmap': 160, 'map': 185, 'path': 160, 'target': 165}

# pieces dropped when they lie wholly in one of these boxes (stray marks, bits of the cell's title)
DROP = {'iceberg': [(.58, .4, .7, .62)], 'map': [(.28, .28, .66, .52), (.53, .3, .61, .6)], 'shortcut': [(.33, .35, .82, .62)], 'nugget': [(.3, .45, .75, .62)]}
MINA = {'cycle': 260}                 # smallest piece kept (sheet px²): the cycle's numbers go
THICK = {'treasure', 'iceberg'}       # the solid bright blobs (the chest's light, the ice above water) take the accent
TB = {'choice': .3, 'compass': .22, 'maze': .3, 'puzzle': .3, 'scales': 0, 'tangle': .3}   # how far down the cell's title reaches
EDGE = {'map', 'nugget'}      # grey-filled drawings with faint outlines: their edges are found from the grey steps too
