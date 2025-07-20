import { UserButton } from "@/components/auth/UserButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { DepositModal } from "@/components/payments/DepositModal";
import { 
  Bell, 
  Settings, 
  Trophy, 
  Users, 
  GamepadIcon, 
  Plus,
  Sun,
  Moon,
  Home,
  DollarSign
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navigationItems = [
    { icon: Home, label: "Match Browser", path: "/dashboard", exact: true },
    { icon: Trophy, label: "Leaderboards", path: "/leaderboards" },
    { icon: GamepadIcon, label: "My Matches", path: "/my-matches" },
    { icon: Users, label: "Support Hub", path: "/support" },
  ];

  // Add Create Match for hosts
  if (user?.verificationLevel === "host") {
    navigationItems.push({
      icon: Plus,
      label: "Create a Match",
      path: "/create-match"
    });
  }

  // Add Admin Panel for admins
  if (user?.role === "admin") {
    navigationItems.push({
      icon: Settings,
      label: "Admin Panel",
      path: "/admin"
    });
  }

  const isActivePath = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <img src="/assets/logo.png" alt="Clutch Pays" className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg">Clutch Pays</span>
            </motion.div>
          </Link>

          {/* Wallet Element */}
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card border rounded-lg px-4 py-2 cursor-pointer"
            >
              <span className="text-sm font-medium">
                ₹{user?.walletBalance?.toFixed(2) || "0.00"}
              </span>
            </motion.div>
            <DepositModal 
              trigger={
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Add Money
                </Button>
              }
            />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Link to="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Navigation */}
        <aside className="sticky top-14 h-[calc(100vh-3.5rem)] w-64 border-r bg-card/50">
          <nav className="flex flex-col p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActivePath(item.path, item.exact)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {/* Theme Toggle */}
            <div className="pt-4 mt-4 border-t">
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="w-full justify-start"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="h-5 w-5 mr-3" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5 mr-3" />
                    Dark Mode
                  </>
                )}
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}