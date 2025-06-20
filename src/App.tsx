import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DatabaseProvider } from "@/contexts/DatabaseContext";
import { LockScreenProvider } from "@/contexts/LockScreenContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const App = () => {
  // Create QueryClient inside component to prevent stale references during HMR
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
          },
        },
      }),
  );

  return (
    <ErrorBoundary>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <DatabaseProvider>
              <LockScreenProvider>
                <AppProvider>
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/emulator" element={<Index />} />
                      <Route path="/admin" element={<Admin />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </AppProvider>
              </LockScreenProvider>
            </DatabaseProvider>
          </ErrorBoundary>
        </QueryClientProvider>
      </ErrorBoundary>
    </ErrorBoundary>
  );
};

export default App;
