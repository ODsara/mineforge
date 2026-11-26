"""基线截图客观图像分析：背景色带、内容密度曲线、平坦度。
用法：python -I scripts/img_analysis.py <png> [...]
输出每图：主背景色、背景色分段（top,height,color）、内容密度统计、留白占比。
"""
import sys
from PIL import Image
from collections import Counter

def analyze(path):
    im = Image.open(path).convert("RGB")
    W, H = im.size
    px = im.load()
    # 主背景：取四角与边缘中点
    corners = [px[2,2], px[W-3,2], px[2,H-3], px[W-3,H-3], px[W//2,2]]
    bg = Counter(corners).most_common(1)[0][0]
    # 逐行采样（每4行），统计该行与背景差异>18的像素占比 = 内容密度
    step = 4
    densities = []
    rowbg = []
    xs = list(range(0, W, max(1, W//240)))
    for y in range(0, H, step):
        diff = 0
        cnt = Counter()
        for x in xs:
            r,g,b = px[x,y]
            if abs(r-bg[0])+abs(g-bg[1])+abs(b-bg[2]) > 40:
                diff += 1
            cnt[(r//8*8, g//8*8, b//8*8)] += 1
        densities.append(diff/len(xs))
        rowbg.append(cnt.most_common(1)[0][0])
    # 背景色分段：把连续相近的行主色合并
    segs = []
    for i, c in enumerate(rowbg):
        y = i*step
        if segs and abs(c[0]-segs[-1][2][0])+abs(c[1]-segs[-1][2][1])+abs(c[2]-segs[-1][2][2]) < 24:
            segs[-1][1] = y+step
        else:
            segs.append([y, y+step, c])
    # 只保留高度>=120px 的段
    big = [(a,b,tuple(v)) for a,b,v in segs if b-a >= 120]
    empty = sum(1 for d in densities if d < 0.02)/len(densities)
    low = sum(1 for d in densities if d < 0.08)/len(densities)
    print(f"\n=== {path}  ({W}x{H}) ===")
    print(f"主背景 rgb{bg} #{bg[0]:02x}{bg[1]:02x}{bg[2]:02x}")
    print(f"近空白行占比 {empty*100:.1f}%  低密度行占比 {low*100:.1f}%  平均密度 {sum(densities)/len(densities)*100:.1f}%")
    print("背景色分段（top→bottom, 高度>=120px）:")
    for a,b,c in big:
        print(f"  y{a:5d}-{b:5d} h={b-a:5d}  #{c[0]:02x}{c[1]:02x}{c[2]:02x}")
    # 内容密度峰值区（主视觉候选）
    peaks = sorted(range(len(densities)), key=lambda i:-densities[i])[:5]
    print("密度最高行带:", [(p*step, round(densities[p],2)) for p in sorted(peaks)])

for p in sys.argv[1:]:
    try:
        analyze(p)
    except Exception as e:
        print(p, "ERR", e)