export type Severity = "critical" | "medium" | "low";

export interface Issue {
  id: string;
  severity: Severity;
  problem: string;
  why: string;
  fix: string;
  snippet?: string;
  line?: number;
}

interface Rule {
  id: string;
  severity: Severity;
  pattern: RegExp;
  problem: string;
  why: string;
  fix: string;
}

const RULES: Rule[] = [
  {
    id: "api-key",
    severity: "critical",
    pattern: /(API[_-]?KEY|apiKey)\s*[:=]\s*["'`][^"'`]{8,}["'`]/i,
    problem: "Your API key is exposed in your code",
    why: "Anyone who sees your code can use your API, steal your data, or run up your bill.",
    fix: "Move your API key into an environment variable (like a .env file) and never commit it.",
  },
  {
    id: "secret",
    severity: "critical",
    pattern: /(SECRET|secret)\s*[:=]\s*["'`][^"'`]{6,}["'`]/,
    problem: "A secret value is hardcoded in your app",
    why: "Secrets in code can be read by anyone with access — including hackers scanning public repos.",
    fix: "Store secrets in environment variables and load them at runtime, never in your source code.",
  },
  {
    id: "token",
    severity: "critical",
    pattern: /(TOKEN|access_token|bearer)\s*[:=]\s*["'`][A-Za-z0-9._\-]{10,}["'`]/i,
    problem: "An access token is sitting in your code",
    why: "Tokens grant access to your accounts. If leaked, attackers can act as you.",
    fix: "Keep tokens server-side and load them from environment variables — never put them in client code.",
  },
  {
    id: "password",
    severity: "critical",
    pattern: /password\s*=\s*["'`][^"'`]{1,}["'`]/i,
    problem: "A password is written directly in your code",
    why: "Hardcoded passwords are one of the easiest ways for attackers to break into your app.",
    fix: "Never store passwords in code. Use a secure auth provider or hashed storage in a database.",
  },
  {
    id: "insecure-url",
    severity: "medium",
    pattern: /http:\/\/(?!localhost|127\.0\.0\.1)/,
    problem: "You're using an insecure http:// link",
    why: "Data sent over http is unencrypted — anyone on the network can read it.",
    fix: "Use https:// instead. Most modern services support it by default.",
  },
  {
    id: "eval",
    severity: "critical",
    pattern: /\beval\s*\(/,
    problem: "Your code uses eval(), which is dangerous",
    why: "eval() runs any code it's given — attackers can use it to take over your app.",
    fix: "Replace eval() with safer alternatives like JSON.parse() or proper function calls.",
  },
  {
    id: "inner-html",
    severity: "medium",
    pattern: /\.innerHTML\s*=/,
    problem: "You're injecting raw HTML into the page",
    why: "If user input ends up here, attackers can inject scripts and steal user data (XSS).",
    fix: "Use textContent for plain text, or sanitize HTML with a trusted library before inserting.",
  },
  {
    id: "no-auth",
    severity: "medium",
    pattern: /(app|router)\.(get|post|put|delete)\s*\(\s*["'`]\/(api|admin)/i,
    problem: "Your API routes might be missing authentication",
    why: "Without auth checks, anyone on the internet can call your private endpoints.",
    fix: "Add an auth check (middleware or guard) to every route that touches user data.",
  },
  {
    id: "cors-wildcard",
    severity: "medium",
    pattern: /Access-Control-Allow-Origin["'`]?\s*[:,]\s*["'`]\*/,
    problem: "Your app accepts requests from any website",
    why: "A wildcard CORS lets malicious sites call your API on behalf of your users.",
    fix: "List only the domains you trust in your CORS configuration.",
  },
  {
    id: "sql-concat",
    severity: "critical",
    pattern: /(SELECT|INSERT|UPDATE|DELETE)[^;]*\+\s*\w+/i,
    problem: "Your database query is built by joining strings",
    why: "This is how SQL injection happens — attackers can read or destroy your whole database.",
    fix: "Use parameterized queries (prepared statements) so user input is treated as data, not code.",
  },
];

const SEVERITY_PENALTY: Record<Severity, number> = {
  critical: 25,
  medium: 15,
  low: 5,
};

export interface ScanResult {
  score: number;
  totalIssues: number;
  issues: Issue[];
  topIssues: Issue[];
  scannedAt: string;
}

export function scanCode(code: string): ScanResult {
  const issues: Issue[] = [];
  const lines = code.split("\n");

  for (const rule of RULES) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (rule.pattern.test(line)) {
        issues.push({
          id: `${rule.id}-${i}`,
          severity: rule.severity,
          problem: rule.problem,
          why: rule.why,
          fix: rule.fix,
          snippet: line.trim().slice(0, 140),
          line: i + 1,
        });
        break; // one match per rule keeps the report focused
      }
    }
  }

  let score = 100;
  for (const issue of issues) score -= SEVERITY_PENALTY[issue.severity];
  score = Math.max(0, Math.min(100, score));

  const order: Record<Severity, number> = { critical: 0, medium: 1, low: 2 };
  const sorted = [...issues].sort((a, b) => order[a.severity] - order[b.severity]);

  return {
    score,
    totalIssues: issues.length,
    issues: sorted,
    topIssues: sorted.slice(0, 3),
    scannedAt: new Date().toISOString(),
  };
}

export function scoreColor(score: number): "success" | "warning" | "destructive" {
  if (score >= 80) return "success";
  if (score >= 50) return "warning";
  return "destructive";
}

export function scoreLabel(score: number): string {
  if (score >= 80) return "Looking good";
  if (score >= 50) return "Some risks found";
  return "Needs attention";
}

/**
 * Simulated GitHub fetch. We don't hit the network here — we generate a
 * realistic-looking sample based on the repo URL so the scanner has something
 * meaningful to chew on for the demo.
 */
export async function fetchRepoSample(url: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 600));
  const seed = url.toLowerCase();
  const hasKey = seed.length % 2 === 0;
  const hasHttp = seed.includes("old") || seed.length % 3 === 0;
  return [
    `// Simulated scan of ${url}`,
    `import express from "express";`,
    `const app = express();`,
    hasKey ? `const API_KEY = "sk_live_8af72bd9c0e14a2b9d3f1e4c8a7b6d5e";` : `const API_KEY = process.env.API_KEY;`,
    `const password = "admin123";`,
    hasHttp ? `fetch("http://api.example.com/users");` : `fetch("https://api.example.com/users");`,
    `app.get("/api/users", (req, res) => { res.json(getAllUsers()); });`,
    `db.query("SELECT * FROM users WHERE id = " + req.query.id);`,
    `res.setHeader("Access-Control-Allow-Origin", "*");`,
    `app.listen(3000);`,
  ].join("\n");
}
