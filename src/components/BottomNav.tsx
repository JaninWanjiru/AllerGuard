import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ScanLine, UserCircle2, History } from "lucide-react";
import { motion } from "framer-motion";

const TABS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/scan", label: "Scan", icon: ScanLine },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
  { to: "/history", label: "History", icon: History },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 px-2 py-2 backdrop-blur lg:hidden"
      style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
    >
      <ul className="mx-auto flex max-w-md items-center justify-around">
        {TABS.map((t) => {
          const active = t.to === "/" ? path === "/" : path.startsWith(t.to);
          const Icon = t.icon;
          return (
            <li key={t.to}>
              <Link
                to={t.to}
                className="relative flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium"
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 -z-10 rounded-xl bg-gradient-brand"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon
                  className={`h-5 w-5 ${active ? "text-powder" : "text-muted-foreground"}`}
                />
                <span className={active ? "text-powder" : "text-muted-foreground"}>
                  {t.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
