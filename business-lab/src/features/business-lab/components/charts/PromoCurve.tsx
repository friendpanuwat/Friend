import { ChartCard, GRID, LegendKey, SURFACE, Tip, TipRow, halo, ink, labelText, linear, niceTicks, tickText, usePointerX, useWidth } from "./core";
import { fmtPct } from "../../lib/format";
import { requiredLiftFor } from "../../lib/calc/promo";

type Props = {
  price: number;
  unitCost: number;
  discount: number;       // ส่วนลดจริงที่เลือก 0..1
  expectedLift: number;   // ยอดที่คาดว่าจะเพิ่ม (0.5 = +50%)
  maxWorth: number | null; // ส่วนลดสูงสุดที่ยังคุ้ม 0..1
};

const H = 240;
const M = { top: 30, right: 16, bottom: 40, left: 46 };
const Y_CAP = 3; // แสดงสูงสุด +300%

const PromoCurve = ({ price, unitCost, discount, expectedLift, maxWorth }: Props) => {
  const [ref, W] = useWidth<HTMLDivElement>();
  const [px, hover] = usePointerX();

  const margin = (price - unitCost) / price;
  const dAtCap = 1 - (unitCost + (price - unitCost) / (1 + Y_CAP)) / price;
  const xHi = Math.min(margin * 0.999, Math.max(dAtCap, discount * 1.15, 0.05));
  const xTicks = niceTicks(0, xHi * 100, 4).filter((t) => t <= Math.ceil(xHi * 100 + 0.0001));
  const xMax = Math.max(xHi, xTicks[xTicks.length - 1] / 100);
  const cur = requiredLiftFor(price, unitCost, discount);
  const yTop = Math.min(Y_CAP, Math.max(1, (cur ?? 0) * 1.1, expectedLift * 1.2));
  const yTicks = niceTicks(0, yTop * 100, 3);
  const yMax = yTicks[yTicks.length - 1] / 100;

  const iw = Math.max(10, W - M.left - M.right);
  const ih = H - M.top - M.bottom;
  const x = linear(0, xMax, M.left, M.left + iw);
  const y = linear(0, yMax, M.top + ih, M.top);

  const samples: [number, number][] = [];
  const steps = 80;
  for (let k = 0; k <= steps; k++) {
    const d = (xMax * k) / steps;
    const l = requiredLiftFor(price, unitCost, d);
    if (l === null || l > yMax * 1.02) {
      if (l === null || samples.length) {
        // add the point where the curve leaves the top edge
        const dTop = 1 - (unitCost + (price - unitCost) / (1 + yMax)) / price;
        if (dTop > (samples.at(-1)?.[0] ?? 0)) samples.push([dTop, yMax]);
      }
      break;
    }
    samples.push([d, l]);
  }
  const line = samples.map(([d, l]) => `${x(d)},${y(l)}`).join(" ");
  const last = samples.at(-1) ?? [0, 0];
  const area = `${x(0)},${y(0)} ${line} ${x(last[0])},${y(0)}`;

  const hd = px === null ? null : Math.min(xMax, Math.max(0, linear(M.left, M.left + iw, 0, xMax)(px)));
  const hl = hd === null ? null : requiredLiftFor(price, unitCost, hd);
  const curY = cur === null ? null : y(Math.min(cur, yMax));
  // Empty space around a rising curve: below-right of the point, or above-left near the right edge.
  const curRoom = M.left + iw - x(discount) > 150;

  return (
    <ChartCard
      title="ยิ่งลดมาก ต้องขายเพิ่มมากขึ้นแบบก้าวกระโดด"
      subtitle="ยอดขายที่ต้องเพิ่มเพื่อให้ได้กำไรเท่าเดือนปกติ ที่ส่วนลดแต่ละระดับ"
      legend={
        expectedLift > 0 ? (
          <>
            <LegendKey color={ink(1)} label="ต้องขายเพิ่ม" />
            <LegendKey color={ink(2)} label={`คุณคาดว่าจะขายเพิ่ม ${fmtPct(expectedLift, 0)}`} dashed />
          </>
        ) : undefined
      }
    >
      <div ref={ref} className="relative w-full select-none" style={{ height: H }}>
        {W > 0 && (
          <svg width={W} height={H} role="img" aria-label="กราฟยอดขายที่ต้องเพิ่มตามส่วนลด">
            {yTicks.map((t) => (
              <g key={t}>
                <line x1={M.left} x2={M.left + iw} y1={y(t / 100)} y2={y(t / 100)} stroke={GRID} strokeWidth={1} />
                <text x={M.left - 8} y={y(t / 100) + 4} textAnchor="end" {...tickText} className="lab-tnum">
                  +{t}%
                </text>
              </g>
            ))}
            {xTicks.map((t) => (
              <text key={t} x={x(t / 100)} y={M.top + ih + 18} textAnchor="middle" {...tickText} className="lab-tnum">
                {t}%
              </text>
            ))}
            <text x={M.left + iw / 2} y={H - 4} textAnchor="middle" {...tickText}>
              ส่วนลดจากราคาปกติ
            </text>

            <polygon points={area} fill={ink(1, 0.08)} />
            <polyline points={line} fill="none" stroke={ink(1)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

            {expectedLift > 0 && expectedLift <= yMax && (
              <line x1={M.left} x2={M.left + iw} y1={y(expectedLift)} y2={y(expectedLift)} stroke={ink(2)} strokeWidth={1.5} strokeDasharray="4 4" />
            )}
            {maxWorth !== null && maxWorth > 0 && maxWorth < xMax && expectedLift <= yMax && (
              <g>
                <line x1={x(maxWorth)} x2={x(maxWorth)} y1={y(expectedLift)} y2={M.top + ih} stroke={ink(2)} strokeWidth={1} />
                <circle cx={x(maxWorth)} cy={y(expectedLift)} r={5} fill={SURFACE} stroke={ink(1)} strokeWidth={2} />
                <text x={x(maxWorth) - 10} y={y(expectedLift) - 10} textAnchor="end" style={{ ...tickText, ...halo, fill: ink(1), fontWeight: 600 }}>
                  คุ้มถ้าลดไม่เกิน {fmtPct(maxWorth)}
                </text>
              </g>
            )}

            {curY !== null && discount > 0 && discount <= xMax && (
              <g>
                <circle cx={x(discount)} cy={curY} r={7} fill={SURFACE} />
                <circle cx={x(discount)} cy={curY} r={5} fill={ink(1)} />
                <text x={curRoom ? x(discount) + 12 : x(discount) - 12} y={curRoom ? curY + 20 : curY - 12} textAnchor={curRoom ? "start" : "end"} style={{ ...labelText, ...halo }}>
                  ลด {fmtPct(discount)} → {cur! > Y_CAP ? `เกิน +${Y_CAP * 100}%` : `+${fmtPct(cur!, 0)}`}
                </text>
              </g>
            )}

            {hd !== null && hl !== null && hl <= yMax && (
              <g pointerEvents="none">
                <line x1={x(hd)} x2={x(hd)} y1={M.top} y2={M.top + ih} stroke={ink(1, 0.5)} strokeWidth={1} />
                <circle cx={x(hd)} cy={y(hl)} r={4.5} fill={ink(1)} stroke={SURFACE} strokeWidth={2} />
              </g>
            )}
            <rect x={M.left} y={M.top} width={iw} height={ih} fill="transparent" {...hover} style={{ touchAction: "pan-y" }} />
          </svg>
        )}
        {hd !== null && (
          <Tip x={x(hd)} y={M.top - 4} width={W}>
            <p className="mb-1 font-semibold text-lab-fg">ลด {fmtPct(hd)}</p>
            <TipRow label="ต้องขายเพิ่ม" value={hl === null ? "ขาดทุนทุกชิ้น" : `+${fmtPct(hl, 0)}`} strong />
          </Tip>
        )}
      </div>
    </ChartCard>
  );
};

export default PromoCurve;
