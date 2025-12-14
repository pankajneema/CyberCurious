import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bug,
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

// Mock data
const scans = [
  {
    id: 1,
    name: "Production API Scan",
    target: "api.company.com",
    status: "completed",
    lastRun: "2 hours ago",
    duration: "45 min",
    findings: { critical: 2, high: 5, medium: 12, low: 8 },
  },
  {
    id: 2,
    name: "Weekly External Scan",
    target: "*.company.com",
    status: "running",
    lastRun: "In progress",
    duration: "23 min",
    findings: { critical: 0, high: 2, medium: 4, low: 3 },
  },
  {
    id: 3,
    name: "Staging Environment",
    target: "staging.app.com",
    status: "completed",
    lastRun: "1 day ago",
    duration: "32 min",
    findings: { critical: 0, high: 3, medium: 8, low: 15 },
  },
  {
    id: 4,
    name: "Database Servers",
    target: "10.0.0.0/24",
    status: "scheduled",
    lastRun: "Scheduled for 6 hours",
    duration: "—",
    findings: { critical: 0, high: 0, medium: 0, low: 0 },
  },
];

const vulnerabilities = [
  {
    id: 1,
    cve: "CVE-2024-1234",
    title: "Remote Code Execution in Apache",
    severity: "critical",
    asset: "api.company.com",
    exploitability: 9.8,
    status: "open",
  },
  {
    id: 2,
    cve: "CVE-2024-5678",
    title: "SQL Injection in Login Form",
    severity: "critical",
    asset: "app.company.com",
    exploitability: 9.1,
    status: "open",
  },
  {
    id: 3,
    cve: "CVE-2024-9012",
    title: "XSS Vulnerability in Search",
    severity: "high",
    asset: "staging.app.com",
    exploitability: 7.5,
    status: "in_progress",
  },
  {
    id: 4,
    cve: "CVE-2024-3456",
    title: "Outdated SSL/TLS Configuration",
    severity: "medium",
    asset: "mail.company.com",
    exploitability: 5.3,
    status: "open",
  },
  {
    id: 5,
    cve: "CVE-2024-7890",
    title: "Information Disclosure via Headers",
    severity: "low",
    asset: "cdn.company.com",
    exploitability: 3.1,
    status: "resolved",
  },
];

export default function VS() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "running":
        return <RefreshCw className="w-4 h-4 text-primary animate-spin" />;
      case "scheduled":
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Pause className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-warning text-warning-foreground";
      case "medium":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-success text-success-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return "bg-destructive/10 text-destructive";
      case "in_progress":
        return "bg-warning/10 text-warning";
      case "resolved":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <Bug className="w-6 h-6 text-accent" />
            Vulnerability Scanning
          </h1>
          <p className="text-muted-foreground">Detect and prioritize security vulnerabilities</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="w-4 h-4" />
              New Scan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Vulnerability Scan</DialogTitle>
              <DialogDescription>
                Configure a new vulnerability scan for your assets
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Scan Name</Label>
                <Input placeholder="e.g., Production API Scan" />
              </div>
              <div className="space-y-2">
                <Label>Target</Label>
                <Input placeholder="e.g., api.company.com or 192.168.1.0/24" />
              </div>
              <div className="space-y-2">
                <Label>Scan Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="external">External Scan</SelectItem>
                    <SelectItem value="full">Full Scan</SelectItem>
                    <SelectItem value="quick">Quick Scan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Schedule</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Run Now</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="gradient" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Scan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Scans", value: "24", color: "text-primary" },
          { label: "Critical Vulns", value: "2", color: "text-destructive" },
          { label: "High Vulns", value: "10", color: "text-warning" },
          { label: "Resolved", value: "156", color: "text-success" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-elevated p-5"
          >
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Scans List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-elevated p-6"
      >
        <h3 className="font-semibold text-foreground mb-4">Recent Scans</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b border-border">
                <th className="pb-3 font-medium">Scan</th>
                <th className="pb-3 font-medium">Target</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Duration</th>
                <th className="pb-3 font-medium">Findings</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr
                  key={scan.id}
                  className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <td className="py-4">
                    <div className="font-medium text-foreground">{scan.name}</div>
                    <div className="text-xs text-muted-foreground">{scan.lastRun}</div>
                  </td>
                  <td className="py-4 text-sm text-muted-foreground font-mono">{scan.target}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(scan.status)}
                      <span className="text-sm capitalize text-foreground">{scan.status}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-muted-foreground">{scan.duration}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {scan.findings.critical > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">
                          {scan.findings.critical}C
                        </span>
                      )}
                      {scan.findings.high > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-warning/10 text-warning">
                          {scan.findings.high}H
                        </span>
                      )}
                      {scan.findings.medium > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                          {scan.findings.medium}M
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Results</DropdownMenuItem>
                        <DropdownMenuItem>Run Again</DropdownMenuItem>
                        <DropdownMenuItem>Edit Schedule</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Vulnerabilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-elevated p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Recent Vulnerabilities</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search CVE..."
                className="pl-10 w-48"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b border-border">
                <th className="pb-3 font-medium">CVE</th>
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Severity</th>
                <th className="pb-3 font-medium">Asset</th>
                <th className="pb-3 font-medium">Score</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {vulnerabilities.map((vuln) => (
                <tr
                  key={vuln.id}
                  className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-primary">{vuln.cve}</code>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </td>
                  <td className="py-4 text-sm text-foreground max-w-xs truncate">{vuln.title}</td>
                  <td className="py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getSeverityColor(vuln.severity)}`}>
                      {vuln.severity}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-muted-foreground font-mono">{vuln.asset}</td>
                  <td className="py-4">
                    <span className="text-sm font-medium text-foreground">{vuln.exploitability}</span>
                  </td>
                  <td className="py-4">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusBadge(vuln.status)}`}>
                      {vuln.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                        <DropdownMenuItem>Create Jira Ticket</DropdownMenuItem>
                        <DropdownMenuItem>Re-test</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
