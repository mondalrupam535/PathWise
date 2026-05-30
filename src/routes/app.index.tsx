import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Map, MessageSquare, FileText, Briefcase, TrendingUp, Sparkles, GraduationCap, CheckCircle2 } from "lucide-react";
import { PageTransition, SectionHeading } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard — PathWise AI" }] }),
  component: Dashboard,
});

const quick = [
  { to: "/app/pathway", title: "Continue pathway", desc: "View your next steps", icon: Map },
  { to: "/app/guide", title: "Ask your AI mentor", desc: "Get help in seconds", icon: MessageSquare },
  { to: "/app/resume/builder", title: "Polish your resume", desc: "Builder & analyzer", icon: FileText },
  { to: "/app/jobs", title: "Browse matched jobs", desc: "Based on your skills", icon: Briefcase },
];

function Dashboard() {
  const [profile, setProfile] = useState<{name: string, education: string, goal: string, role: string, skillSet: string[]}>({
    name: "Alex",
    education: "B.S. Computer Science",
    goal: "Land my first job",
    role: "Software Engineer",
    skillSet: ["JavaScript", "React", "Node.js"]
  });

  const [roadmap, setRoadmap] = useState<any[] | null>(null);

  useEffect(() => {
    const loadData = () => {
      try {
        const p = localStorage.getItem("pw-profile");
        if (p) {
          setProfile(JSON.parse(p));
        }
        const r = localStorage.getItem("pw-roadmap");
        if (r) {
          setRoadmap(JSON.parse(r));
        }
      } catch {}
    };
    loadData();
    window.addEventListener("profile-updated", loadData);
    return () => window.removeEventListener("profile-updated", loadData);
  }, []);

  const totalMilestones = roadmap ? roadmap.length : 6;
  const doneMilestones = roadmap ? roadmap.filter(r => r.status === "done").length : 0;
  const progressPercent = roadmap ? Math.round((doneMilestones / totalMilestones) * 100) : 0;

  const stats = [
    { label: "Roadmap", value: `${progressPercent}%`, sub: progressPercent === 100 ? "Completed!" : "In progress", icon: Map, color: "from-violet-500 to-fuchsia-500" },
    { label: "Skills tracked", value: (profile.skillSet?.length || 0).toString(), sub: "Added in onboarding", icon: TrendingUp, color: "from-cyan-500 to-blue-500" },
    { label: "Applications", value: "0", sub: "Ready when you are", icon: Briefcase, color: "from-emerald-500 to-teal-500" },
    { label: "AI chats", value: "0", sub: "Start a session", icon: MessageSquare, color: "from-amber-500 to-orange-500" },
  ];

  const activity = [
    { t: "Profile Created", d: `Joined PathWise to ${profile.goal ? profile.goal.toLowerCase() : "grow"}`, time: "Just now" },
    { t: "Skills Added", d: `Tracked ${profile.skillSet?.length || 0} initial skills`, time: "Just now" }
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Welcome back"
            title={`Hey ${profile.name ? profile.name.split(' ')[0] : 'Alex'} 👋 ready to keep building?`}
            sub="Here's a snapshot of your journey today."
          />
          <Button asChild className="rounded-full gradient-brand text-white">
            <Link to="/app/guide"><Sparkles className="mr-1 h-4 w-4" /> Ask AI mentor</Link>
          </Button>
        </div>

        {/* Profile Snapshot */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border/50 bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" /> Profile Snapshot
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Education</div>
                  <div className="mt-1 text-sm font-medium">{profile.education || "Not specified"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Target Role</div>
                  <div className="mt-1 text-sm font-medium">{profile.role || "Not specified"}</div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 border-t border-border/50 pt-6 md:border-l md:border-t-0 md:pt-0 md:pl-8">
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Your Skills</div>
              <div className="flex flex-wrap gap-2">
                {profile.skillSet?.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary">
                    <CheckCircle2 className="h-3 w-3" /> {skill}
                  </span>
                ))}
                {(!profile.skillSet || profile.skillSet.length === 0) && (
                  <span className="text-sm text-muted-foreground">No skills added yet.</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-2xl`} />
              <div className="relative flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">{s.label}</div>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative mt-2 font-display text-3xl font-bold">{s.value}</div>
              <div className="relative mt-1 text-xs font-medium text-muted-foreground/80">{s.sub}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Your roadmap</h3>
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <Link to="/app/pathway">View all <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">Currently on: {roadmap?.find(r => r.status === "active")?.title || `Basics of ${profile.role || "your target role"}`}</div>
              <div className="mt-5 space-y-2">
                <Progress value={progressPercent} className="h-2 transition-all duration-500" />
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>{doneMilestones} of {totalMilestones} milestones</span>
                  <span>{progressPercent}%</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {quick.map((q) => (
                <Link
                  key={q.to}
                  to={q.to}
                  className="group rounded-3xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl gradient-brand text-white shadow-md shadow-primary/30 group-hover:scale-110 transition-transform">
                    <q.icon className="h-4 w-4" />
                  </div>
                  <div className="mt-4 font-display font-semibold">{q.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{q.desc}</div>
                  <div className="mt-4 inline-flex items-center text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
                    Open <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-display text-lg font-semibold">Recent activity</h3>
            <ul className="mt-6 space-y-5">
              {activity.map((a, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1.5 h-2 w-2 rounded-full gradient-brand shadow-sm shadow-primary/40" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{a.t}</div>
                    <div className="mt-0.5 truncate text-sm text-muted-foreground">{a.d}</div>
                    <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">{a.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
