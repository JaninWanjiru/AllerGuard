import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogIn, ShieldCheck, Mail, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { useAuthStore } from "@/store/auth-store";

const search = z.object({ from: z.string().optional() });

export const Route = createFileRoute("/signin")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Sign in · AllerGuard" },
      { name: "description", content: "Sign in to AllerGuard to manage your allergen profile and scan history." },
      { property: "og:title", content: "Sign in · AllerGuard" },
      { property: "og:description", content: "Access your personal allergen profile." },
      { property: "og:url", content: "/signin" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/signin" }],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const { from } = Route.useSearch();
  const user = useAuthStore((s) => s.user);
  const signIn = useAuthStore((s) => s.signIn);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      navigate({ to: (from as "/profile") || "/profile" });
    }
  }, [user, from, navigate]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    const u = signIn(email, name);
    toast.success(`Welcome, ${u.name}`);
    navigate({ to: (from as "/profile") || "/profile" });
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-gradient-aurora px-4 pt-10 lg:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md overflow-hidden rounded-3xl border border-border/70 bg-card/95 p-1 shadow-soft backdrop-blur"
      >
        <div className="rounded-[calc(theme(borderRadius.3xl)-4px)] bg-card p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-brand text-powder shadow-steel">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Sign in to AllerGuard</h1>
              <p className="text-xs text-muted-foreground">
                Manage your profile and keep your scan history.
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={submit}>
            <Field
              label="Email"
              icon={<Mail className="h-4 w-4" />}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <Field
              label="Display name (optional)"
              icon={<UserIcon className="h-4 w-4" />}
              type="text"
              value={name}
              onChange={setName}
              placeholder="What should we call you?"
              autoComplete="given-name"
            />

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand py-3 text-sm font-semibold text-powder shadow-steel transition-transform hover:scale-[1.01]"
            >
              <LogIn className="h-4 w-4" /> Continue
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            No password needed for this demo · session lives only in your browser.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  ...rest
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          {...rest}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-full border border-border bg-background pl-10 pr-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </span>
    </label>
  );
}
