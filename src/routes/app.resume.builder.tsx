import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/resume/builder")({
  head: () => ({ meta: [{ title: "Resume Builder — PathWise AI" }] }),
  component: ResumeBuilder,
});

type Exp = { id: number; role: string; company: string; period: string; desc: string };

function ResumeBuilder() {
  const [name, setName] = useState("Alex Chen");
  const [title, setTitle] = useState("Aspiring AI Product Engineer");
  const [email, setEmail] = useState("alex@example.com");
  const [summary, setSummary] = useState(
    "Driven engineer focused on shipping AI-powered products. Strong in React, TypeScript, and product thinking.",
  );
  const [skills, setSkills] = useState("React, TypeScript, Node.js, Python, SQL, LLMs");
  const [exps, setExps] = useState<Exp[]>([
    { id: 1, role: "Frontend Intern", company: "Lumen Labs", period: "Summer 2024", desc: "Shipped onboarding flow that lifted activation by 18%." },
  ]);

  const addExp = () =>
    setExps((e) => [...e, { id: Date.now(), role: "", company: "", period: "", desc: "" }]);
  const removeExp = (id: number) => setExps((e) => e.filter((x) => x.id !== id));
  const updateExp = (id: number, key: keyof Exp, value: string) =>
    setExps((e) => e.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-3xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-semibold">Edit your resume</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Headline</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Summary</Label>
          <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} />
        </div>

        <div className="space-y-1.5">
          <Label>Skills (comma separated)</Label>
          <Input value={skills} onChange={(e) => setSkills(e.target.value)} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Experience</Label>
            <Button variant="outline" size="sm" className="rounded-full" onClick={addExp}>
              <Plus className="mr-1 h-3 w-3" /> Add
            </Button>
          </div>
          {exps.map((x) => (
            <div key={x.id} className="space-y-2 rounded-2xl border border-border p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Role" value={x.role} onChange={(e) => updateExp(x.id, "role", e.target.value)} />
                <Input placeholder="Company" value={x.company} onChange={(e) => updateExp(x.id, "company", e.target.value)} />
              </div>
              <Input placeholder="Period (e.g. 2023–2024)" value={x.period} onChange={(e) => updateExp(x.id, "period", e.target.value)} />
              <Textarea placeholder="Impact, metrics, what you shipped" value={x.desc} onChange={(e) => updateExp(x.id, "desc", e.target.value)} rows={2} />
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="rounded-full text-destructive" onClick={() => removeExp(x.id)}>
                  <Trash2 className="mr-1 h-3 w-3" /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-end">
          <Button className="rounded-full gradient-brand text-white" onClick={() => window.print()}>
            <Download className="mr-1 h-4 w-4" /> Export PDF
          </Button>
        </div>
        <div className="rounded-3xl border border-border bg-white p-8 text-black shadow-xl">
          <div className="border-b border-zinc-200 pb-4">
            <h1 className="font-display text-2xl font-bold">{name || "Your name"}</h1>
            <div className="text-sm text-zinc-600">{title}</div>
            <div className="mt-1 text-xs text-zinc-500">{email}</div>
          </div>

          <section className="mt-4">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-zinc-700">Summary</h2>
            <p className="mt-1 text-sm leading-relaxed text-zinc-700">{summary}</p>
          </section>

          <section className="mt-4">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-zinc-700">Skills</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {skills.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                <span key={s} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">{s}</span>
              ))}
            </div>
          </section>

          <section className="mt-4">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-zinc-700">Experience</h2>
            <div className="mt-2 space-y-3">
              {exps.map((x) => (
                <div key={x.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="font-medium text-zinc-800">{x.role || "Role"} <span className="text-zinc-500">· {x.company || "Company"}</span></div>
                    <div className="text-xs text-zinc-500">{x.period}</div>
                  </div>
                  <p className="text-sm text-zinc-700">{x.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
