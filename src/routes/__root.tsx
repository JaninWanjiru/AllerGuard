import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";

import { reportLovableError } from "../lib/lovable-error-reporting";
import { FloatingNav } from "@/components/FloatingNav";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActivity } from "@/components/FloatingActivity";
import { Footer } from "@/components/Footer";
import { useAppStore } from "@/store/app-store";

function NotFoundComponent() {
  return (
    <div className="grid min-h-dvh place-items-center bg-gradient-aurora px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-semibold tracking-tight">404</h1>
        <h2 className="mt-3 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That label doesn't exist in our pantry.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-powder shadow-steel"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="grid min-h-dvh place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-powder shadow-steel"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const theme = useAppStore((s) => s.theme);

  // Keep <html> class in sync with persisted theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-dvh bg-background text-foreground transition-colors">
        <FloatingNav />
        <TopBar />
        <main className="pb-24 lg:pb-0">
          <Outlet />
        </main>
        <Footer />
        <BottomNav />
        <FloatingActivity />
        <Toaster
          position="top-center"
          richColors
          closeButton
          theme="system"
          toastOptions={{ style: { fontFamily: "inherit" } }}
        />
      </div>
    </QueryClientProvider>
  );
}
