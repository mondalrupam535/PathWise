import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PageTransition, SectionHeading } from "@/components/page";

export const Route = createFileRoute("/app/resume")({
  head: () => ({ meta: [{ title: "Resume — PathWise AI" }] }),
  component: ResumeLayout,
});

const tabs = [
  { to: "/app/resume/builder", label: "Builder" },
  { to: "/app/resume/analyzer", label: "Analyzer" },
];

function ResumeLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <PageTransition>
      <SectionHeading eyebrow="Resume" title="Build & analyze your resume" sub="Create something recruiters can't skip." />
      <div className="mt-6 inline-flex rounded-full border border-border bg-card p-1">
        {tabs.map((t) => {
          const active = path === t.to || (t.to.endsWith("builder") && path === "/app/resume");
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                active ? "gradient-brand text-white shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-6">
        <Outlet />
      </div>
    </PageTransition>
  );
}
