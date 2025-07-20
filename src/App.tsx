import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Toaster } from "@/components/ui/sonner";

// Simple Landing Page Component
function SimpleLanding() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            🎮 Clutch Pays
          </h1>
          <p className="text-xl text-muted-foreground">
            Skill-Based Gaming Platform
          </p>
          <p className="text-lg">
            Compete, Win, and Earn Real Money
          </p>
        </div>
        
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Setup Required</h2>
          <div className="text-left bg-background p-4 rounded font-mono text-sm">
            <div>npx convex login</div>
            <div>npx convex dev</div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Run these commands to initialize your Convex backend
          </p>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>✅ Website is working</p>
          <p>✅ No more blank page</p>
          <p>✅ Ready for Convex setup</p>
        </div>
      </div>
    </div>
  );
}

// Simple Settings Page
function SimpleSettings() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Settings page will be available after Convex setup</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

// Simple 404 Page
function Simple404() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<SimpleLanding />} />
          <Route path="/settings" element={<SimpleSettings />} />
          <Route path="*" element={<Simple404 />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;