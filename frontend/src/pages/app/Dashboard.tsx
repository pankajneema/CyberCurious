import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Radar,
  Bug,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Server,
  Globe,
  ArrowRight,
  Activity,
  CheckCircle2,
  XCircle,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const riskSummary = {
  score: 87,
  trend: "+3",
  trendDirection: "up" as const,
  breakdown: [
    { level: "Critical", count: 2, color: "bg-destructive" },
    { level: "High", count: 8, color: "bg-warning" },
    { level: "Medium", count: 23, color: "bg-accent" },
    { level: "Low", count: 45, color: "bg-success" },
  ],
};

const securityMetrics = [
  { label: "Total Assets", value: "342", change: "+12", trend: "up", icon: Server },
  { label: "Open Vulnerabilities", value: "78", change: "-5", trend: "down", icon: Bug },
  { label: "Exposed Services", value: "23", change: "+3", trend: "up", icon: Globe },
  { label: "Resolved Issues", value: "156", change: "+24", trend: "up", icon: CheckCircle2 },
];

const topAssets = [
  { name: "api.company.com", type: "Domain", risk: 92, issues: 3, status: "critical" },
  { name: "192.168.1.100", type: "IP", risk: 78, issues: 5, status: "high" },
  { name: "mail.company.com", type: "Domain", risk: 65, issues: 2, status: "medium" },
  { name: "staging.app.com", type: "Domain", risk: 54, issues: 4, status: "medium" },
  { name: "db-server-01", type: "Server", risk: 45, issues: 1, status: "low" },
];

const recentAlerts = [
  { title: "Critical CVE detected on api.company.com", time: "2 min ago", severity: "critical", icon: XCircle },
  { title: "New exposed port discovered", time: "15 min ago", severity: "high", icon: AlertTriangle },
  { title: "SSL certificate expiring in 7 days", time: "1 hour ago", severity: "medium", icon: Clock },
  { title: "Firewall rule update required", time: "2 hours ago", severity: "low", icon: Shield },
];

const tasks = [
  { title: "Patch CVE-2024-1234 on web server", priority: "Critical", assigned: "Security Team", progress: 60 },
  { title: "Update TLS configuration", priority: "High", assigned: "DevOps", progress: 30 },
  { title: "Review firewall rules", priority: "Medium", assigned: "Network Team", progress: 80 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Security Dashboard</h1>
          <p className="text-muted-foreground">Real-time overview of your organization's security posture</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>Live monitoring active</span>
        </div>
      </div>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${
                  metric.trend === "down" && metric.label === "Open Vulnerabilities" 
                    ? "text-success" 
                    : metric.trend === "up" && metric.label !== "Resolved Issues" && metric.label !== "Total Assets"
                    ? "text-warning"
                    : "text-success"
                }`}>
                  {metric.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {metric.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Risk Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 bg-card rounded-2xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground text-lg">Risk Score</h3>
              <p className="text-sm text-muted-foreground">Overall security health</p>
            </div>
            <span className="flex items-center gap-1 text-success text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              {riskSummary.trend} pts
            </span>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#riskGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(riskSummary.score / 100) * 352} 352`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(243, 75%, 59%)" />
                    <stop offset="100%" stopColor="hsl(186, 100%, 42%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{riskSummary.score}</span>
                <span className="text-xs text-muted-foreground">out of 100</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {riskSummary.breakdown.map((item) => (
              <div key={item.level} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm text-muted-foreground">{item.level}</span>
                <span className="text-sm font-semibold text-foreground ml-auto">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ASM & VS Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 grid sm:grid-cols-2 gap-4"
        >
          {/* ASM Card */}
          <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                <Radar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Attack Surface</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">Monitoring</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-muted/30 rounded-xl">
                <div className="text-xl font-bold text-foreground">156</div>
                <div className="text-xs text-muted-foreground">Domains</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-xl">
                <div className="text-xl font-bold text-foreground">89</div>
                <div className="text-xs text-muted-foreground">IPs</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-xl">
                <div className="text-xl font-bold text-foreground">97</div>
                <div className="text-xs text-muted-foreground">Services</div>
              </div>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link to="/app/asm">
                View Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* VS Card */}
          <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <Bug className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Vulnerability Scans</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">Active</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Last scan</span>
                <span className="text-sm font-medium text-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium text-success">Completed</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Next scan</span>
                <span className="text-sm font-medium text-foreground">In 6 hours</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link to="/app/vs">
                View Results
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Recent Alerts & Tasks */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-lg">Recent Alerts</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/app/reports">View All</Link>
            </Button>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alert, index) => {
              const Icon = alert.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    alert.severity === "critical" ? "bg-destructive/10" :
                    alert.severity === "high" ? "bg-warning/10" :
                    alert.severity === "medium" ? "bg-accent/10" : "bg-muted"
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      alert.severity === "critical" ? "text-destructive" :
                      alert.severity === "high" ? "text-warning" :
                      alert.severity === "medium" ? "text-accent" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Assets at Risk */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-lg">Top Assets at Risk</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/app/asm">View All</Link>
            </Button>
          </div>

          <div className="space-y-3">
            {topAssets.map((asset, index) => (
              <motion.div
                key={asset.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Server className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{asset.name}</p>
                  <p className="text-xs text-muted-foreground">{asset.type} • {asset.issues} issues</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        asset.status === "critical" ? "bg-destructive" :
                        asset.status === "high" ? "bg-warning" :
                        asset.status === "medium" ? "bg-accent" : "bg-success"
                      }`}
                      style={{ width: `${asset.risk}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">{asset.risk}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Remediation Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground text-lg">Remediation Queue</h3>
          </div>
          <Button variant="ghost" size="sm">View All Tasks</Button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {tasks.map((task, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  task.priority === "Critical" ? "bg-destructive/10 text-destructive" :
                  task.priority === "High" ? "bg-warning/10 text-warning" : "bg-accent/10 text-accent"
                }`}>
                  {task.priority}
                </span>
                <span className="text-xs text-muted-foreground">{task.progress}%</span>
              </div>
              <p className="text-sm font-medium text-foreground mb-2">{task.title}</p>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{task.assigned}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
