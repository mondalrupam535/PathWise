import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, CheckCircle2, AlertTriangle, Sparkles, Loader2,
  FileText, X, BarChart3, Tag, Zap, RefreshCw, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { analyzeResume, type ResumeAnalysis } from "@/lib/ai";

export const Route = createFileRoute("/app/resume/analyzer")({
  head: () => ({ meta: [{ title: "Resume Analyzer — PathWise AI" }] }),
  component: Analyzer,
});

// ── Helpers ────────────────────────────────────────────────────────────────

async function extractText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        // Strip null bytes / non-printable chars that can come from binary files
        const cleaned = result.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, " ").trim();
        resolve(cleaned || "No readable text found.");
      } else {
        resolve("Unable to read file content.");
      }
    };
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsText(file, "utf-8");
  });
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const deg = (score / 100) * 360;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative grid h-20 w-20 place-items-center rounded-full"
        style={{
          background: `conic-gradient(${color} ${deg}deg, color-mix(in oklab, var(--border) 100%, transparent) 0deg)`,
        }}
      >
        <div className="grid h-14 w-14 place-items-center rounded-full bg-card">
          <div className="text-center">
            <div className="font-display text-xl font-bold">{score}</div>
          </div>
        </div>
      </div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
    </div>
  );
}

function SkeletonPulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-secondary/70 ${className}`} />;
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-6 mt-2">
      <div className="flex items-center gap-6">
        <SkeletonPulse className="h-20 w-20 rounded-full" />
        <SkeletonPulse className="h-20 w-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonPulse className="h-5 w-40" />
          <SkeletonPulse className="h-4 w-full" />
          <SkeletonPulse className="h-4 w-3/4" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonPulse className="h-4 w-24" />
        {[1, 2, 3].map((i) => <SkeletonPulse key={i} className="h-8 w-full" />)}
      </div>
      <div className="space-y-2">
        <SkeletonPulse className="h-4 w-28" />
        {[1, 2, 3, 4].map((i) => <SkeletonPulse key={i} className="h-8 w-full" />)}
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

function Analyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const profile = (() => {
    try { return JSON.parse(localStorage.getItem("pw-profile") || "{}"); } catch { return {}; }
  })();

  const handleFile = (f: File) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!allowed.includes(f.type) && !f.name.endsWith(".txt") && !f.name.endsWith(".pdf") && !f.name.endsWith(".docx")) {
      setError("Please upload a PDF, DOCX, or plain text file.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5 MB.");
      return;
    }
    setFile(f);
    setAnalysis(null);
    setError(null);
  };

  const runAnalysis = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const text = await extractText(file);
      if (!text || text.length < 20) {
        throw new Error("Could not extract readable text from this file. Try a plain-text (.txt) version.");
      }
      const result = await analyzeResume({
        data: { resumeText: text, targetRole: profile?.role },
      });
      setAnalysis(result);
    } catch (err: any) {
      setError(err?.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
    setLoading(false);
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "oklch(0.72 0.18 145)";   // green
    if (score >= 60) return "oklch(0.78 0.18 70)";    // amber
    return "oklch(0.65 0.22 25)";                      // red
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Upload Panel ── */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-semibold">Upload your resume</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          PDF, DOCX, or plain text. Our AI will score and review it instantly.
        </p>

        {/* Drop Zone */}
        <label
          htmlFor="resume-upload"
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center transition-all ${
            dragOver
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border bg-secondary/20 hover:border-primary/50 hover:bg-secondary/40"
          }`}
        >
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition ${dragOver ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
            <Upload className="h-6 w-6" />
          </div>
          <div className="mt-3 font-medium">
            {dragOver ? "Drop it here!" : "Drop your file here or click to upload"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Max 5 MB · PDF, DOCX, TXT</div>
          <input
            id="resume-upload"
            type="file"
            className="hidden"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </label>

        {/* Selected File */}
        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-secondary/30 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium truncate max-w-[160px]">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="rounded-full gradient-brand text-white"
                  onClick={runAnalysis}
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="mr-1 h-3 w-3 animate-spin" />Analyzing…</>
                  ) : (
                    <><Sparkles className="mr-1 h-3 w-3" />Analyze</>
                  )}
                </Button>
                <button
                  onClick={reset}
                  className="rounded-full p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-start gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips */}
        {!file && (
          <div className="mt-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tips for best results</p>
            {[
              "Use a clean single-column format",
              "Include quantifiable achievements",
              "Tailor keywords to your target role",
            ].map((tip) => (
              <div key={tip} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
                {tip}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Analysis Panel ── */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">AI Analysis</h3>
          {analysis && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <RefreshCw className="h-3 w-3" /> Start over
            </button>
          )}
        </div>

        {/* Empty state */}
        {!loading && !analysis && (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <BarChart3 className="h-8 w-8" />
            </div>
            <p className="text-sm text-muted-foreground">
              Upload your resume and click <strong>Analyze</strong> to get your AI-powered score and detailed feedback.
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div>
            <div className="mt-4 flex items-center gap-2 text-sm text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI is reading your resume…</span>
            </div>
            <AnalysisSkeleton />
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {analysis && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-5 space-y-5"
            >
              {/* Score gauges */}
              <div className="flex items-center gap-6">
                <ScoreRing score={analysis.score} label="Overall" color={scoreColor(analysis.score)} />
                <ScoreRing score={analysis.atsScore} label="ATS Score" color={scoreColor(analysis.atsScore)} />
                <div className="flex-1">
                  <div className="font-display text-lg font-semibold leading-snug">{analysis.headline}</div>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Strengths */}
              {analysis.strengths.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Strengths
                  </h4>
                  <ul className="mt-2 space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm"
                      >
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        {s}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold">
                    <Target className="h-4 w-4 text-amber-500" />
                    Suggestions to improve
                  </h4>
                  <ul className="mt-2 space-y-2">
                    {analysis.suggestions.map((s, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.07 }}
                        className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-sm"
                      >
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        {s}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Keywords */}
              {analysis.keywords.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold">
                    <Tag className="h-4 w-4 text-primary" />
                    Key terms & keywords
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {analysis.keywords.map((kw, i) => (
                      <motion.span
                        key={kw}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.04 }}
                        className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {kw}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
