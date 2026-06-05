import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ScanLine, UserCircle2, History, LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/scan", label: "Scan", icon: ScanLine },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
  { to: "/history", label: "History", icon: History },
] as const;

export function FloatingNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-40 hidden lg:block">
      <div className="pointer-events-auto mx-auto flex max-w-5xl items-center justify-between gap-6 rounded-2xl glass px-4 py-2.5 shadow-soft">
        <Link to="/" className="flex items-center">
          <Logo size="sm" />
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-1">
          {NAV.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {active && (
                  <motion.span
                    layoutId="floating-nav-active"
                    className="absolute inset-0 -z-10 rounded-xl bg-gradient-brand shadow-steel"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className={`h-4 w-4 ${active ? "text-powder" : ""}`} />
                <span className={active ? "text-powder" : ""}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <button
              type="button"
              onClick={() => {
                signOut();
                toast.success("Signed out");
              }}
              className="flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/40"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden xl:inline">{user.name}</span>
            </button>
          ) : (
            <Link
              to="/signin"
              className="flex items-center gap-2 rounded-full bg-gradient-coral px-3.5 py-2 text-sm font-semibold text-powder shadow-coral transition-transform hover:scale-[1.02]"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
