import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { BrowserRouter, Routes, Route } from "react-router";
import { ConvexReactClient } from "convex/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthOverlay } from "@/components/auth/AuthOverlay";
import { Toaster } from "@/components/ui/sonner";

// Pages
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import Contact from "@/pages/Contact";
import PaymentCallback from "@/pages/PaymentCallback";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";

// Dashboard Components as Pages
import { CreateMatch } from "@/components/dashboard/CreateMatch";
import { Leaderboards } from "@/components/dashboard/Leaderboards";
import { MyMatches } from "@/components/dashboard/MyMatches";
import { SupportHub } from "@/components/dashboard/SupportHub";

import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ConvexAuthProvider client={convex}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/create-match" element={<CreateMatch />} />
              <Route path="/leaderboards" element={<Leaderboards />} />
              <Route path="/my-matches" element={<MyMatches />} />
              <Route path="/dashboard/support" element={<SupportHub />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/payment/callback" element={<PaymentCallback />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AuthOverlay />
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </ConvexAuthProvider>
    </ConvexProvider>
  </StrictMode>
);