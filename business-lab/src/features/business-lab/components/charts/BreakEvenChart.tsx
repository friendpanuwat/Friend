import { ChartCard, DANGER, GRID, LegendKey, SURFACE, Tip, TipRow, dangerA, halo, ink, labelText, linear, niceTicks, tickText, usePointerX, useWidth } from "./core";
import { fmtBaht, fmtCompact, fmtNum } from "../../lib/format";

type Props = {
  price: number;
  unitCost: number;
  fixed: number;
  days: number;
  beDay: number;
  currentDaily?: number;
  noun: string;
};

const H = 250;
const M = { top: 30, right: 14, bottom: 42, left: 46 };

const BreakEvenChart = ({ price, unitCost, fixed, days, beDay, currentDaily, noun }: Props) => {
  const [ref, W] = useWidth<HTMLDivElement>();
  const [px, hover] = usePointerX();

  const xTicks = niceTicks(0, Math.max(beDay * 2, (currentDaily ?? 0) * 1.25, 4), 4);
  const xMax = xTicks[xTicks.length - 1];
  const rev = (u: number) => u * days * price;
  const cost = (u: number) => fixed + u * days * unitCost;
  const yTicks = niceTicks(0, Math.max(rev(xMax), cost(xMax)), 4);
  const yMax = yTicks[yTicks.length - 1];

  const iw = Math.max(10, W - M.left - M.right);
  const ih = H - M.top - M.bottom;
  const x = linear(0, xMax, M.left, M.left + iw);
  const y = linear(0, yMax, M.top + ih, M.top);

  const pts = (f: (u: number) => number, from: number, to: number) => `${x(from)},${y(f(from))} ${x(to)},${y(f(to))}`;
  const loss = `${pts(cost, 0, beDay)} ${x(beDay)},${y(rev(beDay))} ${x(0)},${y(rev(0))}`;
  const profit = `${x(beDay)},${y(rev(beDay))} ${x(xMax)},${y(rev(xMax))} ${x(xMax)},${y(cost(xMax))}`;

  const beX = x(beDay);
  const beY = y(rev(beDay));
  // Put the label where both lines are absent: above-left of the point, or below-right if there's no room.
  const labelLeft = beX - M.left > 170;
  const hu = px === null ? null : Math.min(xMax, Math.max(0, linear(M.left, M.left + iw, 0, xMax)(px)));

  return (
    <ChartCard
      title="รายได้กับต้นทุนรวมต่อเดือน"
      subtitle={`เส้นสองเส้นตัดกันตรงจุดคุ้มทุน ขายต่ำกว่านั้นขาดทุน ขายเกินนั้นเริ่มมีกำไร`}
      legend={
        <>
          <LegendKey color={ink(1)} label="รายได้" />
          <LegendKey color={ink(2)} label="ต้นทุนรวม (คงที่ + ผันแปร)" />
        </>
      }
    >
      <div ref={ref} className="relative w-full select-none" style={{ height: H }}>
        {W > 0 && (
          <svg width={W} height={H} role="img" aria-label={`กราฟจุดคุ้มทุนที่ ${fmtNum(beDay, 1)} ${noun} ต่อวัน`}>
            {yTicks.map((t) => (
              <g key={t}>
                <line x1={M.left} x2={M.left + iw} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth={1} />
                <text x={M.left - 8} y={y(t) + 4} textAnchor="end" {...tickText} className="lab-tnum">
                  {fmtCompact(t)}
                </text>
              </g>
            ))}
            {xTicks.map((t) => (
              <text key={t} x={x(t)} y={M.top + ih + 18} textAnchor="middle" {...tickText} className="lab-tnum">
                {fmtNum(t, t % 1 ? 1 : 0)}
              </text>
            ))}
            <text x={M.left + iw / 2} y={H - 4} textAnchor="middle" {...tickText}>
              ยอดขายต่อวัน ({noun})
            </text>

            <polygon points={loss} fill={dangerA(0.13)} />
            <polygon points={profit} fill={ink(1, 0.09)} />
            {x(beDay) - M.left > 70 && (
              <text x={M.left + 6} y={(y(cost(0)) + y(rev(0))) / 2 + 4} textAnchor="start" style={{ ...tickText, ...halo, fill: DANGER, fontWeight: 600 }}>
                ขาดทุน
              </text>
            )}
            {M.left + iw - x(beDay) > 70 && (
              <text x={M.left + iw - 6} y={(y(cost(xMax)) + y(rev(xMax))) / 2 + 4} textAnchor="end" style={{ ...tickText, ...halo, fill: ink(1), fontWeight: 600 }}>
                กำไร
              </text>
            )}

            <polyline points={pts(cost, 0, xMax)} fill="none" stroke={ink(2)} strokeWidth={2} strokeLinecap="round" />
            <polyline points={pts(rev, 0, xMax)} fill="none" stroke={ink(1)} strokeWidth={2} strokeLinecap="round" />

            {currentDaily !== undefined && currentDaily > 0 && currentDaily <= xMax && (
              <g>
                <line x1={x(currentDaily)} x2={x(currentDaily)} y1={M.top} y2={M.top + ih} stroke={ink(2)} strokeWidth={1} />
                <text x={x(currentDaily)} y={M.top - 10} textAnchor={x(currentDaily) > M.left + iw * 0.8 ? "end" : "middle"} {...tickText}>
                  ตอนนี้ {fmtNum(currentDaily, currentDaily % 1 ? 1 : 0)}
                </text>
              </g>
            )}

            <circle cx={beX} cy={beY} r={7} fill={SURFACE} />
            <circle cx={beX} cy={beY} r={5} fill={ink(1)} />
            <text x={labelLeft ? beX - 12 : beX + 12} y={labelLeft ? beY - 12 : beY + 22} textAnchor={labelLeft ? "end" : "start"} style={{ ...labelText, ...halo }}>
              คุ้มทุน {fmtNum(beDay, 1)} {noun}/วัน
            </text>

            {hu !== null && (
              <g pointerEvents="none">
                <line x1={x(hu)} x2={x(hu)} y1={M.top} y2={M.top + ih} stroke={ink(1, 0.5)} strokeWidth={1} />
                <circle cx={x(hu)} cy={y(rev(hu))} r={4} fill={ink(1)} stroke={SURFACE} strokeWidth={2} />
                <circle cx={x(hu)} cy={y(cost(hu))} r={4} fill={ink(2)} stroke={SURFACE} strokeWidth={2} />
              </g>
            )}
            <rect x={M.left} y={M.top} width={iw} height={ih} fill="transparent" {...hover} style={{ touchAction: "pan-y" }} />
          </svg>
        )}
        {hu !== null && (
          <Tip x={x(hu)} y={M.top - 4} width={W}>
            <p className="mb-1 font-semibold text-lab-fg">ขายวันละ {fmtNum(hu, 1)} {noun}</p>
            <TipRow label="รายได้/เดือน" value={fmtBaht(rev(hu))} />
            <TipRow label="ต้นทุนรวม" value={fmtBaht(cost(hu))} />
            <TipRow label={rev(hu) - cost(hu) >= 0 ? "กำไร" : "ขาดทุน"} value={fmtBaht(rev(hu) - cost(hu))} strong />
          </Tip>
        )}
      </div>
    </ChartCard>
  );
};

export default BreakEvenChart;
