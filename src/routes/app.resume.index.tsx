import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/resume/")({
  beforeLoad: () => {
    throw redirect({ to: "/app/resume/builder" });
  },
});
