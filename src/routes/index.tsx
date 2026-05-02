import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Shield } from "lucide-react";
import { Hero } from "@/components/Hero";
import { ScanForm } from "@/components/ScanForm";
import { ScanResults } from "@/components/ScanResults";
import type { ScanResult } from "@/lib/scanner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "VibeSec — Scan your AI app before hackers do" },
      {
        name: "description",
        content:
          "VibeSec is a friendly security scanner for AI-generated apps. Paste your code or a GitHub repo and get plain-English fixes in seconds.",
      },
      { property: "og:title", content: "VibeSec — Scan your AI app before hackers do" },
      {
        property: "og:description",
        content:
          "Plain-English security scanner built for non-technical founders shipping AI apps.",
      },
    ],
  }),
});

function Index() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-6xl px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold tracking-tight">VibeSec</span>
        </div>
        <a
          href="#scan"
          className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
        >
          Start scanning →
        </a>
      </header>

      <main>
        <Hero />
        <ScanForm onComplete={setResult} />
        <div ref={resultsRef}>
          {result && <ScanResults result={result} onReset={() => setResult(null)} />}
        </div>
      </main>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-center text-xs text-muted-foreground border-t border-border mt-10">
        VibeSec • Made for builders who'd rather ship than read security docs.
      </footer>
    </div>
  );
}
