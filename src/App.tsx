import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import { initializeSupabase } from "@/integrations/supabase/init";

const queryClient = new QueryClient();

const App = () => {
  // Initialize Supabase on application startup
  useEffect(() => {
    initializeSupabase()
      .then((success) => {
        if (success) {
          console.log("Supabase initialized successfully");
        }
      })
      .catch((error) => {
        console.error("Failed to initialize Supabase:", error);
      });
  }, []);

  const isAuthRoute = (pathname: string) => {
    return pathname === "/login" || pathname === "/signup";
  };

  const isDashboardRoute = (pathname: string) => {
    return pathname.startsWith("/dashboard");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    <Home />
                    <Footer />
                  </>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
