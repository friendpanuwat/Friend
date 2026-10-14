// Business Model Canvas — the nine blocks, in the order we suggest filling them.

export type BlockKey = "customers" | "value" | "channels" | "relationships" | "revenue" | "resources" | "activities" | "partners" | "costs";

export type Block = { key: BlockKey; title: string; en: string; question: string; ideas: string[] };

export const BLOCKS: Block[] = [
  { key: "customers", title: "กลุ่มลูกค้า", en: "Customer Segments", question: "ใครคือลูกค้าที่สำคัญที่สุด เขาเป็นใคร อยู่ที่ไหน", ideas: ["พนักงานออฟฟิศย่านสาทร", "นักศึกษาที่มานั่งทำงาน", "ร้านอาหารที่ซื้อเมล็ดไปใช้"] },
  { key: "value", title: "คุณค่าที่ส่งมอบ", en: "Value Propositions", question: "ลูกค้าได้อะไรจากเรา ที่ที่อื่นให้ไม่ได้หรือให้ได้ไม่ดีเท่า", ideas: ["กาแฟดีในราคาไม่เกิน 60 บาท", "ที่นั่งเงียบ มีปลั๊กทุกโต๊ะ", "สั่งล่วงหน้า มารับไม่ต้องรอ"] },
  { key: "channels", title: "ช่องทาง", en: "Channels", question: "ลูกค้ารู้จักเรา ซื้อ และรับสินค้าทางไหน", ideas: ["หน้าร้าน", "แอปเดลิเวอรี", "LINE OA", "TikTok / Instagram"] },
  { key: "relationships", title: "ความสัมพันธ์กับลูกค้า", en: "Customer Relationships", question: "ทำยังไงให้ลูกค้ากลับมาซื้ออีก", ideas: ["บัตรสะสมแต้ม", "จำชื่อและเมนูประจำ", "แจ้งเมนูใหม่ทาง LINE"] },
  { key: "revenue", title: "รายได้", en: "Revenue Streams", question: "ลูกค้าจ่ายเงินให้เราค่าอะไร แบบไหน", ideas: ["เครื่องดื่ม (รายได้หลัก)", "เบเกอรี่", "ขายเมล็ดคั่ว", "จัดเลี้ยงนอกสถานที่"] },
  { key: "resources", title: "ทรัพยากรหลัก", en: "Key Resources", question: "ต้องมีอะไรถึงทำธุรกิจนี้ได้", ideas: ["บาริสต้าฝีมือดี", "เครื่องชงกาแฟ", "ทำเลใกล้รถไฟฟ้า", "สูตรเมนู"] },
  { key: "activities", title: "กิจกรรมหลัก", en: "Key Activities", question: "ต้องทำอะไรเป็นประจำให้ธุรกิจเดินได้", ideas: ["ชงและเสิร์ฟ", "คุมคุณภาพเมล็ด", "ทำคอนเทนต์โซเชียล", "ฝึกพนักงาน"] },
  { key: "partners", title: "พันธมิตรหลัก", en: "Key Partners", question: "ใครที่เราต้องพึ่ง ถ้าไม่มีเขาธุรกิจสะดุด", ideas: ["โรงคั่วเมล็ด", "ร้านเบเกอรี่ส่ง", "แอปเดลิเวอรี", "เจ้าของที่"] },
  { key: "costs", title: "โครงสร้างต้นทุน", en: "Cost Structure", question: "เงินออกไปกับอะไรมากที่สุด", ideas: ["ค่าเช่า", "เงินเดือน", "วัตถุดิบ", "ค่าคอมมิชชันแอปเดลิเวอรี"] },
];

export type CanvasNotes = Record<BlockKey, string[]>;

export const emptyNotes = (): CanvasNotes =>
  BLOCKS.reduce((acc, b) => ({ ...acc, [b.key]: [] }), {} as CanvasNotes);

export const EXAMPLE_NAME = "ร้านกาแฟหน้าออฟฟิศ";
export const exampleNotes = (): CanvasNotes =>
  BLOCKS.reduce((acc, b) => ({ ...acc, [b.key]: b.ideas.slice(0, 3) }), {} as CanvasNotes);

export type CanvasCheck = { tone: "good" | "warn" | "tip"; title: string; body: string; block?: BlockKey };

/** Rule-based nudges: which blocks don't connect yet. */
export function checkCanvas(n: CanvasNotes): CanvasCheck[] {
  const has = (k: BlockKey) => (n[k]?.length ?? 0) > 0;
  const filled = BLOCKS.filter((b) => has(b.key)).length;
  const out: CanvasCheck[] = [];
  if (filled === 0) return out;
  if (has("value") && !has("customers")) out.push({ tone: "warn", block: "customers", title: "คุณค่านี้สำหรับใคร?", body: "เริ่มจากกลุ่มลูกค้าก่อน แล้วคุณค่าที่ส่งมอบจะชัดขึ้น" });
  if (has("customers") && !has("value")) out.push({ tone: "warn", block: "value", title: "ลูกค้าได้อะไรจากคุณ?", body: "ใส่เหตุผลที่ลูกค้ากลุ่มนี้จะเลือกคุณแทนเจ้าอื่น" });
  if (has("customers") && !has("channels")) out.push({ tone: "warn", block: "channels", title: "ลูกค้าจะเจอคุณทางไหน?", body: "มีลูกค้าแล้วแต่ยังไม่มีช่องทางที่เขาจะรู้จักและซื้อ" });
  if (filled >= 4 && !has("revenue")) out.push({ tone: "warn", block: "revenue", title: "ยังไม่ระบุว่าได้เงินจากอะไร", body: "ใส่ว่าลูกค้าจ่ายเงินค่าอะไร และอะไรเป็นรายได้หลัก" });
  if ((has("resources") || has("activities")) && !has("costs"))
    out.push({ tone: "warn", block: "costs", title: "ทรัพยากรและกิจกรรมมีต้นทุนเสมอ", body: "ลองไล่ดูว่าแต่ละอย่างในช่องทรัพยากรและกิจกรรม ทำให้เสียเงินกับอะไร" });
  if ((n.customers?.length ?? 0) >= 2 && (n.value?.length ?? 0) === 1)
    out.push({ tone: "tip", block: "value", title: "ลูกค้าแต่ละกลุ่มอาจต้องการคนละอย่าง", body: `คุณมีลูกค้า ${n.customers.length} กลุ่ม แต่มีคุณค่าที่ส่งมอบข้อเดียว เช็กว่าตอบทุกกลุ่มไหม` });
  if (has("revenue") && has("costs") && filled === BLOCKS.length)
    out.push({ tone: "good", title: "ครบทั้ง 9 ช่องแล้ว", body: "ลองอ่านจากลูกค้า → คุณค่า → ช่องทาง → รายได้ ว่าเรื่องเล่าต่อกันไหม แล้วเอาตัวเลขรายได้และต้นทุนไปเช็กกับเครื่องมือจุดคุ้มทุน" });
  return out;
}

export const canvasToText = (name: string, n: CanvasNotes) =>
  [
    `Business Model Canvas${name ? ` · ${name}` : ""}`,
    "",
    ...BLOCKS.flatMap((b, i) => [`${i + 1}. ${b.title} (${b.en})`, ...(n[b.key]?.length ? n[b.key].map((x) => `   • ${x}`) : ["   —"]), ""]),
    "ทำด้วย Jarua Business Lab",
  ].join("\n");
