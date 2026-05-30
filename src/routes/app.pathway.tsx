import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Lock, PlayCircle, Loader2, Youtube, GraduationCap, X, BookOpen } from "lucide-react";
import { PageTransition, SectionHeading } from "@/components/page";
import { Button } from "@/components/ui/button";
import { getDynamicPathway, type PathwayMilestone } from "@/lib/ai";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/app/pathway")({
  head: () => ({ meta: [{ title: "Pathway — PathWise AI" }] }),
  component: Pathway,
});

function statusMeta(status: string) {
  if (status === "done") return { icon: CheckCircle2, label: "Completed", color: "text-emerald-500" };
  if (status === "active") return { icon: PlayCircle, label: "In progress", color: "text-primary" };
  return { icon: Lock, label: "Locked", color: "text-muted-foreground" };
}

function LearnDialog({ step, onClose }: { step: PathwayMilestone; onClose: () => void }) {
  const openResource = (type: "video" | "course") => {
    const query = encodeURIComponent(step.title);
    if (type === "video") {
      window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
    } else {
      window.open(
        `https://www.google.com/search?q=free+course+${query}+site:coursera.org+OR+site:freecodecamp.org+OR+site:udemy.com+OR+site:edx.org`,
        "_blank"
      );
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-black/30"
        >
          {/* Header */}
          <div className="relative overflow-hidden px-7 pt-7 pb-5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-brand-2/10" />
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5 text-primary" /> Milestone {step.id}
              </div>
              <h2 className="mt-2 font-display text-xl font-bold tracking-tight">{step.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
            </div>
          </div>

          {/* Options */}
          <div className="px-7 pb-7">
            <p className="mb-4 text-sm font-semibold text-foreground">How would you like to learn this?</p>
            <div className="grid grid-cols-2 gap-3">

              {/* YouTube Videos */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openResource("video")}
                className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-background p-5 text-center transition-all hover:border-red-500/60 hover:bg-red-500/5 hover:shadow-lg hover:shadow-red-500/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 transition group-hover:bg-red-500 group-hover:text-white">
                  <Youtube className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display font-semibold text-sm">Watch Videos</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">Search on YouTube</div>
                </div>
              </motion.button>

              {/* Free Courses */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openResource("course")}
                className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-background p-5 text-center transition-all hover:border-primary/60 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display font-semibold text-sm">Free Courses</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">Coursera, freeCodeCamp…</div>
                </div>
              </motion.button>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">Opens in a new tab</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Pathway() {
  const [selectedStep, setSelectedStep] = useState<PathwayMilestone | null>(null);

  const [roadmap, setRoadmap] = useState<PathwayMilestone[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const cached = localStorage.getItem("pw-roadmap");
        if (cached) {
          setRoadmap(JSON.parse(cached));
          setIsLoading(false);
          return;
        }

        let profile = { role: "Software Engineer", skillSet: [] };
        const stored = localStorage.getItem("pw-profile");
        if (stored) profile = JSON.parse(stored);
        
        const newRoadmap = await getDynamicPathway({ data: { role: profile.role, skills: profile.skillSet } });
        
        // Initialize statuses: first is active, rest locked
        const initializedRoadmap = newRoadmap.map((step, index) => ({
          ...step,
          status: index === 0 ? "active" : "locked"
        }));
        
        setRoadmap(initializedRoadmap);
        localStorage.setItem("pw-roadmap", JSON.stringify(initializedRoadmap));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRoadmap();
  }, []);

  const markAsComplete = (e: React.MouseEvent, stepId: number) => {
    e.stopPropagation();
    if (!roadmap) return;
    
    const updatedRoadmap = [...roadmap];
    const currentIndex = updatedRoadmap.findIndex(s => s.id === stepId);
    
    if (currentIndex !== -1) {
      updatedRoadmap[currentIndex].status = "done";
      if (currentIndex + 1 < updatedRoadmap.length) {
        updatedRoadmap[currentIndex + 1].status = "active";
      }
      setRoadmap(updatedRoadmap);
      localStorage.setItem("pw-roadmap", JSON.stringify(updatedRoadmap));
    }
  };

  return (
    <PageTransition>
      <SectionHeading
        eyebrow="Your roadmap"
        title="Your Personalized Pathway"
        sub="Click any milestone to find videos or free courses on that topic."
      />

      <div className="relative mt-8 grid gap-6 lg:grid-cols-[1fr,320px]">
        {isLoading || !roadmap ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">AI is generating your personalized roadmap...</p>
          </div>
        ) : (
          <ol className="relative space-y-4 border-l-2 border-dashed border-border pl-6">
            {roadmap.map((step, i) => {
              const m = statusMeta(step.status);
              return (
                <motion.li
                  key={step.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative"
                >
                  <span className="absolute -left-[33px] top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-background ring-2 ring-border">
                    <m.icon className={`h-4 w-4 ${m.color}`} />
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedStep(step)}
                    className={`cursor-pointer rounded-3xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 ${step.status === "locked" ? "opacity-60" : ""}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">Milestone {step.id}</div>
                        <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs ${m.color}`}>
                          {m.label}
                        </span>
                        <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary font-medium">
                          Learn →
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
                    {step.status === "active" && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          className="rounded-full gradient-brand text-white"
                          onClick={(e) => { e.stopPropagation(); setSelectedStep(step); }}
                        >
                          Continue learning
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-full border-border hover:bg-accent"
                          onClick={(e) => markAsComplete(e, step.id)}
                        >
                          Mark as Complete
                        </Button>
                      </div>
                    )}
                    {step.status === "done" && (
                      <Button
                        variant="outline"
                        className="mt-4 rounded-full"
                        onClick={(e) => { e.stopPropagation(); setSelectedStep(step); }}
                      >
                        Review
                      </Button>
                    )}
                  </motion.div>
                </motion.li>
              );
            })}
          </ol>
        )}

        <aside className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-5">
            <h4 className="font-display text-base font-semibold">Recommended now</h4>
            <ul className="mt-3 space-y-3 text-sm">
              {["Core Fundamentals", "Build a Portfolio", "Interview Prep"].map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <Circle className="h-3 w-3 text-primary" /> {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl gradient-brand p-5 text-white">
            <div className="font-display text-base font-semibold">Pro tip</div>
            <p className="mt-1 text-sm text-white/85">
              Build one project per milestone. Shipping beats studying every time.
            </p>
          </div>
        </aside>
      </div>

      {/* Learn Dialog */}
      {selectedStep && (
        <LearnDialog step={selectedStep} onClose={() => setSelectedStep(null)} />
      )}
    </PageTransition>
  );
}
