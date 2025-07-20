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
import Settings from "@/pages/Settings";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

// Dashboard Components as Pages
import { Leaderboards } from "@/components/dashboard/Leaderboards";
import { MyMatches } from "@/components/dashboard/MyMatches";
import { SupportHub } from "@/components/dashboard/SupportHub";
import { CreateMatch } from "@/components/dashboard/CreateMatch";

// Check if Convex URL is available
const convexUrl = import.meta.env.VITE_CONVEX_URL;

function App() {
  // If no Convex URL, show setup message
  if (!convexUrl) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-2xl font-bold">Clutch Pays Setup Required</h1>
          <p className="text-muted-foreground max-w-md">
            To get started, please run the following commands:
          </p>
          <div className="bg-muted p-4 rounded-lg text-left font-mono text-sm">
            <div>npx convex login</div>
            <div>npx convex dev</div>
          </div>
          <p className="text-sm text-muted-foreground">
            This will set up your Convex backend and provide the VITE_CONVEX_URL
          </p>
        </div>
      </div>
    );
  }

  const convex = new ConvexReactClient(convexUrl);

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
                
                {/* Settings Route */}
                <Route path="/settings" element={<Settings />} />
                
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