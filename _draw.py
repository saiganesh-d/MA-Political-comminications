# -*- coding: utf-8 -*-
import fitz, io
from collections import Counter
d=fitz.open('political communication (1).pdf'); p=d[0]
draws=p.get_drawings()
fills=Counter()
rects=[]
for dr in draws:
    fc=dr.get('fill'); 
    if fc is None: continue
    hexc='#%02x%02x%02x'%(int(fc[0]*255),int(fc[1]*255),int(fc[2]*255))
    r=dr['rect']
    if r.width<2 or r.height<2: continue
    fills[hexc]+= r.width*r.height
    rects.append((round(r.y0,0),round(r.x0,0),round(r.width,0),round(r.height,0),hexc))
with io.open('_COLORS.txt','w',encoding='utf-8') as f:
    f.write('=== fill colors by total area ===\n')
    for c,a in fills.most_common(40):
        f.write(f'{c}  area={int(a)}\n')
    f.write('\n=== notable filled rects (y-sorted, area>8000) ===\n')
    rects.sort()
    for y,x,w,h,c in rects:
        if w*h<8000: continue
        reg='FRAME' if x<1924 else 'OVF'
        f.write(f'y={y:7.0f} x={x:7.0f} w={w:6.0f} h={h:6.0f} {c} [{reg}]\n')
print('drawings:',len(draws),'colored rects:',len(rects))
