/* ตัวช่วยของ test: โหลดโค้ดชุดเดียวกับหน้าเว็บ (ตัวคำนวณ PL2 + ข้อมูลร้านของตัวที่ 1 + ตัวที่ 2) */
const fs = require('fs'), vm = require('vm'), path = require('path');
const D = path.join(__dirname, '..');
function load() {
  const ctx = { console, Math, Date, JSON, Object, Array, String, Number, isFinite, parseFloat, Map };
  vm.createContext(ctx);
  for (const f of ['.out/calc.js', '../mvp-check-numbers/src/data.js', '../mvp-check-numbers/src/engine.js', 'src/open.js'])
    vm.runInContext(fs.readFileSync(path.join(D, f), 'utf8'), ctx, { filename: f });
  return ctx;
}
/* เรียกฟังก์ชันในโค้ดของหน้าเว็บด้วยข้อมูลจาก test (ส่งผ่าน JSON เพื่อไม่ปนวัตถุข้ามบริบท) */
function call(ctx, fn, ...args) {
  ctx.__args = JSON.parse(JSON.stringify(args));
  return vm.runInContext('JSON.parse(JSON.stringify(' + fn + '.apply(null, __args)))', ctx);
}
module.exports = { load, call };
