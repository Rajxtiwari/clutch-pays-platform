import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthOverlay } from "@/components/auth/AuthOverlay";
import { Toaster } from "@/components/ui/sonner";

// Pages
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import Contact from "@/pages/Contact";
import PaymentCallback from "@/pages/PaymentCallback";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

// Dashboard Components as Pages
import { Leaderboards } from "@/components/dashboard/Leaderboards";
import { MyMatches } from "@/components/dashboard/MyMatches";
import { SupportHub } from "@/components/dashboard/SupportHub";
import { CreateMatch } from "@/components/dashboard/CreateMatch";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function App() {
  return (
    <ConvexProvider client={convex}>
      <ConvexAuthProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/payment/callback" element={<PaymentCallback />} />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/leaderboards" element={<Leaderboards />} />
                <Route path="/my-matches" element={<MyMatches />} />
                <Route path="/support" element={<SupportHub />} />
                <Route path="/dashboard/create-match" element={<CreateMatch />} />
                <Route path="/dashboard/support" element={<SupportHub />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<Admin />} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Global Components */}
              <AuthOverlay />
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ConvexAuthProvider>
    </ConvexProvider>
  );
}

export default App;
