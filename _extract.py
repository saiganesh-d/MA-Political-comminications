# -*- coding: utf-8 -*-
import fitz, io
d = fitz.open('political communication (1).pdf')
p = d[0]

# 1) TEXT: merge spans into lines, output sorted
data = p.get_text('dict')
lines=[]
for b in data['blocks']:
    if b['type']!=0: continue
    for l in b['lines']:
        txt=''.join(s['text'] for s in l['spans'])
        if not txt.strip(): continue
        sizes=[round(s['size'],1) for s in l['spans']]
        x0=min(s['bbox'][0] for s in l['spans']); x1=max(s['bbox'][2] for s in l['spans'])
        y0=min(s['bbox'][1] for s in l['spans'])
        lines.append((round(y0,1),round(x0,1),round(x1,1),max(sizes),txt))
lines.sort()
with io.open('_TEXT.txt','w',encoding='utf-8') as f:
    for y,x0,x1,sz,t in lines:
        region = 'FRAME' if x0 < 1924 else 'OVERFLOW'
        f.write(f'y={y:8.1f} x={x0:7.1f}-{x1:7.1f} sz={sz:5.1f} [{region:8s}] {t}\n')

# 2) IMAGES: placement rects
with io.open('_IMAGES.txt','w',encoding='utf-8') as f:
    info = p.get_image_info(xrefs=True)
    info.sort(key=lambda i:(round(i['bbox'][1]), round(i['bbox'][0])))
    f.write(f'count={len(info)}\n')
    for im in info:
        b=im['bbox']
        region = 'FRAME' if b[0] < 1924 else 'OVERFLOW'
        f.write(f"xref={im.get('xref')} y={b[1]:8.1f} x={b[0]:7.1f} w={b[2]-b[0]:7.1f} h={b[3]-b[1]:7.1f} px={im['width']}x{im['height']} [{region}]\n")

print('done. lines=',len(lines))
