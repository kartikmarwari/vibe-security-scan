import { Shield, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Built for AI founders who don't know security
        </div>

        <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
          Scan your app{" "}
          <span className="text-gradient-primary">before hackers do</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          VibeSec checks your AI-generated code for security risks and explains them in plain
          English. No jargon, no setup — just paste and scan.
        </p>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <Stat icon={<Shield className="h-3.5 w-3.5 text-primary" />} label="10+ checks" />
          <span className="opacity-30">•</span>
          <Stat icon={<Sparkles className="h-3.5 w-3.5 text-primary" />} label="Plain English" />
          <span className="opacity-30">•</span>
          <Stat icon={<Shield className="h-3.5 w-3.5 text-primary" />} label="Free & private" />
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      {label}
    </span>
  );
}
