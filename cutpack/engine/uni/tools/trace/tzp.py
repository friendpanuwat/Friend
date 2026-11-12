"""tz.py id x0 y0 x1 y1 out: zoom of the trace (cell fractions) with a .01 grid"""
import sys, cv2, numpy as np
sys.path.insert(0,'.')
from cells import CELLS; from picks import P
id_=sys.argv[1]; a,b,c,d=[float(v) for v in sys.argv[2:6]]; out=sys.argv[6]
C={k[0]:k for k in CELLS}; f,x0,y0,x1,y1=C[id_][3]; g=cv2.imread(f,0)[y0:y1,x0:x1]; h,w=g.shape
bx=[(int(p*w),int(q*h),int(r*w),int(s*h)) for p,q,r,s in P[id_]]; X0=min(k[0] for k in bx); Y0=min(k[1] for k in bx)
t=cv2.imread(f'pt_{id_}.png'); S=5
X=lambda v:max(0,int((v*w-X0)*S)); Y=lambda v:max(0,int((v*h-Y0)*S))
cc=t[Y(b):Y(d), X(a):X(c)].copy(); k=min(1., 900/max(cc.shape[:2])); cc=cv2.resize(cc,None,fx=k,fy=k)
for v in np.arange(a,c,.01):
    px=int((X(v)-X(a))*k); cv2.line(cc,(px,0),(px,cc.shape[0]),(0,0,255) if round(v*100)%5==0 else (0,0,120),1)
    if round(v*100)%2==0: cv2.putText(cc,f'{v:.2f}',(px+2,12),0,.33,(90,90,255),1)
for v in np.arange(b,d,.01):
    py=int((Y(v)-Y(b))*k); cv2.line(cc,(0,py),(cc.shape[1],py),(255,0,0) if round(v*100)%5==0 else (120,0,0),1)
    if round(v*100)%2==0: cv2.putText(cc,f'{v:.2f}',(2,py-2),0,.33,(255,140,90),1)
cv2.imwrite(out,cc); print(cc.shape)
