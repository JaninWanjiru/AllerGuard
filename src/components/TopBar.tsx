import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useAppStore } from "@/store/app-store";

export function TopBar() {
  const log = useAppStore((s) => s.complianceLog);
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
      <Link to="/" className="flex items-center">
        <Logo size="sm" />
      </Link>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Activity (${log.length} events)`}
          className="relative grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-card/60"
        >
          <Bell className="h-4.5 w-4.5" />
          {log.length > 0 && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-coral" />
          )}
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
