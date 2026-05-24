import React from "react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { useAuth } from "../lib/auth-context";
import { useNavigate } from "@tanstack/react-router";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return <div>404 - Not Found</div>;
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Error</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, token } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !token) {
      navigate({ to: "/login" });
    }
  }, [isLoading, token, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}

function RootComponent() {
  return (
    <>
      <AuthGuard>
        <Outlet />
      </AuthGuard>
      <Toaster position="top-right" richColors />
    </>
  );
}
