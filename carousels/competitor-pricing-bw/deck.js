/* ตั้งราคาตามคู่แข่ง — 8 slides, theme bw + semantic colour (profit green / profit-down + loss red). Numbers on 4–5 = user's hypothetical example. */

/* price tag: pointed left end + hole. inv = dark tag (for light slides) */
function priceTag(p, lab, price, t, pos, {w = 300, h = 160, rot = 0, inv = false, hole = 'var(--bg)', size = 72} = {}) {
  const o = div(`${pos};width:${w}px;height:${h}px`, p);
  const r = div(`left:0;top:0;width:100%;height:100%;transform:rotate(${rot}deg)`, o);
  const bg = inv ? 'var(--fg)' : 'var(--fg)', ink = 'var(--bg)';
  div(`left:0;top:0;width:100%;height:100%;background:${bg};border-radius:0 18px 18px 0;clip-path:polygon(${h * .38}px 0,100% 0,100% 100%,${h * .38}px 100%,0 50%)`, r);
  div(`left:${h * .2}px;top:${h / 2 - 12}px;width:24px;height:24px;border-radius:50%;background:${hole}`, r);
  div(`left:${h * .52}px;top:${h * .16}px;${LBL};color:${ink}`, r, esc(lab));
  div(`left:${h * .52}px;top:${h * .36}px;font-family:Display;font-weight:700;font-size:${size}px;letter-spacing:-.03em;line-height:1;color:${ink};white-space:nowrap`, r, esc(price));
  popIn(o, t);
  return o;
}

/* 1 · Hook · dark */
slide({tone: 'dark'}, s => {
  tag(s, 'ตั้งราคา', .05, 'left:80px;top:140px', {dot: true});
  title(s, 'ตั้งราคาตามคู่แข่ง\nคือเหตุผลที่กำไร\n__บางลงทุกเดือน__', .15, 'left:80px;top:205px', {size: 96, lh: 1.36});
  priceTag(s, 'ร้านเรา', '฿199', .6, 'left:80px;top:628px', {rot: -3});
  priceTag(s, 'คู่แข่ง', '฿199', .75, 'left:420px;top:628px', {rot: 3});
  const lb = div('left:80px;top:836px;display:flex;align-items:center;gap:14px;font-family:Display;font-weight:700;font-size:32px;color:var(--neg)', s, 'กำไร' + ico('arrow-down', 40, 'currentColor', 3));
  popIn(lb, 1.1);
  line(s, [[0, 6], [160, 20], [300, 40], [440, 70]], 1.0, 'left:250px;top:822px', {w: 450, h: 76, sw: 7, area: false, dot: true, color: 'var(--neg)'});
});

/* 2 · Setup · light · two shop mockups, same price, SALE */
slide({tone: 'light'}, s => {
  tag(s, 'ปัญหา', .05, 'left:80px;top:140px');
  title(s, 'คู่แข่งขาย 199 เราก็ขาย 199\nคู่แข่งลดราคา เราก็__ลดตาม__', .12, 'left:80px;top:205px', {size: 64, lh: 1.36});
  [['ร้านเรา', 80], ['ร้านคู่แข่ง', 550]].forEach(([nm, x], k) => {
    const t = .4 + k * .2;
    const c = box(s, `left:${x}px;top:430px;width:450px;height:300px`, t, {style: 'solid'});
    div('left:32px;top:30px;display:flex;align-items:center;gap:12px;color:var(--fg)', c, ico('store', 34, 'currentColor', 2.4) + `<span style="${LBL};color:var(--fg)">${nm}</span>`);
    div('left:32px;top:94px;width:160px;height:170px;border-radius:16px;background:color-mix(in srgb,var(--fg) 8%,transparent);display:flex;align-items:center;justify-content:center;color:var(--fg)', c, ico('package', 72, 'currentColor', 1.8));
    skel(c, 'left:220px;top:104px;width:190px', [.95, .6], {t: t + .1, h: 16});
    num(c, '฿199', t + .2, 'left:218px;top:166px', {size: 64, count: false});
    div('left:220px;top:240px;width:190px;height:24px;border-radius:99px;background:var(--fg)', c);
    const st = div(`left:${x + 318}px;top:398px;width:120px;height:120px;border-radius:50%;background:var(--fg);color:var(--bg);display:flex;align-items:center;justify-content:center;font-family:Display;font-weight:700;font-size:34px;letter-spacing:.02em;transform:rotate(-14deg)`, s, 'SALE');
    const w = div(`left:0;top:0;width:0;height:0`, s); w.appendChild(st);
    popIn(w, t + .45);
  });
  const b = box(s, 'left:80px;top:756px;width:920px;height:116px', 1.2, {style: 'accent'});
  div('left:34px;top:30px;width:56px;height:56px;display:flex;align-items:center;justify-content:center', b, ico('trending-down', 42, 'var(--acc-ink)', 2.6));
  title(b, 'ขายได้เยอะ แต่ไม่เหลืออะไร', 1.3, 'left:110px;top:32px', {size: 38, W: 780, color: 'var(--acc-ink)'});
});

/* 3 · Cause · dark · two cost bars, one price line */
slide({tone: 'dark'}, s => {
  tag(s, 'สาเหตุ', .05, 'left:80px;top:140px');
  title(s, 'ต้นทุนแต่ละร้าน\n__ไม่เท่ากัน__', .12, 'left:80px;top:205px', {size: 84, lh: 1.36});
  body(s, 'ราคาที่คู่แข่งอยู่ได้\nอาจเป็นราคาที่\n**เราขาดทุน**', .4, 'left:80px;top:500px', {W: 420, size: 38, step: .2});
  const c = box(s, 'left:520px;top:440px;width:480px;height:460px', .5);
  const base = 380, priceY = 170;
  [['คู่แข่ง', 80, 160], ['ร้านเรา', 270, 310]].forEach(([nm, x, hgt], k) => {
    const t = .7 + k * .25;
    const bar = div(`left:${x}px;top:${base - hgt}px;width:130px;height:${hgt}px;border-radius:14px 14px 4px 4px;background:${k ? 'var(--fg)' : 'color-mix(in srgb,var(--fg) 45%,transparent)'};transform-origin:50% 100%;overflow:hidden`, c);
    if (k) div(`left:0;top:0;width:100%;height:${hgt - (base - priceY)}px;background:var(--neg)`, bar);
    A(bar, [{transform: 'scaleY(0)'}, {transform: 'scaleY(1)'}], t, .6, {e: SMOOTH});
    label(c, nm, `left:${x}px;top:${base + 16}px;width:130px;text-align:center`, {color: 'var(--fg)'});
  });
  label(c, 'ต้นทุน', 'left:36px;top:32px');
  const pl = div(`left:30px;top:${priceY - 2}px;width:420px;height:0;border-top:5px dashed var(--fg);transform-origin:0 50%`, c);
  A(pl, [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], 1.3, .5, {e: SMOOTH});
  const pt = label(c, 'ราคาขาย', `left:80px;top:${priceY - 46}px`, {color: 'var(--fg)'}); popIn(pt, 1.5);
  const lt = label(c, 'ขาดทุน', `left:270px;top:${base - 310 + 26}px;width:130px;text-align:center`, {color: '#FFFFFF'}); popIn(lt, 1.6);
});

/* 4 · Example · light · one stacked bar, profit smallest on top */
slide({tone: 'light'}, s => {
  tag(s, 'ตัวอย่างสมมติ', .05, 'left:80px;top:140px', {icon: 'store'});
  const T = title(s, 'ขาย 199 บาท\nเหลือกำไรจริง __24 บาท__', .12, 'left:80px;top:205px', {size: 76, lh: 1.36});
  const segs = [['ต้นทุนสินค้า', 120, 'var(--fg)'], ['ค่าแพ็ก + ค่าส่ง', 30, 'color-mix(in srgb,var(--fg) 58%,transparent)'],
                ['ค่าธรรมเนียมแพลตฟอร์ม', 25, 'color-mix(in srgb,var(--fg) 30%,transparent)'], ['กำไร', 24, 'var(--pos)']];
  const a = box(s, 'left:80px;top:430px;width:640px;height:470px', .35, {style: 'solid'});
  const row = (y, lab, val, sw, {sz = 30, col = 'var(--fg)', font = 'Body', wt = 600} = {}) =>
    div(`left:36px;top:${y}px;width:568px;display:flex;align-items:center;gap:16px;font-family:${font};font-weight:${wt};font-size:${sz}px;color:${col};white-space:nowrap`, a,
      (sw ? `<span style="width:22px;height:22px;border-radius:6px;background:${sw};flex:none"></span>` : '') + `<span style="flex:1">${lab}</span><span style="font-family:Display;font-weight:700">${val}</span>`);
  row(34, 'ราคาขาย', '199', null, {sz: 34});
  div('left:36px;top:100px;width:568px;height:2px;background:var(--line)', a);
  segs.slice(0, 3).forEach(([lab, v, col], k) => row(128 + k * 64, '− ' + lab, String(v), col));
  div('left:36px;top:330px;width:568px;height:2px;background:var(--line)', a);
  label(a, 'เหลือกำไรจริง', 'left:36px;top:358px', {color: 'var(--fg)'});
  div('left:36px;top:394px;display:flex;align-items:baseline;gap:14px;font-family:Display;font-weight:700;color:var(--pos);white-space:nowrap', a,
    '<span style="font-size:52px;letter-spacing:-.03em">24 บาท</span><span style="font-size:36px">(12%)</span>');
  const b = box(s, 'left:740px;top:430px;width:260px;height:470px', .55, {style: 'solid'});
  const tot = 199, H0 = 400, bw = 120, bx = 70;
  let y = 36 + H0;
  segs.forEach(([lab, v, col], k) => {
    const h = Math.round(v / tot * H0);
    y -= h;
    const sg = div(`left:${bx}px;top:${y}px;width:${bw}px;height:${h - 4}px;border-radius:${k === 3 ? '12px 12px 4px 4px' : '4px'};background:${col};transform-origin:50% 100%`, b);
    A(sg, [{transform: 'scaleY(0)', opacity: 0}, {transform: 'scaleY(1)', opacity: 1}], .7 + k * .18, .4, {e: SMOOTH});
  });
  const pc = div(`left:0;top:${y - 4}px;width:${bx - 12}px;text-align:right;font-family:Display;font-weight:700;font-size:28px;color:var(--pos)`, b, '12%');
  popIn(pc, 1.5);
});

/* 5 · How · dark · cost + profit = price */
slide({tone: 'dark'}, s => {
  tag(s, 'วิธีตั้งราคา', .05, 'left:80px;top:140px');
  title(s, '__Cost-plus__ Pricing', .12, 'left:80px;top:205px', {size: 84, lh: 1.36});
  body(s, '(การตั้งราคาจากต้นทุนบวกกำไร)', .3, 'left:80px;top:330px', {W: 920, size: 30});
  const eq = [['package', 'ต้นทุน', null], ['percent', 'กำไร', null], ['tag', 'ราคา', 'accent']];
  eq.forEach(([ic, tx, st], k) => {
    const t = .4 + k * .18, x = 80 + k * 335;
    const c = box(s, `left:${x}px;top:410px;width:250px;height:140px`, t, st ? {style: st} : {});
    const ink = st ? 'var(--acc-ink)' : 'var(--fg)';
    div('left:30px;top:40px;width:60px;height:60px;display:flex;align-items:center;justify-content:center', c, ico(ic, 52, ink, 2.2));
    title(c, tx, t + .1, 'left:108px;top:44px', {size: 40, W: 140, color: ink});
    if (k < 2) {
      const op = div(`left:${x + 250}px;top:440px;width:85px;height:80px;display:flex;align-items:center;justify-content:center;font-family:Display;font-weight:700;font-size:72px;line-height:1;color:var(--fg)`, s, k ? '=' : '+');
      popIn(op, t + .15);
    }
  });
  const L = list(s, ['รวมต้นทุนทั้งหมดต่อชิ้น', 'บวก Margin (อัตรากำไร) ที่ต้องการ', 'แล้วค่อยเทียบกับตลาด'], .9, 'left:80px;top:580px', {mark: 'num', size: 30, gap: 16, W: 920});
  const b = box(s, 'left:80px;top:770px;width:840px;height:110px', 1.4, {style: 'accent'});
  label(b, 'ตัวอย่าง', 'left:36px;top:40px', {color: 'color-mix(in srgb,var(--acc-ink) 60%,transparent)'});
  title(b, 'ต้นทุนรวม 175 อยากได้กำไร 30% → ขาย 250', 1.5, 'left:160px;top:32px', {size: 34, W: 660, color: 'var(--acc-ink)'});
});

/* 6 · Rehook · light · higher price + 3 reasons */
slide({tone: 'light'}, s => {
  tag(s, 'พลิกมุม', .05, 'left:80px;top:140px');
  title(s, 'แต่ราคาสูงกว่าคู่แข่ง\n__ไม่ได้แปลว่าขายไม่ได้__', .12, 'left:80px;top:205px', {size: 72, lh: 1.36});
  body(s, '**ลูกค้ายอมจ่ายเพิ่ม ถ้าเห็นเหตุผล**', .35, 'left:80px;top:420px', {W: 920, size: 32});
  const c = box(s, 'left:80px;top:490px;width:920px;height:250px', .45, {style: 'solid'});
  priceTag(c, 'ร้านเรา', 'ราคาสูงกว่า', .6, 'left:40px;top:45px', {w: 360, h: 160, size: 46, hole: 'var(--bg2)'});
  [['truck', 'ส่งไว'], ['shield-check', 'มีรับประกัน'], ['message-circle', 'ตอบแชตเร็ว']].forEach(([ic, tx], k) => {
    const t = 1.0 + k * .15, y = 15 + k * 80;
    icon(c, ic, t, `left:500px;top:${y}px`, {size: 60, style: 'accent', fl: false});
    title(c, tx, t + .05, `left:584px;top:${y + 9}px`, {size: 32, W: 280});
  });
  const b = box(s, 'left:80px;top:760px;width:920px;height:130px', 1.5, {style: 'accent'});
  title(b, 'ปัญหาไม่ใช่ราคาแพง\nแต่คือไม่บอกว่าทำไมแพง', 1.6, 'left:40px;top:20px', {size: 32, W: 740, lh: 1.36, color: 'var(--acc-ink)'});
});

/* 7 · Payoff · accent (white) · type only */
slide({tone: 'accent'}, s => {
  tag(s, 'สรุป', .05, 'left:80px;top:140px');
  title(s, 'ราคาต้องเริ่มจาก\nต้นทุน__ของเรา__\nไม่ใช่ป้ายราคา\nของคนอื่น', .12, 'left:80px;top:250px', {size: 108, lh: 1.36, step: .15});
});

/* 8 · CTA · dark (same as slide 1) */
slide({tone: 'dark'}, s => {
  tag(s, 'ลองทำดู', .05, 'left:80px;top:140px');
  title(s, 'สินค้าขายดีที่สุดของร้าน\nเหลือกำไร __กี่ %__', .12, 'left:80px;top:205px', {size: 76, lh: 1.36});
  const L = list(s, [['bookmark', 'x'], ['message-circle', 'x'], ['share-2', 'x']], .4, 'left:80px;top:460px', {mark: 'icon', size: 30, gap: 28, W: 920});
  const tx = ['<b>เซฟไว้</b> ใช้เช็กราคาสินค้าของคุณ',
              '<b>คอมเมนต์</b>บอกหน่อย สินค้าขายดีที่สุดของร้าน<br>เหลือกำไรกี่ %',
              '<b>แชร์</b>ให้เพื่อนที่กำลังลดราคาสู้คู่แข่ง'];
  L.querySelectorAll('.tx').forEach((e, k) => e.innerHTML = tx[k]);
  cta(s, 'เซฟโพสต์นี้', 1.0, 'left:80px;top:800px', {icon: 'bookmark'});
  path(s, [[0, 150], [150, 40], [310, 110]], .9, 'left:640px;top:740px', {w: 360, h: 200});
});
