import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "@/components/VlyToolbar";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import Auth from "@/pages/Auth.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";
import Dashboard from "./pages/Dashboard.tsx";
import Landing from "./pages/Landing.tsx";
import NotFound from "./pages/NotFound.tsx";
import Admin from "./pages/Admin.tsx";
import Contact from "./pages/Contact.tsx";
import TermsAndConditions from "./pages/TermsAndConditions.tsx";
import RefundsAndCancellations from "./pages/RefundsAndCancellations.tsx";
import { DashboardLayout } from "./components/layout/DashboardLayout.tsx";
import { CreateMatch } from "./components/dashboard/CreateMatch.tsx";
import { Leaderboards } from "./components/dashboard/Leaderboards.tsx";
import { MyMatches } from "./components/dashboard/MyMatches.tsx";
import { SupportHub } from "./components/dashboard/SupportHub.tsx";
import { Protected } from "./lib/protected-page.tsx";
import PaymentCallback from "./pages/PaymentCallback.tsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VlyToolbar />
    <InstrumentationProvider>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/refunds" element={<RefundsAndCancellations />} />
            <Route path="/payment/callback" element={<PaymentCallback />} />
            
            {/* Main Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Clean Routes - No /dashboard prefix */}
            <Route path="/leaderboards" element={
              <Protected>
                <DashboardLayout>
                  <Leaderboards />
                </DashboardLayout>
              </Protected>
            } />
            <Route path="/my-matches" element={
              <Protected>
                <DashboardLayout>
                  <MyMatches />
                </DashboardLayout>
              </Protected>
            } />
            <Route path="/create-match" element={
              <Protected>
                <DashboardLayout>
                  <CreateMatch />
                </DashboardLayout>
              </Protected>
            } />
            <Route path="/support" element={
              <Protected>
                <DashboardLayout>
                  <SupportHub />
                </DashboardLayout>
              </Protected>
            } />
            
            {/* Admin */}
            <Route path="/admin" element={<Admin />} />
            
            {/* 404 - Keep at end */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </InstrumentationProvider>
  </StrictMode>,
);