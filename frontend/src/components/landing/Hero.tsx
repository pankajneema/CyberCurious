import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Shield, Radar, Bug } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30">
          <div className="absolute inset-0 rounded-full border border-primary/10 animate-pulse-slow" />
          <div className="absolute inset-10 rounded-full border border-accent/10 animate-pulse-slow" style={{ animationDelay: "0.5s" }} />
          <div className="absolute inset-20 rounded-full border border-secondary/10 animate-pulse-slow" style={{ animationDelay: "1s" }} />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-primary">ASM & Vulnerability Scanning Now Live</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-6">
              Unified Cyber Risk{" "}
              <span className="gradient-text">Orchestration</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              CyberSentinel combines ASM, automated vulnerability scanning, adversary emulation, and compliance automation into a single cockpit.{" "}
              <span className="font-semibold text-foreground">Predict. Test. Remediate.</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup" className="group">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline-gradient" size="xl" asChild>
                <Link to="/contact">
                  <Play className="w-5 h-5" />
                  Request Demo
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10 pt-8 border-t border-border/50"
            >
              <p className="text-sm text-muted-foreground mb-4">Trusted by security teams worldwide</p>
              <div className="flex items-center gap-6 justify-center lg:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">500+</div>
                  <div className="text-xs text-muted-foreground">Vulnerabilities Found</div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">120+</div>
                  <div className="text-xs text-muted-foreground">Organizations</div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">99.9%</div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative z-10 card-elevated p-6 lg:p-8">
              {/* Mock Dashboard */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Security Score</div>
                    <div className="text-sm text-muted-foreground">Last updated: 2 min ago</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-success">87</div>
                  <div className="text-xs text-muted-foreground">/100</div>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-4 mb-6">
                {[
                  { label: "Critical", value: 2, color: "bg-destructive" },
                  { label: "High", value: 8, color: "bg-warning" },
                  { label: "Medium", value: 23, color: "bg-accent" },
                  { label: "Low", value: 45, color: "bg-success" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-16 text-sm text-muted-foreground">{item.label}</div>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(item.value * 2, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                    <div className="w-8 text-sm font-medium text-foreground">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
                  <Radar className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-foreground">Run ASM Scan</div>
                  <div className="text-xs text-muted-foreground">Discover assets</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50 hover:border-accent/50 transition-colors cursor-pointer group">
                  <Bug className="w-5 h-5 text-accent mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-foreground">Vuln Scan</div>
                  <div className="text-xs text-muted-foreground">Check for CVEs</div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 gradient-bg rounded-2xl opacity-20 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-2xl blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
