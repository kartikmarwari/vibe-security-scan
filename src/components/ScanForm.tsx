import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ShieldCheck, Github } from "lucide-react";
import { fetchRepoSample, scanCode, type ScanResult } from "@/lib/scanner";

interface ScanFormProps {
  onComplete: (result: ScanResult) => void;
}

const SAMPLE = `// Try pasting your own code, or scan this sample:
const API_KEY = "sk_live_abcd1234efgh5678ijkl9012mnop3456";
const password = "admin123";

fetch("http://api.example.com/users");
db.query("SELECT * FROM users WHERE id = " + req.query.id);
res.setHeader("Access-Control-Allow-Origin", "*");`;

export function ScanForm({ onComplete }: ScanFormProps) {
  const [code, setCode] = useState("");
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setError(null);
    if (!code.trim() && !repo.trim()) {
      setError("Paste some code or enter a GitHub repository URL to scan.");
      return;
    }

    setLoading(true);
    try {
      let source = code;
      if (!source.trim() && repo.trim()) {
        source = await fetchRepoSample(repo.trim());
      }
      // brief artificial delay so the scan feels real
      await new Promise((r) => setTimeout(r, 700));
      const result = scanCode(source);
      onComplete(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong while scanning.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="scan" className="mx-auto max-w-4xl px-6 pb-24">
      <div className="rounded-3xl border border-border bg-gradient-card p-6 md:p-8 shadow-elegant">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">1</span>
              Paste your code
            </label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={SAMPLE}
              className="min-h-[240px] font-mono text-sm bg-background/60 border-border resize-y"
              disabled={loading}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">2</span>
              Public GitHub repo URL
            </label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="https://github.com/your-name/your-repo"
                className="pl-10 bg-background/60"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            onClick={handleScan}
            disabled={loading}
            size="lg"
            className="w-full gap-2 bg-gradient-primary text-primary-foreground text-base font-semibold shadow-glow hover:opacity-95 hover:shadow-glow transition-smooth"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Scanning your app...
              </>
            ) : (
              <>
                <ShieldCheck className="h-5 w-5" />
                Scan My App
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            🔒 Your code never leaves your browser. Everything runs locally.
          </p>
        </div>
      </div>
    </section>
  );
}
