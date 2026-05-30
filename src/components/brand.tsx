import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 group">
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl gradient-brand text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-110">
        <Sparkles className="h-4 w-4" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">
        PathWise<span className="text-gradient-brand"> AI</span>
      </span>
    </Link>
  );
}
