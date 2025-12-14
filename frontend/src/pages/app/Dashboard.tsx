import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Radar,
  Bug,
  AlertTriangle,
  TrendingUp,
  Clock,
  Server,
  Globe,
  ArrowRight,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const riskSummary = {
  score: 87,
  trend: "+3",
  breakdown: [
    { level: "Critical", count: 2, color: "bg-destructive" },
    { level: "High", count: 8, color: "bg-warning" },
    { level: "Medium", count: 23, color: "bg-accent" },
    { level: "Low", count: 45, color: "bg-success" },
  ],
};

const topAssets = [
  { name: "api.company.com", type: "Domain", risk: 92, issues: 3 },
  { name: "192.168.1.100", type: "IP", risk: 78, issues: 5 },
  { name: "mail.company.com", type: "Domain", risk: 65, issues: 2 },
  { name: "staging.app.com", type: "Domain", risk: 54, issues: 4 },
  { name: "db-server-01", type: "Server", risk: 45, issues: 1 },
];

const recentAlerts = [
  { title: "Critical CVE detected on api.company.com", time: "2 min ago", severity: "critical" },
  { title: "New exposed port discovered on 192.168.1.100", time: "15 min ago", severity: "high" },
  { title: "SSL certificate expiring in 7 days", time: "1 hour ago", severity: "medium" },
];

const tasks = [
  { title: "Patch CVE-2024-1234 on web server", priority: "Critical", assigned: "Security Team" },
  { title: "Update TLS configuration", priority: "High", assigned: "DevOps" },
  { title: "Review firewall rules", priority: "Medium", assigned: "Network Team" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Security Dashboard</h1>
          <p className="text-muted-foreground">Overview of your organization's security posture</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/app/asm">
              <Radar className="w-4 h-4 mr-2" />
              Run ASM Scan
            </Link>
          </Button>
          <Button variant="gradient" asChild>
            <Link to="/app/vs">
              <Bug className="w-4 h-4 mr-2" />
              Run Vuln Scan
            </Link>
          </Button>
        </div>
      </div>

      {/* Top Row - Risk Score & Quick Stats */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Risk Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Risk Score</h3>
            <span className="flex items-center gap-1 text-success text-sm">
              <TrendingUp className="w-4 h-4" />
              {riskSummary.trend}
            </span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(riskSummary.score / 100) * 226} 226`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(243, 75%, 59%)" />
                    <stop offset="100%" stopColor="hsl(186, 100%, 42%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{riskSummary.score}</span>
              </div>
            </div>
            <div className="space-y-1">
              {riskSummary.breakdown.slice(0, 2).map((item) => (
                <div key={item.level} className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-muted-foreground">{item.level}:</span>
                  <span className="font-medium text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            <Clock className="w-3 h-3 inline mr-1" />
            Last updated 2 min ago
          </p>
        </motion.div>

        {/* Quick Stats */}
        {[
          { icon: Server, label: "Total Assets", value: "342", change: "+12" },
          { icon: Bug, label: "Open Vulns", value: "78", change: "-5" },
          { icon: Globe, label: "Exposed Services", value: "23", change: "+3" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <span className={`text-sm ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ASM Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                <Radar className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Attack Surface</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">Active</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-foreground">156</div>
              <div className="text-xs text-muted-foreground">Domains</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-foreground">89</div>
              <div className="text-xs text-muted-foreground">IPs</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-foreground">97</div>
              <div className="text-xs text-muted-foreground">Services</div>
            </div>
          </div>

          <Button variant="outline" className="w-full" asChild>
            <Link to="/app/asm">
              View ASM Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* VS Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Bug className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Vulnerability Scans</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">Active</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last scan</span>
              <span className="text-sm font-medium text-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-sm font-medium text-success">Completed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Next scheduled</span>
              <span className="text-sm font-medium text-foreground">In 6 hours</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" asChild>
            <Link to="/app/vs">
              View Scan Results
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Alerts</h3>
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.severity === 'critical' ? 'bg-destructive' :
                  alert.severity === 'high' ? 'bg-warning' : 'bg-accent'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{alert.title}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Assets at Risk */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-elevated p-6"
        >
          <h3 className="font-semibold text-foreground mb-4">Top Assets at Risk</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b border-border">
                  <th className="pb-3 font-medium">Asset</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Risk</th>
                  <th className="pb-3 font-medium">Issues</th>
                </tr>
              </thead>
              <tbody>
                {topAssets.map((asset) => (
                  <tr key={asset.name} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer">
                    <td className="py-3 text-sm font-medium text-foreground">{asset.name}</td>
                    <td className="py-3 text-sm text-muted-foreground">{asset.type}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              asset.risk >= 80 ? 'bg-destructive' :
                              asset.risk >= 60 ? 'bg-warning' : 'bg-success'
                            }`}
                            style={{ width: `${asset.risk}%` }}
                          />
                        </div>
                        <span className="text-sm text-foreground">{asset.risk}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-foreground">{asset.issues}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Remediation Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Remediation Queue</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className={`w-2 h-full min-h-[40px] rounded-full ${
                  task.priority === 'Critical' ? 'bg-destructive' :
                  task.priority === 'High' ? 'bg-warning' : 'bg-accent'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      task.priority === 'Critical' ? 'bg-destructive/10 text-destructive' :
                      task.priority === 'High' ? 'bg-warning/10 text-warning' : 'bg-accent/10 text-accent'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-muted-foreground">{task.assigned}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Activity className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
