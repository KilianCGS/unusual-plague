import os, glob, sys
from PIL import Image, ImageDraw
R='previous-frames/'
OUT='frames/'
OL=(16,12,13,255); CROWN=(40,33,32,255); BRIM=(31,26,26,255); HI=(70,58,52,255); BAND=(86,62,44,255)
HAIR=(81,54,43,255); HAIRD=(58,38,31,255); TIE=(120,40,52,255)

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

HAIRL=(99,68,54,255)

def add_hat(im, facing, bob=0):
    y0,cx,xl,xr=head_info(im,facing)
    cx=round(cx)
    sh={'east':1,'west':-1}.get(facing,0)
    lay=Image.new('RGBA',im.size,(0,0,0,0)); d=ImageDraw.Draw(lay)
    bx=cx+sh*1
    # brim: ellipse whose ends curl slightly up
    d.ellipse((bx-16,y0+1,bx+16,y0+7),fill=OL)
    d.ellipse((bx-15,y0+2,bx+15,y0+6),fill=BRIM)
    # crown: tapered dome (wider at the base, rounded top, soft pinch)
    def crown(fill,grow):
        g=grow
        d.polygon([(cx-7-g,y0+4+g),(cx-6-g,y0-1),(cx-5-g,y0-4),(cx-3-g,y0-6-g),
                   (cx+3+g,y0-6-g),(cx+5+g,y0-4),(cx+6+g,y0-1),(cx+7+g,y0+4+g)],fill=fill)
    crown(OL,1); crown(CROWN,0)
    # highlight on the dome and the soft pinch down the middle
    d.line((cx-3,y0-5,cx+3,y0-5),fill=HI)
    d.point((cx-4,y0-4),fill=HI)
    d.line((cx,y0-5,cx,y0-4),fill=OL)
    d.rectangle((cx-6,y0+2,cx+6,y0+3),fill=BAND)
    d.point((cx+3,y0+2),fill=HI)  # buckle glint
    out=im.copy(); out.alpha_composite(lay); return out,(y0,cx,xl,xr)

def add_tail(im, facing, info, phase=0):
    y0,cx,xl,xr=info
    lay=Image.new('RGBA',im.size,(0,0,0,0)); d=ImageDraw.Draw(lay)
    sway=[0,1,0,-1][phase%4]
    if facing=='north':
        top=y0+15
        widths=[3,4,4,4,4,4,4,3,3,3,2,2,1]
        for i,w in enumerate(widths):
            x=cx+(sway*(i-4)//4 if i>4 else 0)
            y=top+i
            d.rectangle((x-w-1,y,x+w+1,y),fill=OL)
            d.rectangle((x-w,y,x+w,y),fill=HAIR)
            for k in range(-w+1,w+1):
                if k%2==0 and abs(k)<w: d.point((x+k,y),fill=HAIRD)
            if i>1 and w>1: d.point((x-1,y),fill=HAIRL)
        d.rectangle((cx-4,top-1,cx+4,top),fill=TIE)
        d.point((cx+sway,top+len(widths)),fill=OL)
    elif facing in('east','west'):
        s=-1 if facing=='east' else 1
        bx=(xl if facing=='east' else xr)
        top=y0+9
        widths=[3,4,4,5,5,5,4,4,3,3,2,1]
        for i,w in enumerate(widths):
            y=top+i
            off=1+(i//4)+(sway if i>5 else 0)
            x0=bx+s*off
            xa,xb=(x0-w+1,x0) if s<0 else (x0,x0+w-1)
            d.rectangle((xa-1,y,xb+1,y),fill=OL)
            d.rectangle((xa,y,xb,y),fill=HAIR)
            for k in range(xa,xb+1):
                if (k-xa)%2==1: d.point((k,y),fill=HAIRD)
            if w>2: d.point((xa+(1 if s>0 else w-2),y),fill=HAIRL)
        tx=bx+s*1
        d.rectangle((min(tx,tx+s*3),top-1,max(tx,tx+s*3),top),fill=TIE)
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
