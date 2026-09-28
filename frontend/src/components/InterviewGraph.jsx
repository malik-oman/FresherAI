import React, { useEffect, useId, useMemo } from "react";
import {
  MotionConfig,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const TECHNICAL_COLOR = "#7aa2ff";
const HR_COLOR = "#ffb27a";
const EASE = [0.22, 1, 0.36, 1];

/* ---------- Tooltip ---------- */

function CustomTooltip({ active, payload, color }) {
  if (!active || !payload?.length) return null;

  const { skill } = payload[0].payload;
  const value = payload[0].value;

  return (
    <div className="min-w-[140px] rounded-xl border border-white/10 bg-[#0b0c10]/95 px-3 py-2 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[11px] text-white/50">{skill}</span>
        <span className="text-xs font-semibold tabular-nums text-white">
          {value}%
        </span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* ---------- Count-up number ---------- */

function AnimatedNumber({ value, reduce }) {
  const mv = useMotionValue(reduce ? value : 0);
  const rounded = useTransform(mv, (v) => Math.round(v));

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, {
      duration: 1.2,
      delay: 0.5,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [value, reduce, mv]);

  return <motion.span>{rounded}</motion.span>;
}

/* ---------- Strongest / weakest tile ---------- */

function StatTile({ label, skill, score, color, dim = false }) {
  const reduce = useReducedMotion();
  const barColor = dim ? "rgba(255,255,255,0.35)" : color;

  return (
    <div className="min-w-0 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
      <p className="text-[11px] text-white/40">{label}</p>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <span className="truncate text-[13px] font-medium text-white/90">
          {skill}
        </span>
        <span
          className="text-[13px] font-semibold tabular-nums"
          style={{ color: dim ? "rgba(255,255,255,0.6)" : color }}
        >
          {score}%
        </span>
      </div>
      <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: barColor }}
          initial={{ width: reduce ? `${score}%` : 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: reduce ? 0 : 0.9, delay: 0.7, ease: EASE }}
        />
      </div>
    </div>
  );
}

/* ---------- Radar card ---------- */

function RadarCard({ title, data, count, color, index }) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const fillId = `radar-fill-${uid}`;

  // cursor-following spotlight
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${mx}px ${my}px, color-mix(in srgb, ${color} 14%, transparent), transparent 70%)`;

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  const stats = useMemo(() => {
    if (!data?.length) return null;
    const scores = data.map((d) => Number(d.score) || 0);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const sorted = [...data].sort((a, b) => b.score - a.score);
    return { avg, best: sorted[0], worst: sorted[sorted.length - 1] };
  }, [data]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.12, ease: EASE }}
      onMouseMove={handleMove}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#07080b] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-colors duration-300 hover:border-white/20 md:p-5"
    >
      {/* soft sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05), transparent 40%)",
        }}
      />
      {/* accent hairline on top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px opacity-70"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />
      {/* hover spotlight */}
      <motion.div
        aria-hidden
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* header */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{
                background: color,
                boxShadow: `0 0 0 3px color-mix(in srgb, ${color} 22%, transparent)`,
              }}
            />
            <h3 className="truncate text-sm font-semibold text-white">
              {title}
            </h3>
          </div>
          <p className="mt-1 text-xs text-white/40">
            {count} {count === 1 ? "interview" : "interviews"}
          </p>
        </div>

        {stats && (
          <div className="shrink-0 text-right">
            <div className="flex items-baseline justify-end gap-0.5">
              <span className="text-3xl font-semibold tabular-nums tracking-tight text-white">
                <AnimatedNumber value={stats.avg} reduce={reduce} />
              </span>
              <span className="text-sm text-white/40">%</span>
            </div>
            <p className="text-[11px] text-white/40">Average score</p>
          </div>
        )}
      </div>

      {/* chart */}
      <div
        className="relative mt-3 [&_.recharts-radar-polygon]:[filter:drop-shadow(0_0_10px_color-mix(in_srgb,var(--accent)_55%,transparent))]"
        style={{ "--accent": color }}
      >
        {/* faint dot texture, fades out toward the edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 25%, transparent 72%)",
            maskImage:
              "radial-gradient(circle at center, black 25%, transparent 72%)",
          }}
        />

        {stats ? (
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={data} cx="50%" cy="50%" outerRadius="66%">
              <defs>
                <linearGradient id={fillId} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.06} />
                </linearGradient>
              </defs>

              <PolarGrid
                gridType="polygon"
                stroke="rgba(255,255,255,0.09)"
              />
              <PolarAngleAxis
                dataKey="skill"
                tick={{
                  fill: "rgba(255,255,255,0.55)",
                  fontSize: 11,
                  fontWeight: 500,
                }}
              />
              {/* fixes the scale to 0-100 so shapes are comparable across cards */}
              <PolarRadiusAxis
                domain={[0, 100]}
                tick={false}
                axisLine={false}
                tickCount={5}
              />
              <Radar
                name={title}
                dataKey="score"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${fillId})`}
                fillOpacity={1}
                isAnimationActive={!reduce}
                animationBegin={300}
                animationDuration={900}
                dot={{ r: 3, fill: "#07080b", stroke: color, strokeWidth: 2 }}
                activeDot={{
                  r: 5,
                  fill: color,
                  stroke: "#ffffff",
                  strokeWidth: 1.5,
                }}
              />
              <Tooltip
                cursor={false}
                content={<CustomTooltip color={color} />}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[250px] flex-col items-center justify-center gap-1 text-center">
            <p className="text-sm font-medium text-white/70">
              No interviews yet
            </p>
            <p className="text-xs text-white/40">
              Scores will appear here after your first one.
            </p>
          </div>
        )}
      </div>

      {/* strongest / weakest */}
      {stats && data.length > 1 && (
        <div className="relative mt-3 grid grid-cols-2 gap-2">
          <StatTile
            label="Strongest"
            skill={stats.best.skill}
            score={stats.best.score}
            color={color}
          />
          <StatTile
            label="Needs work"
            skill={stats.worst.skill}
            score={stats.worst.score}
            color={color}
            dim
          />
        </div>
      )}
    </motion.article>
  );
}

/* ---------- Main ---------- */

const InterviewGraph = ({
  technicalData = [],
  hrData = [],
  technicalCount = 0,
  hrCount = 0,
}) => {
  return (
    <MotionConfig reducedMotion="user">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        <RadarCard
          title="Technical interviews"
          data={technicalData}
          count={technicalCount}
          color={TECHNICAL_COLOR}
          index={0}
        />
        <RadarCard
          title="HR interviews"
          data={hrData}
          count={hrCount}
          color={HR_COLOR}
          index={1}
        />
      </div>
    </MotionConfig>
  );
};

export default InterviewGraph;