import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/resume/analyzer")({
  head: () => ({ meta: [{ title: "Resume Analyzer — PathWise AI" }] }),
  component: Analyzer,
});

const strengths = [
  "Clear, impact-driven bullet points",
  "Strong technical skill coverage",
  "Concise summary aligned to target role",
];
const weaknesses = [
  "Missing quantifiable metrics in 2 roles",
  "Skills section could highlight system design",
  "Consider adding one open-source contribution",
];

function Analyzer() {
  const [analyzed, setAnalyzed] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);
  const score = 86;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-semibold">Upload your resume</h3>
        <p className="mt-1 text-sm text-muted-foreground">PDF or DOCX. We'll analyze and give you a score.</p>

        <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-secondary/30 p-10 text-center transition hover:border-primary/50">
          <Upload className="h-8 w-8 text-primary" />
          <div className="mt-3 font-medium">Drop your file here or click to upload</div>
          <div className="text-xs text-muted-foreground">Max 5MB · PDF, DOCX</div>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setFilename(f.name);
            }}
          />
        </label>

        {filename && (
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-secondary/30 p-3 text-sm">
            <span className="truncate">{filename}</span>
            <Button size="sm" className="rounded-full gradient-brand text-white" onClick={() => setAnalyzed(true)}>
              <Sparkles className="mr-1 h-3 w-3" /> Analyze
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-semibold">Analysis</h3>

        {!analyzed ? (
          <div className="mt-10 text-center text-sm text-muted-foreground">
            Upload a resume to see your detailed AI analysis.
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-6">
            <div className="flex items-center gap-6">
              <div
                className="relative grid h-32 w-32 place-items-center rounded-full"
                style={{ background: `conic-gradient(var(--brand) ${score * 3.6}deg, color-mix(in oklab, var(--border) 100%, transparent) 0deg)` }}
              >
                <div className="grid h-24 w-24 place-items-center rounded-full bg-card">
                  <div className="text-center">
                    <div className="font-display text-3xl font-semibold">{score}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="font-display text-xl font-semibold">Looking sharp!</div>
                <p className="text-sm text-muted-foreground">
                  Your resume is strong. Apply the suggestions below to push past 90.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold">Strengths</h4>
              <ul className="mt-2 space-y-2 text-sm">
                {strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" /> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold">Suggestions</h4>
              <ul className="mt-2 space-y-2 text-sm">
                {weaknesses.map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
