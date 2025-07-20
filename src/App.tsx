import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthOverlay } from "@/components/auth/AuthOverlay";
import { Toaster } from "@/components/ui/sonner";

// Pages
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import Settings from "@/pages/Settings";
import Contact from "@/pages/Contact";
import PaymentCallback from "@/pages/PaymentCallback";
import NotFound from "@/pages/NotFound";

// Admin and other pages
import Admin from "@/pages/Admin";
import CreateMatch from "@/components/dashboard/CreateMatch";
import Leaderboards from "@/components/dashboard/Leaderboards";
import MyMatches from "@/components/dashboard/MyMatches";
import SupportHub from "@/components/dashboard/SupportHub";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

// Development fallback when Convex is not configured
function DevSetupScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Clutch Pays Setup Required</h1>
          <p className="text-muted-foreground">
            To get started, please run the following commands:
          </p>
        </div>
        
        <div className="bg-muted p-4 rounded-lg text-left">
          <code className="text-sm">
            npx convex login<br/>
            npx convex dev
          </code>
        </div>
        
        <p className="text-sm text-muted-foreground">
          This will set up your Convex backend and provide the VITE_CONVEX_URL
        </p>
      </div>
    </div>
  );
}

// Production app with Convex
function MainApp() {
  const convex = new ConvexReactClient(convexUrl!);

  return (
    <ConvexAuthProvider client={convex}>
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
              <Route path="/dashboard/create-match" element={<CreateMatch />} />
              <Route path="/leaderboards" element={<Leaderboards />} />
              <Route path="/my-matches" element={<MyMatches />} />
              <Route path="/dashboard/support" element={<SupportHub />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<Admin />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <AuthOverlay />
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ConvexAuthProvider>
  );
}

// Main App component that chooses between setup screen and main app
function App() {
  if (!convexUrl) {
    return <DevSetupScreen />;
  }
  
  return <MainApp />;
}

export default App;