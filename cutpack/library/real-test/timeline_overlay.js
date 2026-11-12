/* CutPack editorial-overlay — 18 s test on Friend's clip (script.md). The speaker stays on screen; widgets pop up in free space. */
/* camera, talking-head-motion way: three slow push-ins on the strong lines, ≥ 4 s apart, gentle pull back on a new topic */
push(0.3); pull(4.8);
push(8.0); pull(12.0);
push(14.6);
subtitle('ทำไมคลิป ของคุณ / ยอดวิว ไม่ขึ้น', 0.0, 2.4);
subtitle('ทั้งที่ โพสต์ทุกวัน / ยอดวิวกลับ ลดลง / ครึ่งหนึ่ง', 2.4, 4.8);
subtitle('ปัญหา ไม่ใช่ / โพสต์ น้อย', 4.8, 6.2);
subtitle('แต่คือ / 3 วินาทีแรก', 6.2, 8.0);
subtitle('คนดู ตัดสินใจ / เลื่อน ผ่าน', 8.0, 9.6);
subtitle('ภายใน / 3 วินาที', 9.6, 11.0);
subtitle('ลองทำ 3 อย่างนี้', 11.0, 12.0);
subtitle('เปิดด้วย คำถาม / ใส่ ซับ / ตัดช่วง เงียบ', 12.0, 14.5);
subtitle('ทำครบ แล้ว / ยอดวิวจะ โตขึ้นเอง', 14.5, 16.2);
subtitle('กด ติดตามไว้ / ตอนหน้า มีต่อ', 16.2, 18.1);
widgetAt('B06', 'v1', 'short', 0.5, 2.3, {hit: 1.3, q: 'ยอดวิวไม่ขึ้น', icon: 'eye', wlead: 'ยอดวิว', wkey: 'ไม่ขึ้น'});
widgetAt('B02', 'v1', 'short', 2.9, 4.8, {hit: 3.6, dir: 'down', icon: 'eye', wlead: 'ยอดวิว', wkey: 'ลดลง'});
widgetAt('B05', 'v2', 'short', 6.2, 8.0, {hit: 6.6, aty: 7.0, x: 'โพสต์น้อย', y: '3 วินาทีแรก', wlead: 'ไม่ใช่โพสต์น้อย', wkey: '3 วินาทีแรก'});
widgetAt('B01', 'v1', 'short', 9.6, 11.0, {hit: 10.4, num: 3, unit: 'วินาที', icon: 'timer', wlead: 'ภายใน', wkey: '3 วินาที'});
widgetAt('B04', 'v2', 'narrow', 12.0, 14.6, {hit: 14.0, items: ['เปิดด้วยคำถาม', 'ใส่ซับ', 'ตัดช่วงเงียบ'], at: [12.4, 13.2, 14.0], wlead: 'ลองทำ', wkey: '3 อย่าง'});
widgetAt('B15', 'v3', 'short', 16.3, 18.1, {hit: 16.8, action: 'follow', text: 'ตอนหน้ามีต่อ', wlead: 'ตอนหน้ามีต่อ', wkey: 'กดติดตาม'});
