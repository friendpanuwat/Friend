/* ============================================================
   ข้อมูลร้านชุดกลาง (Business Profile) — ใช้ร่วมกันทุกเครื่องมือใน Business Lab (HANDOFF ข้อ 5)
   กรอกที่เครื่องมือไหนก็ได้ เครื่องมืออื่นใช้ต่อ ไม่ต้องกรอกใหม่ · ช่องที่ต่างกันให้ผู้ใช้กรอกเพิ่มในเครื่องมือนั้นเอง
   เก็บใน sessionStorage ของแท็บ (ปิดแท็บแล้วหาย เหมือนเดิม) · เก็บเฉพาะตัวเลขร้านของผู้ใช้เอง ไม่เก็บร้านตัวอย่าง
   ถ้าเบราว์เซอร์ไม่ให้ใช้ที่เก็บ ทุกฟังก์ชันเงียบ ๆ และเครื่องมือทำงานแยกกันเหมือนเดิม
   ============================================================ */
var LabShop = (function () {
  'use strict';
  var KEY = 'lab-shop', WKEY = 'lab-where';
  function read(k) { try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function write(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  return {
    /* { model, inp, label, ok } หรือ null */
    get: function () {
      var d = read(KEY);
      return d && typeof d.model === 'string' && d.inp && typeof d.inp === 'object' ? d : null;
    },
    /* label = ชื่อรูปแบบร้านที่แสดง · ok = กรอกครบพอคำนวณแล้ว */
    put: function (model, inp, label, ok) {
      if (!model || !inp) return;
      write(KEY, { model: model, inp: inp, label: label || '', ok: !!ok });
    },
    /* ขายที่ไหน: shop / online / both */
    where: function () { var w = read(WKEY); return w === 'shop' || w === 'online' || w === 'both' ? w : null; },
    setWhere: function (w) { if (w) write(WKEY, w); },
    same: function (a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  };
})();
