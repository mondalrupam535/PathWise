import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Download, Plus, Trash2, Sparkles, Loader2, Github, Linkedin, Phone, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { improveResumeSection } from "@/lib/ai";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/app/resume/builder")({
  head: () => ({ meta: [{ title: "Resume Builder — PathWise AI" }] }),
  component: ResumeBuilder,
});

type Exp = { id: number; role: string; company: string; period: string; desc: string };
type Edu = { id: number; degree: string; school: string; year: string };
type Project = { id: number; name: string; url: string; desc: string };

const STORAGE_KEY = "pw-resume-data";

function loadSaved() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function ResumeBuilder() {
  const saved = loadSaved();
  const profile = (() => {
    try { return JSON.parse(localStorage.getItem("pw-profile") || "{}"); } catch { return {}; }
  })();

  const [name, setName] = useState(saved?.name ?? profile?.name ?? "");
  const [title, setTitle] = useState(saved?.title ?? profile?.role ?? "");
  const [email, setEmail] = useState(saved?.email ?? "");
  const [phone, setPhone] = useState(saved?.phone ?? "");
  const [linkedin, setLinkedin] = useState(saved?.linkedin ?? "");
  const [github, setGithub] = useState(saved?.github ?? "");
  const [summary, setSummary] = useState(
    saved?.summary ??
      "Driven engineer focused on shipping AI-powered products. Strong in React, TypeScript, and product thinking.",
  );
  const [skills, setSkills] = useState(saved?.skills ?? (profile?.skillSet?.join(", ") || ""));
  const [exps, setExps] = useState<Exp[]>(
    saved?.exps ?? [
      { id: 1, role: "Frontend Intern", company: "Lumen Labs", period: "Summer 2024", desc: "Shipped onboarding flow that lifted activation by 18%." },
    ],
  );
  const [edus, setEdus] = useState<Edu[]>(
    saved?.edus ?? [{ id: 1, degree: "", school: "", year: "" }],
  );
  const [projects, setProjects] = useState<Project[]>(saved?.projects ?? []);
  const [improvingId, setImprovingId] = useState<number | null>(null);
  const [improvingSummary, setImprovingSummary] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);

  // Persist to localStorage whenever data changes
  useEffect(() => {
    const data = { name, title, email, phone, linkedin, github, summary, skills, exps, edus, projects };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSavedIndicator(true);
      const t = setTimeout(() => setSavedIndicator(false), 1500);
      return () => clearTimeout(t);
    } catch {}
  }, [name, title, email, phone, linkedin, github, summary, skills, exps, edus, projects]);

  // Experience helpers
  const addExp = () => setExps((e) => [...e, { id: Date.now(), role: "", company: "", period: "", desc: "" }]);
  const removeExp = (id: number) => setExps((e) => e.filter((x) => x.id !== id));
  const updateExp = (id: number, key: keyof Exp, value: string) =>
    setExps((e) => e.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  // Education helpers
  const addEdu = () => setEdus((e) => [...e, { id: Date.now(), degree: "", school: "", year: "" }]);
  const removeEdu = (id: number) => setEdus((e) => e.filter((x) => x.id !== id));
  const updateEdu = (id: number, key: keyof Edu, value: string) =>
    setEdus((e) => e.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  // Project helpers
  const addProject = () => setProjects((p) => [...p, { id: Date.now(), name: "", url: "", desc: "" }]);
  const removeProject = (id: number) => setProjects((p) => p.filter((x) => x.id !== id));
  const updateProject = (id: number, key: keyof Project, value: string) =>
    setProjects((p) => p.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  // AI improve experience bullet
  const improveExp = async (exp: Exp) => {
    if (!exp.desc.trim()) return;
    setImprovingId(exp.id);
    try {
      const res = await improveResumeSection({
        data: { text: exp.desc, sectionType: "work experience bullet point", role: title || profile?.role || "Software Engineer" },
      });
      updateExp(exp.id, "desc", res.improved);
    } catch {}
    setImprovingId(null);
  };

  // AI improve summary
  const improveSummary = async () => {
    if (!summary.trim()) return;
    setImprovingSummary(true);
    try {
      const res = await improveResumeSection({
        data: { text: summary, sectionType: "professional summary", role: title || profile?.role || "Software Engineer" },
      });
      setSummary(res.improved);
    } catch {}
    setImprovingSummary(false);
  };

  const handlePrint = () => {
    const previewEl = document.getElementById("resume-preview");
    if (!previewEl) return;
    const html = previewEl.innerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      alert("Pop-up blocked. Please allow pop-ups for this site and try again.");
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Resume — ${name || "PathWise"}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
              font-size: 12pt;
              color: #111;
              background: #fff;
              padding: 1.5cm 2cm;
            }
            h1, h2, h3, h4, h5 {
              font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
              letter-spacing: -0.02em;
            }
            .border-b { border-bottom: 1px solid #e4e4e7; padding-bottom: 1.2rem; }
            .border-zinc-200 { border-color: #e4e4e7; }
            section { margin-top: 1rem; }
            .flex { display: flex; }
            .flex-wrap { flex-wrap: wrap; }
            .items-center { align-items: center; }
            .items-baseline { align-items: baseline; }
            .justify-between { justify-content: space-between; }
            .gap-x-4 { column-gap: 1rem; }
            .gap-y-1 { row-gap: 0.25rem; }
            .gap-1\.5 { gap: 0.375rem; }
            .gap-2 { gap: 0.5rem; }
            .space-y-2 > * + * { margin-top: 0.5rem; }
            .space-y-3 > * + * { margin-top: 0.75rem; }
            .mt-0\.5 { margin-top: 0.125rem; }
            .mt-1\.5 { margin-top: 0.375rem; }
            .mt-2 { margin-top: 0.5rem; }
            .shrink-0 { flex-shrink: 0; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            .font-normal { font-weight: 400; }
            .text-2xl { font-size: 1.5rem; line-height: 2rem; }
            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .text-xs { font-size: 0.75rem; line-height: 1rem; }
            .text-zinc-900 { color: #18181b; }
            .text-zinc-800 { color: #27272a; }
            .text-zinc-700 { color: #3f3f46; }
            .text-zinc-600 { color: #52525b; }
            .text-zinc-500 { color: #71717a; }
            .text-zinc-400 { color: #a1a1aa; }
            .uppercase { text-transform: uppercase; }
            .tracking-widest { letter-spacing: 0.1em; }
            .leading-relaxed { line-height: 1.625; }
            .rounded-full { border-radius: 9999px; }
            .bg-zinc-100 { background-color: #f4f4f5; }
            .px-2\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
            .py-0\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
            @page { size: A4; margin: 1.5cm 2cm; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 600);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 resume-builder-layout">
      {/* ── Editor Panel ── */}
      <div className="resume-editor space-y-5 rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Edit your resume</h3>
          <AnimatePresence>
            {savedIndicator && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-emerald-500 font-medium"
              >
                ✓ Auto-saved
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Personal Info */}
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Chen" />
            </div>
            <div className="space-y-1.5">
              <Label>Headline / Target role</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="AI Product Engineer" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" className="pl-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>LinkedIn URL</Label>
              <div className="relative">
                <Linkedin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/alexchen" className="pl-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>GitHub URL</Label>
              <div className="relative">
                <Github className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="github.com/alexchen" className="pl-9" />
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-1.5">
          <Label>Professional Summary</Label>
          <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 rounded-full px-3 text-xs text-primary hover:bg-primary/10"
            onClick={improveSummary}
            disabled={improvingSummary || !summary.trim()}
          >
            {improvingSummary ? (
              <><Loader2 className="mr-1 h-3 w-3 animate-spin" />Improving…</>
            ) : (
              <><Sparkles className="mr-1 h-3 w-3" />AI Improve Summary</>
            )}
          </Button>
        </div>

        {/* Skills */}
        <div className="space-y-1.5">
          <Label>Skills (comma separated)</Label>
          <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, TypeScript, Python…" />
        </div>

        {/* Education */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Education</Label>
            <Button variant="outline" size="sm" className="rounded-full" onClick={addEdu}>
              <Plus className="mr-1 h-3 w-3" /> Add
            </Button>
          </div>
          {edus.map((x) => (
            <div key={x.id} className="space-y-2 rounded-2xl border border-border p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Degree / Qualification" value={x.degree} onChange={(e) => updateEdu(x.id, "degree", e.target.value)} />
                <Input placeholder="School / University" value={x.school} onChange={(e) => updateEdu(x.id, "school", e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <Input placeholder="Year (e.g. 2020–2024)" value={x.year} onChange={(e) => updateEdu(x.id, "year", e.target.value)} />
                {edus.length > 1 && (
                  <Button variant="ghost" size="sm" className="shrink-0 rounded-full text-destructive" onClick={() => removeEdu(x.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Experience */}
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
              <div className="relative">
                <Textarea
                  placeholder="Impact, metrics, what you shipped"
                  value={x.desc}
                  onChange={(e) => updateExp(x.id, "desc", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-3 text-xs text-primary hover:bg-primary/10"
                  onClick={() => improveExp(x)}
                  disabled={improvingId === x.id || !x.desc.trim()}
                >
                  {improvingId === x.id ? (
                    <><Loader2 className="mr-1 h-3 w-3 animate-spin" />Improving…</>
                  ) : (
                    <><Sparkles className="mr-1 h-3 w-3" />AI Improve</>
                  )}
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full text-destructive" onClick={() => removeExp(x.id)}>
                  <Trash2 className="mr-1 h-3 w-3" /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Projects</Label>
            <Button variant="outline" size="sm" className="rounded-full" onClick={addProject}>
              <Plus className="mr-1 h-3 w-3" /> Add
            </Button>
          </div>
          {projects.map((x) => (
            <div key={x.id} className="space-y-2 rounded-2xl border border-border p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Project name" value={x.name} onChange={(e) => updateProject(x.id, "name", e.target.value)} />
                <div className="relative">
                  <Globe className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="URL (optional)" value={x.url} onChange={(e) => updateProject(x.id, "url", e.target.value)} className="pl-9" />
                </div>
              </div>
              <div className="flex gap-2">
                <Textarea placeholder="What it does, tech used, impact" value={x.desc} onChange={(e) => updateProject(x.id, "desc", e.target.value)} rows={2} className="flex-1" />
                <Button variant="ghost" size="sm" className="mt-1 shrink-0 rounded-full text-destructive self-start" onClick={() => removeProject(x.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Preview Panel ── */}
      <div className="resume-preview-pane space-y-3">
        <div className="flex items-center justify-end">
          <Button className="rounded-full gradient-brand text-white" onClick={handlePrint}>
            <Download className="mr-1 h-4 w-4" /> Export PDF
          </Button>
        </div>

        {/* The actual printable resume */}
        <div id="resume-preview" className="resume-preview rounded-3xl border border-border bg-white p-8 text-black shadow-xl print:rounded-none print:border-none print:shadow-none">
          {/* Header */}
          <div className="border-b border-zinc-200 pb-5">
            <h1 className="font-display text-2xl font-bold text-zinc-900">{name || "Your name"}</h1>
            {title && <div className="mt-0.5 text-sm font-medium text-zinc-600">{title}</div>}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
              {email && <span>{email}</span>}
              {phone && <span>{phone}</span>}
              {linkedin && <span>{linkedin.replace(/^https?:\/\//, "")}</span>}
              {github && <span>{github.replace(/^https?:\/\//, "")}</span>}
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <section className="mt-4">
              <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-zinc-500">Summary</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-700">{summary}</p>
            </section>
          )}

          {/* Skills */}
          {skills.trim() && (
            <section className="mt-4">
              <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-zinc-500">Skills</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skills.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                  <span key={s} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-700">{s}</span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {edus.some((e) => e.degree || e.school) && (
            <section className="mt-4">
              <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-zinc-500">Education</h2>
              <div className="mt-2 space-y-2">
                {edus.filter((e) => e.degree || e.school).map((e) => (
                  <div key={e.id} className="flex items-baseline justify-between gap-2">
                    <div>
                      <span className="text-sm font-medium text-zinc-800">{e.degree}</span>
                      {e.school && <span className="text-sm text-zinc-500"> · {e.school}</span>}
                    </div>
                    {e.year && <span className="shrink-0 text-xs text-zinc-400">{e.year}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {exps.some((x) => x.role || x.company) && (
            <section className="mt-4">
              <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-zinc-500">Experience</h2>
              <div className="mt-2 space-y-3">
                {exps.filter((x) => x.role || x.company).map((x) => (
                  <div key={x.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="font-medium text-zinc-800">
                        {x.role || "Role"}
                        {x.company && <span className="font-normal text-zinc-500"> · {x.company}</span>}
                      </div>
                      {x.period && <div className="shrink-0 text-xs text-zinc-400">{x.period}</div>}
                    </div>
                    {x.desc && <p className="mt-0.5 text-sm leading-relaxed text-zinc-600">{x.desc}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.some((p) => p.name) && (
            <section className="mt-4">
              <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-zinc-500">Projects</h2>
              <div className="mt-2 space-y-2">
                {projects.filter((p) => p.name).map((p) => (
                  <div key={p.id}>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-zinc-800">{p.name}</span>
                      {p.url && (
                        <span className="text-xs text-zinc-400">{p.url.replace(/^https?:\/\//, "")}</span>
                      )}
                    </div>
                    {p.desc && <p className="mt-0.5 text-sm leading-relaxed text-zinc-600">{p.desc}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
