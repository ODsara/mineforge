"""前后设计度量对比：python -I scripts/compare.py"""
import json
b = json.load(open(".design/audit-before.json", encoding="utf-8"))
a = json.load(open(".design/audit-after.json", encoding="utf-8"))
print(f"{'页面':22s} {'指标':14s} {'前':>8s} {'后':>8s}")
for name in b:
    if name not in a: continue
    for w in ["1440", "375"]:
        if w not in b[name] or w not in a[name]: continue
        pb, pa = b[name][w], a[name][w]
        rows = [
            ("卡片数", pb["cardCount"], pa["cardCount"]),
            ("图片数", len(pb["imgs"]), len(pa["imgs"])),
            ("低对比<4.5", pb["lowContrastCount"], pa["lowContrastCount"]),
            ("小字<12px", pb["tinyTextCount"], pa["tinyTextCount"]),
            ("小触控<40", pb["smallTargetCount"], pa["smallTargetCount"]),
            ("页高px", pb["pageH"], pa["pageH"]),
        ]
        for label, vb, va in rows:
            mark = "" if vb == va else (" ↓" if va < vb else " ↑")
            print(f"{name+'@'+w:22s} {label:14s} {vb:8d} {va:8d}{mark}")
    print()
# 标题层级对比（详情页）
for name in ["d-room-pillar", "d-shrinkage", "home", "methods"]:
    hb = {h["tag"]+h["text"]: h["size"] for h in b[name]["1440"]["heads"]}
    ha = {h["tag"]+h["text"]: h["size"] for h in a[name]["1440"]["heads"]}
    print(f"== {name} 标题字号 ==")
    for k in list(ha)[:6]:
        print(f"  {k[:30]:32s} {hb.get(k,'-'):>6} -> {ha[k]:>6}")