import { useId } from "react";
import { ChartCard, DANGER, GRID, LegendKey, SURFACE, Tip, TipRow, dangerA, halo, ink, labelText, linear, niceTicks, tickText, usePointerX, useWidth } from "./core";
import { addMonths, fmtBaht, fmtCompact, thaiMonthYear } from "../../lib/format";
import type { RunwayMonth } from "../../lib/calc/runway";

type Props = {
  startCash: number;
  months: RunwayMonth[];
  runwayMonths: number | null;
  breakevenMonth: number | null;
  start: Date;
  /** Cash path before what-if changes (month 0..n), drawn as a quiet reference line. */
  baseline?: number[] | null;
};

const H = 250;
const M = { top: 30, right: 16, bottom: 30, left: 50 };

const shortMonth = (d: Date) => {
  const s = thaiMonthYear(d);
  return s.slice(0, -4) + s.slice(-2);
};

const RunwayChart = ({ startCash, months, runwayMonths, breakevenMonth, start, baseline }: Props) => {
  const [ref, W] = useWidth<HTMLDivElement>();
  const [px, hover] = usePointerX();
  const clipId = useId().replace(/:/g, "");

  const series = [{ month: 0, cash: startCash }, ...months.map((m) => ({ month: m.month, cash: m.cash }))];
  const n = months.length;
  const all = [...series.map((p) => p.cash), ...(baseline ?? [])];
  const lo = Math.min(0, ...all);
  const hi = Math.max(0, ...all);
  const yTicks = niceTicks(lo, hi, 4);
  const yMin = yTicks[0];
  const yMax = yTicks[yTicks.length - 1];

  const iw = Math.max(10, W - M.left - M.right);
  const ih = H - M.top - M.bottom;
  const x = linear(0, n, M.left, M.left + iw);
  const y = linear(yMin, yMax, M.top + ih, M.top);
  const zero = y(0);

  const line = series.map((p) => `${x(p.month)},${y(p.cash)}`).join(" ");
  const area = `${x(0)},${zero} ${line} ${x(n)},${zero}`;

  const xTicks = (iw < 460 ? [0, 12, 24, 36] : [0, 6, 12, 18, 24, 30, 36]).filter((t) => t <= n);
  const hm = px === null ? null : Math.round(Math.min(n, Math.max(0, linear(M.left, M.left + iw, 0, n)(px))));
  const hp = hm === null ? null : series[hm];
  const hmData = hm ? months[hm - 1] : null;

  const runX = runwayMonths !== null && runwayMonths <= n ? x(runwayMonths) : null;

  return (
    <ChartCard
      title="เงินสดคงเหลือ 3 ปีข้างหน้า"
      subtitle="คิดรายเดือนจากรายรับ รายจ่าย และการเติบโตที่กรอกไว้"
      legend={
        baseline ? (
          <>
            <LegendKey color={ink(1)} label="หลังปรับตัวเลข" />
            <LegendKey color={ink(3)} label="ตามตัวเลขเดิม" />
          </>
        ) : undefined
      }
    >
      <div ref={ref} className="relative w-full select-none" style={{ height: H }}>
        {W > 0 && (
          <svg width={W} height={H} role="img" aria-label="กราฟเงินสดคงเหลือรายเดือน">
            <defs>
              <clipPath id={`above-${clipId}`}>
                <rect x={0} y={0} width={W} height={Math.max(0, zero)} />
              </clipPath>
              <clipPath id={`below-${clipId}`}>
                <rect x={0} y={zero} width={W} height={Math.max(0, H - zero)} />
              </clipPath>
            </defs>
            {yTicks.map((t) => (
              <g key={t}>
                <line x1={M.left} x2={M.left + iw} y1={y(t)} y2={y(t)} stroke={t === 0 ? ink(2) : GRID} strokeWidth={1} />
                <text x={M.left - 8} y={y(t) + 4} textAnchor="end" {...tickText} className="lab-tnum">
                  {fmtCompact(t)}
                </text>
              </g>
            ))}
            {xTicks.map((t) => (
              <text key={t} x={x(t)} y={M.top + ih + 18} textAnchor={t === 0 ? "start" : t === n ? "end" : "middle"} {...tickText}>
                {t === 0 ? "ตอนนี้" : shortMonth(addMonths(start, t))}
              </text>
            ))}

            {baseline && (
              <polyline
                points={baseline.map((c, i) => `${x(i)},${y(c)}`).join(" ")}
                fill="none"
                stroke={ink(3)}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            )}
            <g clipPath={`url(#above-${clipId})`}>
              <polygon points={area} fill={ink(1, 0.1)} />
              <polyline points={line} fill="none" stroke={ink(1)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            </g>
            <g clipPath={`url(#below-${clipId})`}>
              <polygon points={area} fill={dangerA(0.14)} />
              <polyline points={line} fill="none" stroke={DANGER} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            </g>

            {breakevenMonth !== null && breakevenMonth <= n && (
              <g>
                <circle cx={x(breakevenMonth)} cy={y(series[breakevenMonth].cash)} r={6.5} fill={SURFACE} />
                <circle cx={x(breakevenMonth)} cy={y(series[breakevenMonth].cash)} r={4.5} fill={ink(1)} />
                <text
                  x={x(breakevenMonth)}
                  y={y(series[breakevenMonth].cash) - 12}
                  textAnchor="middle"
                  style={{ ...tickText, ...halo, fill: ink(1), fontWeight: 600 }}
                >
                  เริ่มมีเงินเหลือ
                </text>
              </g>
            )}

            {runX !== null && (
              <g>
                <circle cx={runX} cy={zero} r={7} fill={SURFACE} />
                <circle cx={runX} cy={zero} r={5} fill={DANGER} />
                <text x={runX > M.left + iw * 0.6 ? runX - 10 : runX + 10} y={zero - 12} textAnchor={runX > M.left + iw * 0.6 ? "end" : "start"} style={{ ...labelText, ...halo }}>
                  เงินหมด ~{thaiMonthYear(addMonths(start, runwayMonths!))}
                </text>
              </g>
            )}

            {hp && (
              <g pointerEvents="none">
                <line x1={x(hp.month)} x2={x(hp.month)} y1={M.top} y2={M.top + ih} stroke={ink(1, 0.5)} strokeWidth={1} />
                <circle cx={x(hp.month)} cy={y(hp.cash)} r={4.5} fill={hp.cash < 0 ? DANGER : ink(1)} stroke={SURFACE} strokeWidth={2} />
              </g>
            )}
            <rect x={M.left} y={M.top} width={iw} height={ih} fill="transparent" {...hover} style={{ touchAction: "pan-y" }} />
          </svg>
        )}
        {hp && (
          <Tip x={x(hp.month)} y={M.top - 4} width={W}>
            <p className="mb-1 font-semibold text-lab-fg">{hp.month === 0 ? "ตอนนี้" : `เดือนที่ ${hp.month} · ${thaiMonthYear(addMonths(start, hp.month))}`}</p>
            <TipRow label="เงินคงเหลือ" value={fmtBaht(hp.cash)} strong />
            {hmData && <TipRow label={hmData.net >= 0 ? "เดือนนี้เหลือ" : "เดือนนี้ใช้ไป"} value={fmtBaht(Math.abs(hmData.net))} />}
          </Tip>
        )}
      </div>
    </ChartCard>
  );
};

export default RunwayChart;
