import { Button } from "@/components/ui/button";
import { Download, RotateCcw, ShieldCheck } from "lucide-react";
import { ScoreCircle } from "./ScoreCircle";
import { IssueCard } from "./IssueCard";
import type { ScanResult } from "@/lib/scanner";

interface ScanResultsProps {
  result: ScanResult;
  onReset: () => void;
}

export function ScanResults({ result, onReset }: ScanResultsProps) {
  const downloadReport = () => {
    const lines = [
      `VibeSec Security Report`,
      `Generated: ${new Date(result.scannedAt).toLocaleString()}`,
      ``,
      `Security Score: ${result.score}/100`,
      `Total issues found: ${result.totalIssues}`,
      ``,
      `--- Top Issues ---`,
      ...result.topIssues.flatMap((i, idx) => [
        ``,
        `${idx + 1}. [${i.severity.toUpperCase()}] ${i.problem}`,
        `   Why: ${i.why}`,
        `   Fix: ${i.fix}`,
        i.line ? `   Line: ${i.line}` : ``,
      ]),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vibesec-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="rounded-3xl border border-border bg-gradient-card p-8 md:p-12 shadow-elegant">
        <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
          <ScoreCircle score={result.score} />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Your scan is complete</h2>
            <p className="mt-2 text-muted-foreground">
              We found <span className="text-foreground font-semibold">{result.totalIssues}</span>{" "}
              {result.totalIssues === 1 ? "issue" : "issues"} in your code. Here are the most
              important ones to fix first.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={onReset} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Scan another project
              </Button>
              <Button onClick={downloadReport} className="gap-2 bg-gradient-primary text-primary-foreground hover:opacity-90">
                <Download className="h-4 w-4" />
                Download report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-semibold tracking-tight mb-6">
          Top {result.topIssues.length} {result.topIssues.length === 1 ? "issue" : "issues"} to fix
        </h3>

        {result.topIssues.length === 0 ? (
          <div className="rounded-2xl border border-success/30 bg-success/5 p-10 text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-success" />
            <p className="mt-4 text-lg font-medium">No major issues found 🎉</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your code looks clean from common vibe-coded mistakes. Keep it up!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {result.topIssues.map((issue, idx) => (
              <IssueCard key={issue.id} issue={issue} index={idx} />
            ))}
          </div>
        )}

        {result.issues.length > result.topIssues.length && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            + {result.issues.length - result.topIssues.length} more issue
            {result.issues.length - result.topIssues.length === 1 ? "" : "s"} in the full report.
          </p>
        )}
      </div>
    </section>
  );
}
