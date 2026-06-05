import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

/**
 * Wrap a personal route to require sign-in. Redirects to /signin with a
 * `from` search param so the auth page can bounce back after login.
 */
export function ProtectedRoute({ children, from }: { children: React.ReactNode; from: string }) {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.info("Please sign in to continue");
      navigate({ to: "/signin", search: { from } });
    }
  }, [user, from, navigate]);

  if (!user) {
    return (
      <div className="grid min-h-[50dvh] place-items-center px-6 text-center">
        <div className="text-sm text-muted-foreground">Redirecting to sign in…</div>
      </div>
    );
  }
  return <>{children}</>;
}
