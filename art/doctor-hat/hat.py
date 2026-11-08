import os, glob, sys
from PIL import Image, ImageDraw
R='../../public/game/characters/protagonist/'
OUT='frames/'
OL=(16,12,13,255); CROWN=(40,33,32,255); BRIM=(31,26,26,255); HI=(70,58,52,255); BAND=(86,62,44,255)
HAIR=(96,68,50,255); HAIRD=(66,46,36,255); TIE=(120,40,52,255)

def head_info(im, facing):
    px=im.load(); W,H=im.size
    ys=[y for y in range(H) if any(px[x,y][3] for x in range(W))]
    y0=ys[0]
    xs=[x for y in range(y0,y0+4) for x in range(W) if px[x,y][3]]
    cx=(min(xs)+max(xs))/2
    # head extents at rows y0+6..y0+12
    row=[x for y in range(y0+6,y0+12) for x in range(W) if px[x,y][3]]
    return y0,cx,min(xs),max(xs)

def pix_ellipse(d,box,fill):
    d.ellipse(box,fill=fill)

def add_hat(im, facing, bob=0):
    y0,cx,xl,xr=head_info(im,facing)
    cx=round(cx)
    sh={'east':1,'west':-1}.get(facing,0)
    lay=Image.new('RGBA',im.size,(0,0,0,0)); d=ImageDraw.Draw(lay)
    # brim (outline then fill)
    bx=cx+sh*1
    d.ellipse((bx-16,y0-1,bx+16,y0+8),fill=OL)
    d.ellipse((bx-15,y0,bx+15,y0+7),fill=BRIM)
    # crown
    d.rectangle((cx-7,y0-5,cx+7,y0+3),fill=OL)
    d.rectangle((cx-6,y0-4,cx+6,y0+3),fill=CROWN)
    d.line((cx-6,y0-4,cx+6,y0-4),fill=HI)
    d.rectangle((cx-6,y0+1,cx+6,y0+2),fill=BAND)
    # front brim edge highlight
    d.arc((bx-15,y0,bx+15,y0+7),20,160,fill=HI)
    # redraw crown over brim's back half so crown sits on top of the brim
    d.rectangle((cx-6,y0-4,cx+6,y0+2),fill=CROWN)
    d.line((cx-6,y0-4,cx+6,y0-4),fill=HI)
    d.rectangle((cx-6,y0+1,cx+6,y0+2),fill=BAND)
    out=im.copy(); out.alpha_composite(lay); return out,(y0,cx,xl,xr)

def add_tail(im, facing, info, phase=0):
    y0,cx,xl,xr=info
    lay=Image.new('RGBA',im.size,(0,0,0,0)); d=ImageDraw.Draw(lay); px=im.load()
    if facing=='north':
        # hangs from the nape down over the back
        top=y0+13
        sway=[0,1,0,-1][phase%4]
        pts=[(cx+(0 if i<4 else sway*(i-3)//3),top+i) for i in range(11)]
        for i,(x,y) in enumerate(pts):
            w=2 if i<8 else (1 if i<10 else 0)
            d.rectangle((x-w,y,x+w,y),fill=HAIR)
            d.point((x-w,y),fill=HAIRD); d.point((x+w,y),fill=HAIRD)
        d.rectangle((cx-1,top,cx+1,top+1),fill=TIE)
        for (x,y) in pts[-1:]: d.point((x,y+1),fill=HAIRD)
    elif facing in('east','west'):
        s=-1 if facing=='east' else 1   # tail goes opposite the beak
        bx=(xl if facing=='east' else xr)
        top=y0+9
        sway=[0,1,0,-1][phase%4]
        for i in range(11):
            x=bx+s*(2+ (1 if i>3 else 0))+s*(sway if i>4 else 0)
            y=top+i
            w=2 if i<8 else 1
            if s<0: d.rectangle((x-w,y,x,y),fill=HAIR); d.point((x-w,y),fill=HAIRD)
            else: d.rectangle((x,y,x+w,y),fill=HAIR); d.point((x+w,y),fill=HAIRD)
        d.rectangle((bx+s*1-(1 if s<0 else 0),top,bx+s*1+(0 if s<0 else 1),top+1),fill=TIE)
    out=im.copy(); out.alpha_composite(lay); return out

def process(path, facing, k):
    im=Image.open(path).convert('RGBA')
    h,info=add_hat(im,facing)
    return add_tail(h,facing,info,k)

if __name__=='__main__':
    os.makedirs(OUT,exist_ok=True)
    sets=[('walk','north',4),('walk','east',4),('walk','west',4),('walk','south',4),('run','north',8),('run','east',8),('run','south',8)]
    for kind,dr,n in sets:
        od=f'{OUT}{kind}/{dr}/'; os.makedirs(od,exist_ok=True)
        for i in range(n):
            process(f'{R}{kind}/{dr}/{i}.png',dr,i).save(od+f'{i}.png')
    os.makedirs(OUT+'idle',exist_ok=True)
    for dr in ('north','east','south','west'):
        process(f'{R}idle/{dr}.png',dr,0).save(OUT+f'idle/{dr}.png')
    print('done')
