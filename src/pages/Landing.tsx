import { motion } from "framer-motion";
import { 
  Shield, 
  Zap, 
  Users, 
  Trophy, 
  Star, 
  ArrowRight, 
  Play,
  CheckCircle,
  GamepadIcon,
  DollarSign,
  Clock,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthButton } from "@/components/auth/AuthButton";
import { useNavigate } from "react-router";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <motion.header 
        className="w-full py-4 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <img src="/assets/logo.png" alt="Clutch Pays" className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl">Clutch Pays</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => navigate('/leaderboards')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Games
            </button>
            <button 
              onClick={() => navigate('/support')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Support
            </button>
          </nav>
          
          <AuthButton 
            trigger={<Button>Get Started</Button>}
            dashboardTrigger={<Button onClick={() => navigate("/dashboard")}>Dashboard</Button>}
          />
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center space-y-6 sm:space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <GamepadIcon className="h-4 w-4 mr-2" />
              Skill-Based Gaming Platform
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
              Compete, Win, and Earn Real{" "}
              <span className="text-primary">Money</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Join thousands of players in skill-based matches. Host your own tournaments or compete in live-streamed battles with real cash prizes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <AuthButton 
                  trigger={
                    <Button size="lg" className="px-8 py-3 text-lg">
                      Start Playing Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  }
                />
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center space-y-4 mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Why Choose Clutch Pays?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of competitive gaming with our secure, transparent, and rewarding platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Shield,
                title: "Secure & Fair",
                description: "Advanced anti-cheat systems and transparent match results ensure fair play for everyone."
              },
              {
                icon: Zap,
                title: "Instant Payouts",
                description: "Win money and get paid instantly. No waiting periods or complicated withdrawal processes."
              },
              {
                icon: Users,
                title: "Active Community",
                description: "Join thousands of skilled players competing in tournaments and casual matches daily."
              },
              {
                icon: Trophy,
                title: "Skill-Based Matches",
                description: "Compete based on skill, not luck. Every match is a test of your gaming abilities."
              },
              {
                icon: DollarSign,
                title: "Real Cash Prizes",
                description: "Win real money in every match. The more skilled you are, the more you can earn."
              },
              {
                icon: Clock,
                title: "24/7 Tournaments",
                description: "Matches and tournaments running around the clock. Play whenever you want."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {[
              { number: "50K+", label: "Active Players" },
              { number: "₹2.5M+", label: "Prize Money Paid" },
              { number: "10K+", label: "Matches Daily" },
              { number: "99.9%", label: "Uptime" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center space-y-4 mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Get started in minutes and start earning from your gaming skills.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                step: "01",
                title: "Sign Up & Verify",
                description: "Create your account and verify your identity to ensure fair play and secure transactions."
              },
              {
                step: "02", 
                title: "Join Matches",
                description: "Browse available matches, choose your game, and join tournaments that match your skill level."
              },
              {
                step: "03",
                title: "Win & Earn",
                description: "Compete against other players, win matches, and earn real money instantly to your wallet."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
              >
                <div className="relative mb-6">
                  <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-foreground">{step.step}</span>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border transform translate-x-8" />
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="space-y-6 sm:space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Ready to Start Earning?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of players who are already earning real money from their gaming skills.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <AuthButton 
                  trigger={
                    <Button size="lg" className="px-8 py-3 text-lg">
                      Start Playing Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  }
                />
              </motion.div>
              <p className="text-sm text-muted-foreground">
                Free to join • No hidden fees • Instant payouts
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <img src="/assets/logo.png" alt="Clutch Pays" className="h-5 w-5" />
                </div>
                <span className="font-bold text-xl">Clutch Pays</span>
              </div>
              <p className="text-muted-foreground">
                The ultimate skill-based gaming platform where your skills pay off.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => navigate('/leaderboards')}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Leaderboards
                </button>
                <button 
                  onClick={() => navigate('/support')}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Support
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/terms')}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </button>
                <button 
                  onClick={() => navigate('/refunds')}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Refund Policy
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="space-y-2">
                <p className="text-muted-foreground">support@clutchpays.com</p>
                <p className="text-muted-foreground">+91 98765 43210</p>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Clutch Pays. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}