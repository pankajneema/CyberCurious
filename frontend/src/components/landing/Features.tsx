import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Radar, 
  Bug, 
  Swords, 
  Brain, 
  ShieldAlert, 
  FileCheck,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Radar,
    title: "Attack Surface Management",
    description: "Continuously discover all your external & cloud assets and prioritize exposures.",
    status: "available",
    href: "/app/asm",
    color: "primary",
  },
  {
    icon: Bug,
    title: "Vulnerability Scanning",
    description: "High-fidelity vulnerability scanning with contextual prioritization and remediation guidance.",
    status: "available",
    href: "/app/vs",
    color: "accent",
  },
  {
    icon: Swords,
    title: "Breach & Attack Simulation",
    description: "Automated adversary emulation to test your defenses against real-world attack techniques.",
    status: "coming-soon",
    color: "secondary",
  },
  {
    icon: Brain,
    title: "Threat Intelligence",
    description: "Aggregated threat feeds with predictive analytics and contextual enrichment.",
    status: "coming-soon",
    color: "warning",
  },
  {
    icon: ShieldAlert,
    title: "Incident Response",
    description: "Orchestrated response workflows with automated playbooks and case management.",
    status: "coming-soon",
    color: "destructive",
  },
  {
    icon: FileCheck,
    title: "Compliance & Audit",
    description: "Continuous compliance monitoring for SOC2, GDPR, HIPAA, and more frameworks.",
    status: "coming-soon",
    color: "success",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            Complete Security{" "}
            <span className="gradient-text">Orchestration</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A unified platform bringing together attack surface management, vulnerability scanning, 
            and security operations into one intelligent cockpit.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            const isAvailable = feature.status === "available";
            
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className={`group relative card-elevated p-6 ${
                  isAvailable ? "hover:border-primary/50" : ""
                }`}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {isAvailable ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                  isAvailable ? "gradient-bg" : "bg-muted"
                }`}>
                  <Icon className={`w-6 h-6 ${isAvailable ? "text-primary-foreground" : "text-muted-foreground"}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {feature.description}
                </p>

                {/* CTA */}
                {isAvailable ? (
                  <Button variant="ghost" size="sm" className="group/btn" asChild>
                    <Link to={feature.href!}>
                      Try Now
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" disabled>
                    Request Early Access
                  </Button>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
