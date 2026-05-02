import { scoreColor, scoreLabel } from "@/lib/scanner";

interface ScoreCircleProps {
  score: number;
}

export function ScoreCircle({ score }: ScoreCircleProps) {
  const color = scoreColor(score);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colorVar =
    color === "success" ? "var(--success)" : color === "warning" ? "var(--warning)" : "var(--destructive)";

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-56 w-56">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--muted)"
            strokeWidth="6"
            opacity="0.4"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={colorVar}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              filter: `drop-shadow(0 0 12px ${colorVar})`,
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-6xl font-bold tabular-nums"
            style={{ color: colorVar }}
          >
            {score}
          </div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
            Security Score
          </div>
        </div>
      </div>
      <div className="mt-4 text-lg font-medium" style={{ color: colorVar }}>
        {scoreLabel(score)}
      </div>
    </div>
  );
}
