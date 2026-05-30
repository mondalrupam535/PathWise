import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Bookmark, MapPin, Briefcase, DollarSign, Loader2 } from "lucide-react";
import { PageTransition, SectionHeading } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDynamicJobs } from "@/lib/ai";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/app/jobs")({
  head: () => ({ meta: [{ title: "Job Match — PathWise AI" }] }),
  component: JobMatch,
});

function JobMatch() {
  const [query, setQuery] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      let profile = { role: "Developer", skillSet: [] };
      try {
        const stored = localStorage.getItem("pw-profile");
        if (stored) profile = JSON.parse(stored);
      } catch {}
      return getDynamicJobs({ data: { role: profile.role, skills: profile.skillSet } });
    }
  });

  const filtered = (jobs || []).filter((j) => {
    const matchQuery = (j.title + j.company + j.tags.join(" ")).toLowerCase().includes(query.toLowerCase());
    const matchRemote = !remoteOnly || j.location.toLowerCase() === "remote";
    return matchQuery && matchRemote;
  });

  return (
    <PageTransition>
      <SectionHeading eyebrow="Job Match" title="Roles matched to your skills" sub="Ranked by fit. Generated live by AI." />
      <div className="mt-6 grid gap-6 lg:grid-cols-[260px,1fr]">
        <aside className="space-y-4 rounded-3xl border border-border bg-card p-5">
          <div>
            <div className="mb-1 text-xs font-medium text-muted-foreground">Search</div>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Title, company, tag…" />
          </div>
          <label className="flex items-center justify-between rounded-2xl border border-border p-3 text-sm">
            <span>Remote only</span>
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
          </label>
          <div className="rounded-2xl gradient-brand p-4 text-white">
            <div className="text-sm font-semibold">Boost your matches</div>
            <p className="mt-1 text-xs text-white/85">Add 2 more skills to unlock 5 stronger matches.</p>
          </div>
        </aside>

        <div className="grid gap-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">AI is finding the best job matches for your profile...</p>
            </div>
          ) : (
            <>
              {filtered.map((j, i) => (
                <motion.div
                  key={j.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-3xl border border-border bg-card p-5 transition hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-semibold">{j.title}</h3>
                        <span className="rounded-full gradient-brand px-2 py-0.5 text-[11px] font-semibold text-white">
                          {j.match}% match
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {j.company}</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {j.location}</span>
                        <span className="inline-flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {j.salary}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button className="rounded-full gradient-brand text-white">Apply</Button>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {j.tags.map((t) => (
                      <span key={t} className="rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                  No matches found. Try different filters.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
