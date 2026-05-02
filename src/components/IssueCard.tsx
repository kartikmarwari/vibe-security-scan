import { AlertTriangle, Brain, Wrench } from "lucide-react";
import type { Issue, Severity } from "@/lib/scanner";

const severityStyles: Record<Severity, { label: string; chip: string; bar: string }> = {
  critical: {
    label: "Critical",
    chip: "bg-destructive/15 text-destructive border-destructive/30",
    bar: "bg-gradient-danger",
  },
  medium: {
    label: "Medium",
    chip: "bg-warning/15 text-warning border-warning/30",
    bar: "bg-gradient-warning",
  },
  low: {
    label: "Low",
    chip: "bg-success/15 text-success border-success/30",
    bar: "bg-gradient-success",
  },
};

export function IssueCard({ issue, index }: { issue: Issue; index: number }) {
  const s = severityStyles[issue.severity];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-card shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-0.5">
      <div className={`absolute left-0 top-0 h-full w-1 ${s.bar}`} />
      <div className="p-6 pl-7">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground">#{index + 1}</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${s.chip}`}>
              {s.label}
            </span>
          </div>
          {issue.line && (
            <span className="text-xs font-mono text-muted-foreground">line {issue.line}</span>
          )}
        </div>

        <div className="space-y-4">
          <Row icon={<AlertTriangle className="h-4 w-4 text-destructive" />} label="Problem">
            {issue.problem}
          </Row>
          <Row icon={<Brain className="h-4 w-4 text-warning" />} label="Why it matters">
            {issue.why}
          </Row>
          <Row icon={<Wrench className="h-4 w-4 text-primary" />} label="Fix">
            {issue.fix}
          </Row>

          {issue.snippet && (
            <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-background/60 p-3 text-xs font-mono text-muted-foreground">
              {issue.snippet}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-1">
        {icon}
        {label}
      </div>
      <p className="text-sm leading-relaxed text-foreground">{children}</p>
    </div>
  );
}
