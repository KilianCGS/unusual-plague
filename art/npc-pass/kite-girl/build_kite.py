import math, sys
from PIL import Image, ImageDraw
W,H=120,136
OX=-20
GY=40
def kite_frame(girl, t, n=8, spool=(34,35)):
    im=Image.new('RGBA',(W,H),(0,0,0,0))
    g=girl.copy()
    # breathing: upper body 1px down on half the frames
    ph=math.sin(2*math.pi*t/n)
    im.alpha_composite(g,(OX,GY))
    if ph<-0.3:
        up=g.crop((0,0,96,60)); low=g.copy()
        for y in range(60):
            for x in range(96): low.putpixel((x,y),(0,0,0,0))
        im=Image.new('RGBA',(W,H),(0,0,0,0)); im.alpha_composite(low,(OX,GY)); im.alpha_composite(up,(OX,GY+1))
    d=ImageDraw.Draw(im)
    ang=math.radians(18+9*math.sin(2*math.pi*t/n+0.6))
    cx=92+2*math.sin(2*math.pi*t/n+1.2); cy=28+2*math.sin(2*math.pi*t/n)
    def rot(px,py):
        c,s=math.cos(ang),math.sin(ang); return (cx+px*c-py*s, cy+px*s+py*c)
    # kite local coords: top, right, bottom, left
    top,right,bot,left=rot(0,-11),rot(7,-3),rot(0,10),rot(-7,-3)
    O=(42,22,14,255); RED=(216,76,52,255); DRED=(164,46,36,255); CREAM=(226,206,160,255); STK=(110,72,40,255)
    R=lambda p:(round(p[0]),round(p[1]))
    # string: spool -> kite bottom, with sag
    sx,sy=spool[0],spool[1]+GY
    bx,by=bot
    ctrl=((sx+bx)/2-3, (sy+by)/2+9+3*math.sin(2*math.pi*t/n))
    pts=[]
    for i in range(61):
        u=i/60
        x=(1-u)**2*sx+2*(1-u)*u*ctrl[0]+u*u*bx
        y=(1-u)**2*sy+2*(1-u)*u*ctrl[1]+u*u*by
        pts.append((round(x),round(y)))
    for p in pts: d.point(p,fill=(222,206,168,255))
    # tail: hangs from bottom, waves
    tail=[]
    for i in range(1,15):
        tx=bx - i*1.1*math.cos(ang*0.6)+3*math.sin(i*0.7-2*math.pi*t/n)
        ty=by + i*1.3
        tail.append((round(tx),round(ty)))
    for p in tail: d.point(p,fill=O)
    for k,col in ((4,CREAM),(8,(214,160,60,255)),(12,CREAM)):
        x,y=tail[k]; 
        for dx,dy in ((-1,0),(1,0),(0,-1),(0,1)): d.point((x+dx,y+dy),fill=col)
        d.point((x,y),fill=O)
    # kite body: outline then halves
    d.polygon([R(top),R(right),R(bot),R(left)],fill=O)
    # inner fabric (shrink toward centre)
    def sh(p,k=0.72): return (cx+(p[0]-cx)*k, cy+(p[1]-cy)*k)
    ct=rot(0,-2)
    d.polygon([R(sh(top,.8)),R(sh(right,.8)),R(ct),R(sh(left,.8))],fill=RED)
    d.polygon([R(ct),R(sh(right,.8)),R(sh(bot,.82)),R(sh(left,.8))],fill=DRED)
    # sticks
    d.line([R(rot(0,-9)),R(rot(0,8))],fill=STK); d.line([R(rot(-5,-3)),R(rot(5,-3))],fill=STK)
    return im
if __name__=='__main__':
    for name in ('c',):
        girl=Image.open(f'girl-{name}.png').convert('RGBA')
        import os; os.makedirs(f'frames-{name}',exist_ok=True)
        fr=[kite_frame(girl,t) for t in range(8)]
        for i,f in enumerate(fr): f.save(f'frames-{name}/{i}.png')
        S=3; sh=Image.new('RGBA',(W*S*4,H*S*2),(120,140,90,255))
        for i,f in enumerate(fr): sh.alpha_composite(f.resize((W*S,H*S),Image.NEAREST),((i%4)*W*S,(i//4)*H*S))
        sh.convert('RGB').save(f'sheet-kite-{name}.png')
        print(name,[f.getbbox() for f in fr][:2])
