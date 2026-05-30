import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar
} from "recharts";
import { PageTransition, SectionHeading } from "@/components/page";

export const Route = createFileRoute("/app/progress")({
  head: () => ({ meta: [{ title: "Progress — PathWise AI" }] }),
  component: ProgressPage,
});

function ProgressPage() {
  const [profile, setProfile] = useState<any>({ skillSet: [], name: "Builder" });
  const [roadmap, setRoadmap] = useState<any[] | null>(null);
  
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem("pw-profile");
        if (stored) setProfile(JSON.parse(stored));
        const r = localStorage.getItem("pw-roadmap");
        if (r) setRoadmap(JSON.parse(r));
      } catch {}
    };
    loadData();
    window.addEventListener("profile-updated", loadData);
    return () => window.removeEventListener("profile-updated", loadData);
  }, []);

  // Format skills for the bar chart with consistent pseudo-random levels
  const skillsData = profile.skillSet.length > 0 
    ? profile.skillSet.map((s: string, i: number) => ({ name: s, level: 40 + (i * 15) % 50 }))
    : [{ name: "Onboarding", level: 20 }];

  // Fake weekly data for the visual (since we don't have a DB to track real hours yet)
  const weekly = [
    { day: "Mon", score: 2 },
    { day: "Tue", score: 4 },
    { day: "Wed", score: 1 },
    { day: "Thu", score: 5 },
    { day: "Fri", score: 3 },
    { day: "Sat", score: 6 },
    { day: "Sun", score: 2 },
  ];

  // Dynamic achievements based on local storage
  const doneMilestones = roadmap ? roadmap.filter(r => r.status === "done").length : 0;

  const achievements = [
    { title: "First Step", desc: "Completed your profile onboarding.", earned: !!profile.name && profile.name !== "Builder" },
    { title: "Specialist", desc: `Added ${profile.skillSet.length} skills to your arsenal.`, earned: profile.skillSet.length > 0 },
    { title: "Roadmap Generated", desc: "AI created your personalized pathway.", earned: !!roadmap },
    { title: "First Milestone", desc: "Completed your first roadmap task.", earned: doneMilestones >= 1 },
    { title: "Halfway There", desc: "Completed 50% of your roadmap.", earned: roadmap ? doneMilestones >= roadmap.length / 2 : false },
    { title: "Job Hunter", desc: "Apply to 5 matched jobs.", earned: false },
  ];

  return (
    <PageTransition>
      <SectionHeading eyebrow="Progress" title={`${profile.name}'s Momentum`} sub="Track your weekly effort and skill growth." />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Activity Score</h3>
            <div className="text-xs text-muted-foreground">Last 7 days</div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--foreground)",
                  }}
                />
                <Area dataKey="score" stroke="var(--brand)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold">Skill proficiency</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} width={80} />
                <Tooltip
                  cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--foreground)",
                  }}
                />
                <Bar dataKey="level" fill="var(--brand)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Achievements</h3>
          <div className="text-xs text-muted-foreground">{achievements.filter((a) => a.earned).length} of {achievements.length} earned</div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`rounded-2xl border p-5 ${
                a.earned ? "border-primary/40 bg-primary/5" : "border-border bg-secondary/30 opacity-70"
              }`}
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
                a.earned ? "gradient-brand text-white" : "bg-muted text-muted-foreground"
              }`}>
                {a.earned ? <Trophy className="h-4 w-4" /> : <Award className="h-4 w-4" />}
              </div>
              <div className="mt-3 font-display font-semibold">{a.title}</div>
              <div className="text-sm text-muted-foreground">{a.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
