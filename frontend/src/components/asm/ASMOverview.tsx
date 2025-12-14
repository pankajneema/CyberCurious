import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RiskGauge } from "./RiskGauge";
import { StatCard } from "./StatCard";
import { SeverityBadge } from "./SeverityBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Server,
  Globe,
  AlertTriangle,
  Cloud,
  TrendingDown,
  TrendingUp,
  Play,
  Plus,
  Users,
  Lock,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Shield,
  Target,
  Activity,
  Zap,
  ChevronRight,
  Network,
  Database,
  Radar,
  Eye,
  CheckCircle2,
  Circle,
  Layers,
  ScanLine,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const trendData = [
  { month: "Jan", score: 72 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 75 },
  { month: "Apr", score: 71 },
  { month: "May", score: 65 },
  { month: "Jun", score: 62 },
];

const topRisks = [
  { id: 1, title: "Exposed MongoDB Instance", asset: "db-prod.company.com", severity: "critical" as const, score: 95 },
  { id: 2, title: "Outdated SSL Certificate", asset: "api.company.com", severity: "high" as const, score: 78 },
  { id: 3, title: "Open SSH Port", asset: "192.168.1.100", severity: "high" as const, score: 72 },
  { id: 4, title: "Missing WAF Configuration", asset: "app.company.com", severity: "medium" as const, score: 58 },
  { id: 5, title: "Permissive CORS Policy", asset: "cdn.company.com", severity: "medium" as const, score: 45 },
];

const quickStats = [
  { label: "Last Scan", value: "2h ago", icon: Clock, status: "success" },
  { label: "Assets Monitored", value: "1,247", icon: Layers, status: "neutral" },
  { label: "Active Threats", value: "23", icon: AlertTriangle, status: "danger" },
  { label: "Coverage", value: "94%", icon: Shield, status: "success" },
];

const recentActivity = [
  { id: 1, action: "New vulnerability detected", asset: "api.company.com", time: "5 min ago", type: "alert" },
  { id: 2, action: "Scan completed", asset: "Full external scan", time: "2 hours ago", type: "success" },
  { id: 3, action: "Asset discovered", asset: "staging.company.com", time: "4 hours ago", type: "info" },
  { id: 4, action: "Issue remediated", asset: "db-backup.company.com", time: "1 day ago", type: "success" },
];

import { Clock } from "lucide-react";

// Scan target types for new scan dialog
const scanTargetTypes = [
  { 
    id: "domains", 
    label: "Domains", 
    icon: Globe, 
    description: "Scan domains and subdomains",
    color: "primary",
    examples: "example.com, *.example.com"
  },
  { 
    id: "ips", 
    label: "IP Addresses", 
    icon: Server, 
    description: "Scan IP ranges and hosts",
    color: "secondary",
    examples: "192.168.1.0/24, 10.0.0.1"
  },
  { 
    id: "cloud", 
    label: "Cloud Resources", 
    icon: Cloud, 
    description: "AWS, Azure, GCP assets",
    color: "accent",
    examples: "AWS accounts, Azure subscriptions"
  },
  { 
    id: "webapp", 
    label: "Web Applications", 
    icon: Network, 
    description: "Deep web app scanning",
    color: "warning",
    examples: "https://app.example.com"
  },
];

const scanProfiles = [
  { id: "quick", label: "Quick Scan", duration: "~5 min", description: "Fast discovery scan", icon: Zap },
  { id: "standard", label: "Standard Scan", duration: "~30 min", description: "Balanced depth & speed", icon: Radar },
  { id: "deep", label: "Deep Scan", duration: "~2 hours", description: "Comprehensive analysis", icon: ScanLine },
];

export function ASMOverview() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState("");
  
  // New scan state
  const [scanStep, setScanStep] = useState(1);
  const [selectedTargetTypes, setSelectedTargetTypes] = useState<string[]>([]);
  const [scanTargets, setScanTargets] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("standard");
  const [scanName, setScanName] = useState("");

  const handleAddAsset = () => {
    if (!assetName || !assetType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Asset Added Successfully",
      description: `${assetName} has been added to your inventory`,
    });
    setIsAddAssetOpen(false);
    setAssetName("");
    setAssetType("");
  };

  const handleStartScan = () => {
    setIsScanDialogOpen(true);
    setScanStep(1);
    setSelectedTargetTypes([]);
    setScanTargets("");
    setSelectedProfile("standard");
    setScanName("");
  };

  const handleCreateScan = () => {
    if (selectedTargetTypes.length === 0 || !scanTargets) {
      toast({
        title: "Missing Information",
        description: "Please select target types and enter targets",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Scan Initiated",
      description: `${scanName || 'New Scan'} is now running on ${selectedTargetTypes.length} target type(s)`,
    });
    setIsScanDialogOpen(false);
  };

  const toggleTargetType = (typeId: string) => {
    setSelectedTargetTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "alert": return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "success": return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "info": return <Eye className="w-4 h-4 text-primary" />;
      default: return <Circle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Premium Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/40 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="relative z-10 p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-white/90">Attack Surface Management</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl lg:text-4xl font-bold text-white"
              >
                Security Overview
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/70 max-w-lg text-lg"
              >
                Real-time visibility into your organization's external exposure
              </motion.p>

              {/* Quick Stats Pills */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                {quickStats.map((stat, index) => (
                  <div 
                    key={stat.label}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm border",
                      stat.status === "success" && "bg-success/20 border-success/30",
                      stat.status === "danger" && "bg-destructive/20 border-destructive/30",
                      stat.status === "neutral" && "bg-white/10 border-white/20"
                    )}
                  >
                    <stat.icon className={cn(
                      "w-4 h-4",
                      stat.status === "success" && "text-success",
                      stat.status === "danger" && "text-destructive",
                      stat.status === "neutral" && "text-white/70"
                    )} />
                    <span className="text-sm font-semibold text-white">{stat.value}</span>
                    <span className="text-xs text-white/60">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button 
                size="lg" 
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
                onClick={() => setIsAddAssetOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Asset
              </Button>
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-lg shadow-black/20"
                onClick={handleStartScan}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Scan
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Dashboard Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column - Risk Score & Trend */}
        <div className="lg:col-span-4 space-y-6">
          {/* Risk Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-medium text-muted-foreground">Attack Surface Score</h3>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                <TrendingDown className="w-3 h-3" />
                -8%
              </div>
            </div>
            
            <div className="flex justify-center">
              <RiskGauge score={62} size="lg" />
            </div>
            
            <div className="mt-6 pt-4 border-t border-border">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-destructive">23</div>
                  <div className="text-xs text-muted-foreground">Critical</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-warning">47</div>
                  <div className="text-xs text-muted-foreground">High</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">156</div>
                  <div className="text-xs text-muted-foreground">Resolved</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border border-border p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-foreground">Score Trend</h3>
                <p className="text-sm text-muted-foreground">Last 6 months</p>
              </div>
              <Activity className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="h-32 flex items-end gap-2">
              {trendData.map((item, index) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${item.score}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className={cn(
                      "w-full rounded-lg transition-colors cursor-pointer hover:opacity-80",
                      item.score >= 70 ? "bg-gradient-to-t from-destructive to-destructive/60" : 
                      item.score >= 50 ? "bg-gradient-to-t from-warning to-warning/60" : 
                      "bg-gradient-to-t from-success to-success/60"
                    )}
                  />
                  <span className="text-[10px] text-muted-foreground font-medium">{item.month}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Middle Column - Stats & Risks */}
        <div className="lg:col-span-5 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Total Assets"
              value="1,247"
              icon={Server}
              trend={{ value: 12, label: "+43 this week" }}
            />
            <StatCard
              label="Exposed Services"
              value="328"
              icon={Globe}
              trend={{ value: -5, label: "-18 resolved" }}
              variant="warning"
            />
            <StatCard
              label="Critical Findings"
              value="23"
              icon={AlertTriangle}
              trend={{ value: 8, label: "+2 new" }}
              variant="critical"
            />
            <StatCard
              label="Cloud Issues"
              value="47"
              icon={Cloud}
              trend={{ value: -12, label: "-6 fixed" }}
            />
          </div>

          {/* Top Risks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-destructive/10">
                  <Target className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="font-semibold text-foreground">Top Risks</h3>
              </div>
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="divide-y divide-border">
              {topRisks.slice(0, 4).map((risk, index) => (
                <motion.div
                  key={risk.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
                    risk.severity === "critical" && "bg-destructive/10 text-destructive",
                    risk.severity === "high" && "bg-warning/10 text-warning",
                    risk.severity === "medium" && "bg-accent/10 text-accent"
                  )}>
                    {risk.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {risk.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate font-mono">{risk.asset}</div>
                  </div>
                  <SeverityBadge severity={risk.severity} showDot={false} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Activity & Categories */}
        <div className="lg:col-span-3 space-y-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl border border-border p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-primary/10">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex gap-3"
                >
                  <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground">{activity.action}</div>
                    <div className="text-xs text-muted-foreground truncate">{activity.asset}</div>
                  </div>
                  <div className="text-[10px] text-muted-foreground whitespace-nowrap">{activity.time}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-2xl border border-border p-5 shadow-sm"
          >
            <h3 className="font-semibold text-foreground mb-4">Asset Categories</h3>
            <div className="space-y-3">
              {[
                { label: "Domains", count: 156, icon: Globe, color: "text-primary", bg: "bg-primary/10" },
                { label: "IPs", count: 847, icon: Server, color: "text-secondary", bg: "bg-secondary/10" },
                { label: "Cloud", count: 198, icon: Cloud, color: "text-accent", bg: "bg-accent/10" },
                { label: "Users", count: 46, icon: Users, color: "text-warning", bg: "bg-warning/10" },
              ].map((category, index) => (
                <motion.div
                  key={category.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <div className={cn("p-2 rounded-lg", category.bg)}>
                    <category.icon className={cn("w-4 h-4", category.color)} />
                  </div>
                  <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {category.label}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">{category.count}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* New Scan Dialog - Premium Multi-Step */}
      <Dialog open={isScanDialogOpen} onOpenChange={setIsScanDialogOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Radar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">Create New Scan</DialogTitle>
                <DialogDescription>Configure and launch a security scan</DialogDescription>
              </div>
            </div>
            
            {/* Step Indicator */}
            <div className="flex items-center gap-2 mt-6">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex-1 flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                    scanStep >= step 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={cn(
                      "flex-1 h-1 rounded-full transition-all",
                      scanStep > step ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Select Targets</span>
              <span>Enter Details</span>
              <span>Confirm</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 min-h-[350px]">
            <AnimatePresence mode="wait">
              {/* Step 1: Select Target Types */}
              {scanStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">What do you want to scan?</h4>
                    <p className="text-sm text-muted-foreground">Select one or more target types</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {scanTargetTypes.map((type) => {
                      const isSelected = selectedTargetTypes.includes(type.id);
                      return (
                        <motion.div
                          key={type.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleTargetType(type.id)}
                          className={cn(
                            "relative p-5 rounded-2xl border-2 cursor-pointer transition-all",
                            isSelected 
                              ? "border-primary bg-primary/5 shadow-md" 
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                          )}
                        >
                          <div className={cn(
                            "absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all",
                            isSelected ? "bg-primary" : "border-2 border-muted-foreground/30"
                          )}>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                          </div>
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                            type.color === "primary" && "bg-primary/10",
                            type.color === "secondary" && "bg-secondary/10",
                            type.color === "accent" && "bg-accent/10",
                            type.color === "warning" && "bg-warning/10"
                          )}>
                            <type.icon className={cn(
                              "w-6 h-6",
                              type.color === "primary" && "text-primary",
                              type.color === "secondary" && "text-secondary",
                              type.color === "accent" && "text-accent",
                              type.color === "warning" && "text-warning"
                            )} />
                          </div>
                          <h5 className="font-semibold text-foreground">{type.label}</h5>
                          <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Enter Targets & Profile */}
              {scanStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Scan Name (Optional)</Label>
                      <Input
                        placeholder="e.g., Weekly External Scan"
                        value={scanName}
                        onChange={(e) => setScanName(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Targets</Label>
                      <Textarea
                        placeholder={`Enter targets (one per line)\n\nExamples:\n${selectedTargetTypes.map(t => scanTargetTypes.find(st => st.id === t)?.examples).join('\n')}`}
                        value={scanTargets}
                        onChange={(e) => setScanTargets(e.target.value)}
                        className="min-h-[120px] resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        Scanning: {selectedTargetTypes.map(t => scanTargetTypes.find(st => st.id === t)?.label).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Scan Profile</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {scanProfiles.map((profile) => (
                        <motion.div
                          key={profile.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedProfile(profile.id)}
                          className={cn(
                            "p-4 rounded-xl border-2 cursor-pointer transition-all text-center",
                            selectedProfile === profile.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <profile.icon className={cn(
                            "w-6 h-6 mx-auto mb-2",
                            selectedProfile === profile.id ? "text-primary" : "text-muted-foreground"
                          )} />
                          <div className="font-medium text-sm">{profile.label}</div>
                          <div className="text-xs text-muted-foreground">{profile.duration}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirm */}
              {scanStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">Ready to Scan</h4>
                    <p className="text-sm text-muted-foreground mt-1">Review your configuration before starting</p>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Scan Name</span>
                      <span className="text-sm font-medium text-foreground">{scanName || 'Untitled Scan'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Target Types</span>
                      <span className="text-sm font-medium text-foreground">
                        {selectedTargetTypes.map(t => scanTargetTypes.find(st => st.id === t)?.label).join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Targets Count</span>
                      <span className="text-sm font-medium text-foreground">
                        {scanTargets.split('\n').filter(t => t.trim()).length} target(s)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Scan Profile</span>
                      <span className="text-sm font-medium text-foreground">
                        {scanProfiles.find(p => p.id === selectedProfile)?.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Est. Duration</span>
                      <span className="text-sm font-medium text-foreground">
                        {scanProfiles.find(p => p.id === selectedProfile)?.duration}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => scanStep > 1 ? setScanStep(s => s - 1) : setIsScanDialogOpen(false)}
            >
              {scanStep > 1 ? 'Back' : 'Cancel'}
            </Button>
            <Button
              variant="gradient"
              onClick={() => scanStep < 3 ? setScanStep(s => s + 1) : handleCreateScan()}
              disabled={scanStep === 1 && selectedTargetTypes.length === 0}
            >
              {scanStep < 3 ? 'Continue' : 'Start Scan'}
              {scanStep < 3 && <ChevronRight className="w-4 h-4 ml-1" />}
              {scanStep === 3 && <Play className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Asset Dialog */}
      <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Asset
            </DialogTitle>
            <DialogDescription>
              Add a domain, IP address, or cloud resource to monitor
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="asset-name">Asset Name / Address</Label>
              <Input
                id="asset-name"
                placeholder="e.g., api.company.com, 192.168.1.100"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Asset Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "domain", label: "Domain", icon: Globe },
                  { value: "ip", label: "IP Address", icon: Server },
                  { value: "cloud", label: "Cloud", icon: Cloud },
                  { value: "repo", label: "Repository", icon: Database },
                ].map((type) => (
                  <motion.div
                    key={type.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAssetType(type.value)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all",
                      assetType === type.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <type.icon className={cn(
                      "w-4 h-4",
                      assetType === type.value ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "text-sm font-medium",
                      assetType === type.value ? "text-primary" : "text-foreground"
                    )}>{type.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddAssetOpen(false)}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleAddAsset}>
                Add Asset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
