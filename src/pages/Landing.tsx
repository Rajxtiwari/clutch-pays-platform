import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GamepadIcon, 
  Trophy, 
  Users, 
  Shield, 
  Zap, 
  Star,
  ArrowRight,
  Play
} from "lucide-react";
import { Link } from "react-router";
import { AuthButton } from "@/components/auth/AuthButton";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <GamepadIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">GameArena</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost">How It Works</Button>
            <Button variant="ghost">Games</Button>
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge variant="secondary" className="mb-4">
            🎮 Skill-Based Gaming Platform
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Compete, Win, and
            <span className="text-primary"> Earn Real Money</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of players in skill-based matches. Host your own tournaments 
            or compete in live-streamed battles with real cash prizes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthButton 
              trigger={
                <Button size="lg" className="text-lg px-8">
                  Start Playing Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              }
              dashboardTrigger={
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              }
            />
            <Button variant="outline" size="lg" className="text-lg px-8">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose GameArena?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of competitive gaming with our secure, 
            transparent, and rewarding platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="h-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure & Fair</h3>
                <p className="text-muted-foreground">
                  Advanced verification system and live-streamed matches ensure 
                  complete transparency and fair play.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="h-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Payouts</h3>
                <p className="text-muted-foreground">
                  Win matches and get paid instantly. Our automated system 
                  processes payouts within minutes of match completion.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Card className="h-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Active Community</h3>
                <p className="text-muted-foreground">
                  Join thousands of active players and hosts. Compete in 
                  tournaments and climb the leaderboards.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-20 bg-primary/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Winning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join GameArena today and turn your gaming skills into real earnings.
          </p>
          
          <AuthButton 
            trigger={
              <Button size="lg" className="text-lg px-8">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            }
            dashboardTrigger={
              <Button size="lg" className="text-lg px-8" asChild>
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            }
          />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
                  <GamepadIcon className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold">GameArena</span>
              </div>
              <p className="text-sm text-muted-foreground">
                India's premier skill-based gaming platform. Compete, win, and earn real money through fair and transparent gameplay.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link to="/dashboard" className="block text-muted-foreground hover:text-foreground">Dashboard</Link>
                <Link to="/leaderboards" className="block text-muted-foreground hover:text-foreground">Leaderboards</Link>
                <Link to="/support" className="block text-muted-foreground hover:text-foreground">Support</Link>
                <Link to="/contact" className="block text-muted-foreground hover:text-foreground">Contact Us</Link>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold">Legal & Policies</h4>
              <div className="space-y-2 text-sm">
                <Link to="/terms" className="block text-muted-foreground hover:text-foreground">Terms & Conditions</Link>
                <Link to="/refunds" className="block text-muted-foreground hover:text-foreground">Refunds & Cancellations</Link>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Privacy Policy</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Fair Play Policy</a>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="font-semibold">Our Services</h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">• Skill-based Gaming Matches</p>
                <p className="text-muted-foreground">• Tournament Hosting</p>
                <p className="text-muted-foreground">• Live Streaming Platform</p>
                <p className="text-muted-foreground">• Secure Payment Processing</p>
                <p className="text-muted-foreground">• 24/7 Customer Support</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-sm text-muted-foreground mb-4 md:mb-0">
                © 2024 GameArena Technologies Pvt. Ltd. All rights reserved. Play responsibly.
              </div>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <span>🔒 Secure Payments</span>
                <span>✓ Fair Play Certified</span>
                <span>📞 24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}