import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Bookmark, MapPin, Briefcase, DollarSign, Loader2,
  Search, ExternalLink, FileText, ArrowRight, X,
  GraduationCap, Building2, RefreshCw, Sparkles,
} from "lucide-react";
import { PageTransition, SectionHeading } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDynamicJobs, type JobMatch } from "@/lib/ai";

export const Route = createFileRoute("/app/jobs")({
  head: () => ({ meta: [{ title: "Job Match — PathWise AI" }] }),
  component: JobMatch,
});

// ── Helpers ────────────────────────────────────────────────────────────────

function getResumeData() {
  try {
    const data = localStorage.getItem("pw-resume-data");
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function getProfile() {
  try {
    const data = localStorage.getItem("pw-profile");
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function buildSkillsFromResume(resume: any, profile: any): string[] {
  const skillsArr: string[] = [];
  // From resume builder skills field
  if (resume?.skills) {
    resume.skills.split(",").map((s: string) => s.trim()).filter(Boolean).forEach((s: string) => skillsArr.push(s));
  }
  // From onboarding profile
  if (profile?.skillSet?.length) {
    profile.skillSet.forEach((s: string) => { if (!skillsArr.includes(s)) skillsArr.push(s); });
  }
  return skillsArr;
}

// ── No Resume Gate ────────────────────────────────────────────────────────

function NoResumeGate() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <FileText className="h-10 w-10" />
      </div>
      <h2 className="mt-5 font-display text-2xl font-bold">No resume found</h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        To get AI-matched job listings tailored to your skills, you need to build or upload your resume first.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="rounded-full gradient-brand text-white px-6">
          <Link to="/app/resume/builder">
            <FileText className="mr-2 h-4 w-4" /> Build my resume
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full px-6">
          <Link to="/app/resume/analyzer">
            Upload &amp; analyze
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

// ── Job Card ─────────────────────────────────────────────────────────────

function JobCard({ job, index }: { job: JobMatch; index: number }) {
  const [saved, setSaved] = useState(false);

  const handleApply = () => {
    window.open(job.url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer rounded-3xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
      onClick={handleApply}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <span className="rounded-full gradient-brand px-2.5 py-0.5 text-[11px] font-semibold text-white">
              {job.match}% match
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
              job.type === "internship"
                ? "border-brand-2/40 bg-brand-2/10 text-brand-2"
                : "border-primary/30 bg-primary/10 text-primary"
            }`}>
              {job.type === "internship" ? "Internship" : "Full-time"}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" /> {job.company}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {job.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" /> {job.salary}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full transition ${saved ? "border-primary bg-primary/10 text-primary" : ""}`}
            onClick={() => setSaved((s) => !s)}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-primary" : ""}`} />
          </Button>
          <Button
            className="rounded-full gradient-brand text-white gap-1.5"
            onClick={handleApply}
          >
            Apply <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink className="h-3 w-3" /> Opens on LinkedIn Jobs
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────

function JobMatch() {
  const resume = getResumeData();
  const profile = getProfile();

  const hasResume = !!(resume && (resume.name || resume.skills || resume.exps?.length));

  const skills = buildSkillsFromResume(resume, profile);
  const role = resume?.title || profile?.role || "Developer";

  const [jobType, setJobType] = useState<"job" | "internship">("job");
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadKey, setLoadKey] = useState(0); // trigger refetch

  // Fetch jobs when jobType or loadKey changes
  useEffect(() => {
    if (!hasResume) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getDynamicJobs({
      data: {
        role,
        skills,
        type: jobType,
        customSearch: query || undefined,
      },
    })
      .then((result) => {
        if (!cancelled) setJobs(result);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load listings. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [jobType, loadKey, hasResume]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchInput.trim());
    setLoadKey((k) => k + 1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setQuery("");
    setLoadKey((k) => k + 1);
  };

  // Client-side filter
  const filtered = jobs.filter((j) => {
    const q = searchInput.toLowerCase();
    const textMatch = !q || (j.title + j.company + j.tags.join(" ")).toLowerCase().includes(q);
    const remoteMatch = !remoteOnly || j.location.toLowerCase().includes("remote");
    return textMatch && remoteMatch;
  });

  if (!hasResume) {
    return (
      <PageTransition>
        <SectionHeading
          eyebrow="Job Match"
          title="Find your perfect role"
          sub="Personalized to your resume and skills."
        />
        <div className="mt-8">
          <NoResumeGate />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <SectionHeading
        eyebrow="Job Match"
        title="Roles matched to your profile"
        sub={`Based on your resume · ${skills.length} skills · Targeting ${role}`}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px,1fr]">
        {/* ── Sidebar Filters ── */}
        <aside className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-5 space-y-4">
            {/* Job / Internship toggle */}
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Listing type
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setJobType("job"); setLoadKey((k) => k + 1); }}
                  className={`flex items-center justify-center gap-1.5 rounded-2xl border py-2.5 text-sm font-medium transition-all ${
                    jobType === "job"
                      ? "gradient-brand border-transparent text-white shadow-md shadow-primary/20"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <Briefcase className="h-3.5 w-3.5" /> Job
                </button>
                <button
                  onClick={() => { setJobType("internship"); setLoadKey((k) => k + 1); }}
                  className={`flex items-center justify-center gap-1.5 rounded-2xl border py-2.5 text-sm font-medium transition-all ${
                    jobType === "internship"
                      ? "gradient-brand border-transparent text-white shadow-md shadow-primary/20"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <GraduationCap className="h-3.5 w-3.5" /> Internship
                </button>
              </div>
            </div>

            {/* Remote filter */}
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-border p-3 text-sm transition hover:bg-secondary/40">
              <span className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Remote only
              </span>
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
            </label>

            {/* Refresh */}
            <Button
              variant="outline"
              className="w-full rounded-2xl gap-2"
              onClick={() => setLoadKey((k) => k + 1)}
              disabled={isLoading}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh listings
            </Button>
          </div>

          {/* Skills summary */}
          {skills.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Matching on
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 8).map((s) => (
                  <span key={s} className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {s}
                  </span>
                ))}
                {skills.length > 8 && (
                  <span className="text-xs text-muted-foreground">+{skills.length - 8} more</span>
                )}
              </div>
              <Link
                to="/app/resume/builder"
                className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Edit resume <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}

          {/* Pro tip */}
          <div className="rounded-3xl gradient-brand p-5 text-white">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4" /> Pro tip
            </div>
            <p className="mt-1 text-sm text-white/85">
              Tailor your resume for each role. Even small tweaks can lift your match score significantly.
            </p>
          </div>
        </aside>

        {/* ── Main Panel ── */}
        <div className="space-y-4">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title, company, or skill…"
                className="rounded-full pl-10 pr-10 h-11"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <Button type="submit" className="rounded-full gradient-brand text-white px-5 h-11" disabled={isLoading}>
              Search
            </Button>
          </form>

          {/* Status bar */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {isLoading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Finding {jobType === "internship" ? "internships" : "jobs"} for you…
                </span>
              ) : (
                `${filtered.length} ${jobType === "internship" ? "internships" : "jobs"} found${query ? ` for "${query}"` : ""}`
              )}
            </span>
            {query && (
              <button onClick={clearSearch} className="text-xs text-primary hover:underline">
                Clear search
              </button>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="h-16 w-16 rounded-full gradient-brand opacity-20 animate-ping absolute inset-0" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full gradient-brand">
                  <Briefcase className="h-7 w-7 text-white" />
                </div>
              </div>
              <p className="mt-5 font-medium">Finding the best {jobType === "internship" ? "internship" : "job"} matches…</p>
              <p className="mt-1 text-sm text-muted-foreground">AI is scanning based on your resume skills</p>
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 text-center text-sm text-red-500">
              {error}
              <Button variant="ghost" size="sm" className="mt-3 rounded-full" onClick={() => setLoadKey((k) => k + 1)}>
                Try again
              </Button>
            </div>
          )}

          {/* Job cards */}
          {!isLoading && !error && (
            <AnimatePresence mode="wait">
              <motion.div key={`${jobType}-${loadKey}`} className="space-y-4">
                {filtered.map((j, i) => (
                  <JobCard key={j.id} job={j} index={i} />
                ))}
                {filtered.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-3xl border border-dashed border-border p-14 text-center"
                  >
                    <Search className="mx-auto h-8 w-8 text-muted-foreground/50" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      No matches found. Try a different search or clear the filter.
                    </p>
                    {searchInput && (
                      <Button variant="ghost" size="sm" className="mt-3 rounded-full" onClick={clearSearch}>
                        Clear search
                      </Button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
