import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — PathWise AI" },
      { name: "description", content: "Set up your personalized career path." },
    ],
  }),
  component: Onboarding,
});

const goals = ["Land my first job", "Switch careers", "Level up my role", "Freelance / build my own thing"];
const suggestedSkills = ["JavaScript", "React", "TypeScript", "Python", "Node.js", "SQL", "AWS", "Docker", "AI / ML", "Design", "Product", "Writing"];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  
  // Profile State
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [goal, setGoal] = useState<string>("");
  const [skillSet, setSkillSet] = useState<string[]>([]);
  const [role, setRole] = useState("");
  
  // Custom Skill Input State
  const [customSkill, setCustomSkill] = useState("");

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  const next = () => {
    if (step < totalSteps - 1) setStep((s) => s + 1);
    else {
      try {
        localStorage.setItem("pw-onboarded", "1");
        localStorage.setItem("pw-profile", JSON.stringify({ name, education, goal, skillSet, role }));
      } catch {}
      navigate({ to: "/app" });
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const canContinue =
    (step === 0 && name.trim().length > 0 && education.trim().length > 0) ||
    (step === 1 && goal) || 
    (step === 2 && skillSet.length > 0) || 
    (step === 3 && role.trim().length > 0);

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const skill = customSkill.trim();
    if (skill && !skillSet.includes(skill)) {
      setSkillSet((prev) => [...prev, skill]);
    }
    setCustomSkill("");
  };

  const toggleSkill = (s: string) => {
    setSkillSet((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="aurora" />
      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-6 pb-16 pt-8">
        <div className="mb-6 flex items-center gap-3 text-xs font-medium text-muted-foreground">
          <span>Step {step + 1} of {totalSteps}</span>
          <Progress value={progress} className="h-1.5 flex-1" />
        </div>

        <div className="glass rounded-[2rem] border border-border/50 p-8 shadow-2xl md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                      Let's get to know you
                    </h1>
                    <p className="mt-2 text-base text-muted-foreground">Fill in your basic details to start your journey.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Chen"
                        className="h-12 bg-background/50 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education">Educational Background</Label>
                      <Input
                        id="education"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        placeholder="e.g. B.S. Computer Science at Stanford"
                        className="h-12 bg-background/50 text-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                      What's your main goal?
                    </h1>
                    <p className="mt-2 text-base text-muted-foreground">We'll tailor your roadmap around it.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {goals.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGoal(g)}
                        className={`rounded-2xl border p-5 text-left transition-all ${
                          goal === g
                            ? "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-md shadow-primary/10"
                            : "border-border/50 bg-background/50 hover:border-primary/40 hover:bg-muted/50"
                        }`}
                      >
                        <div className="font-medium">{g}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                      What are your skills?
                    </h1>
                    <p className="mt-2 text-base text-muted-foreground">Add any technical or soft skills you possess.</p>
                  </div>
                  
                  <form onSubmit={handleAddSkill} className="flex gap-2">
                    <Input
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      placeholder="Type a skill and press Enter..."
                      className="h-12 bg-background/50 text-base"
                    />
                    <Button type="submit" disabled={!customSkill.trim()} className="h-12 w-12 shrink-0 rounded-xl gradient-brand text-white">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </form>

                  {skillSet.length > 0 && (
                    <div className="rounded-xl border border-border/50 bg-background/30 p-4">
                      <Label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {skillSet.map((s) => (
                          <div
                            key={s}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium shadow-sm"
                          >
                            {s}
                            <button
                              type="button"
                              onClick={() => toggleSkill(s)}
                              className="ml-1 rounded-full p-0.5 hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSkills.filter(s => !skillSet.includes(s)).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSkill(s)}
                          className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-background/50 px-3 py-1.5 text-sm transition-colors hover:border-primary/40 hover:bg-muted"
                        >
                          <Plus className="h-3 w-3 text-muted-foreground" /> {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                      What's your target role?
                    </h1>
                    <p className="mt-2 text-base text-muted-foreground">Be specific. e.g. "Senior Frontend Engineer".</p>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="role">Target Role</Label>
                    <Input
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="AI Product Engineer"
                      className="h-12 bg-background/50 text-base"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between border-t border-border/50 pt-6">
            <Button variant="ghost" onClick={back} disabled={step === 0} className="rounded-full px-6 h-12 font-medium">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={next}
              disabled={!canContinue}
              className="rounded-full gradient-brand text-white px-8 h-12 font-medium shadow-lg shadow-primary/20 transition-all hover:scale-105 disabled:hover:scale-100"
            >
              {step === totalSteps - 1 ? "Finish Setup" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
