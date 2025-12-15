import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "./EmptyState";
import {
  Search,
  Plus,
  Play,
  Pause,
  Trash2,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Calendar,
  Eye,
  RefreshCw,
  AlertTriangle,
  Radar,
  Edit,
  Globe,
  Server,
  Shield,
  Zap,
  Target,
  Network,
  Bug,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const scans = [
  { id: 1, name: "Full External Scan", target: "*.company.com", type: "external", status: "completed", progress: 100, duration: "45m", findings: 23, lastRun: "2024-01-20 14:30", schedule: "Weekly" },
  { id: 2, name: "API Endpoint Scan", target: "api.company.com", type: "external", status: "running", progress: 67, duration: "12m", findings: 8, lastRun: "Running...", schedule: "Daily" },
  { id: 3, name: "Cloud Infrastructure", target: "AWS Account", type: "cloud", status: "scheduled", progress: 0, duration: "-", findings: 0, lastRun: "2024-01-19 08:00", schedule: "Daily" },
  { id: 4, name: "Internal Network", target: "10.0.0.0/24", type: "internal", status: "failed", progress: 45, duration: "23m", findings: 5, lastRun: "2024-01-18 22:00", schedule: "Monthly" },
  { id: 5, name: "Web Application", target: "app.company.com", type: "webapp", status: "paused", progress: 34, duration: "15m", findings: 12, lastRun: "2024-01-17 16:45", schedule: "Manual" },
];

const schedules = [
  { id: 1, name: "Daily Full Scan", nextRun: "Tomorrow 02:00", targets: 5, enabled: true },
  { id: 2, name: "Weekly Deep Scan", nextRun: "Sunday 00:00", targets: 12, enabled: true },
  { id: 3, name: "Monthly Compliance", nextRun: "Feb 1 03:00", targets: 8, enabled: false },
];

const scanTypes = [
  { 
    value: "discovery", 
    label: "Asset Discovery", 
    icon: Target, 
    description: "Discover domains, IPs, and services",
    color: "bg-primary/10 text-primary"
  },
  { 
    value: "vulnerability", 
    label: "Vulnerability Scan", 
    icon: Bug, 
    description: "Scan for known vulnerabilities (CVEs)",
    color: "bg-destructive/10 text-destructive"
  },
  { 
    value: "webapp", 
    label: "Web Application", 
    icon: Globe, 
    description: "OWASP Top 10 and web security testing",
    color: "bg-warning/10 text-warning"
  },
  { 
    value: "network", 
    label: "Network Scan", 
    icon: Network, 
    description: "Port scanning and service detection",
    color: "bg-accent/10 text-accent"
  },
  { 
    value: "cloud", 
    label: "Cloud Security", 
    icon: Server, 
    description: "AWS, Azure, GCP misconfigurations",
    color: "bg-success/10 text-success"
  },
];

// Mock assets from Asset Inventory
const inventoryAssets = [
  { id: 1, name: "company.com", type: "domain", ip: "-" },
  { id: 2, name: "api.company.com", type: "domain", ip: "192.168.1.10" },
  { id: 3, name: "app.company.com", type: "domain", ip: "192.168.1.11" },
  { id: 4, name: "staging.company.com", type: "domain", ip: "192.168.1.20" },
  { id: 5, name: "192.168.1.0/24", type: "ip_range", ip: "-" },
  { id: 6, name: "AWS Production", type: "cloud", ip: "-" },
  { id: 7, name: "Azure Dev", type: "cloud", ip: "-" },
];

export function ScanManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewScanOpen, setIsNewScanOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);
  const [selectedScan, setSelectedScan] = useState<typeof scans[0] | null>(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [targetMode, setTargetMode] = useState<"inventory" | "manual">("inventory");
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [newScan, setNewScan] = useState({ 
    name: "", 
    target: "", 
    type: "", 
    schedule: "manual",
    intensity: "normal",
    notifications: true,
    autoRemediate: false,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "running": return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case "scheduled": return <Clock className="w-4 h-4 text-muted-foreground" />;
      case "failed": return <XCircle className="w-4 h-4 text-destructive" />;
      case "paused": return <Pause className="w-4 h-4 text-warning" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success/10 text-success";
      case "running": return "bg-primary/10 text-primary";
      case "scheduled": return "bg-muted text-muted-foreground";
      case "failed": return "bg-destructive/10 text-destructive";
      case "paused": return "bg-warning/10 text-warning";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredScans = scans.filter((scan) =>
    scan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scan.target.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateScan = () => {
    const hasTarget = targetMode === "inventory" ? selectedAssets.length > 0 : newScan.target;
    if (!newScan.name || !hasTarget || !newScan.type) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    toast({ 
      title: "Scan Created Successfully", 
      description: `${newScan.name} has been created and ${newScan.schedule === "manual" ? "is ready to run" : "scheduled"}` 
    });
    setIsNewScanOpen(false);
    setWizardStep(1);
    setTargetMode("inventory");
    setSelectedAssets([]);
    setNewScan({ name: "", target: "", type: "", schedule: "manual", intensity: "normal", notifications: true, autoRemediate: false });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      toast({ title: "Scan Deleted", description: `${deleteConfirm.name} has been deleted` });
      setDeleteConfirm(null);
    }
  };

  const handleRunScan = (name: string) => {
    toast({ title: "Scan Started", description: `${name} is now running` });
  };

  const renderWizardStep = () => {
    switch (wizardStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
                <Radar className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Select Scan Type</h3>
              <p className="text-sm text-muted-foreground">Choose the type of security scan you want to run</p>
            </div>

            <div className="grid gap-3">
              {scanTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = newScan.type === type.value;
                return (
                  <motion.button
                    key={type.value}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setNewScan({ ...newScan, type: type.value })}
                    className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/30 bg-muted/30"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Configure Target</h3>
              <p className="text-sm text-muted-foreground">Select assets from inventory or add new targets</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Scan Name</Label>
                <Input
                  placeholder="e.g., Weekly Production Scan"
                  value={newScan.name}
                  onChange={(e) => setNewScan({ ...newScan, name: e.target.value })}
                  className="h-12"
                />
              </div>

              {/* Target Mode Toggle */}
              <div className="space-y-3">
                <Label>Target Selection</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTargetMode("inventory")}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-left",
                      targetMode === "inventory" 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-foreground text-sm">From Asset Inventory</div>
                        <div className="text-xs text-muted-foreground">Select existing assets</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setTargetMode("manual")}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-left",
                      targetMode === "manual" 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Edit className="w-5 h-5 text-secondary" />
                      <div>
                        <div className="font-medium text-foreground text-sm">Manual Entry</div>
                        <div className="text-xs text-muted-foreground">Enter new targets</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {targetMode === "inventory" ? (
                <div className="space-y-3">
                  <Label>Select Assets ({selectedAssets.length} selected)</Label>
                  <div className="border border-border rounded-xl max-h-48 overflow-y-auto">
                    {inventoryAssets.map((asset) => {
                      const isSelected = selectedAssets.includes(asset.id);
                      return (
                        <div
                          key={asset.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAssets(selectedAssets.filter(id => id !== asset.id));
                            } else {
                              setSelectedAssets([...selectedAssets, asset.id]);
                            }
                          }}
                          className={cn(
                            "flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-border last:border-b-0",
                            isSelected ? "bg-primary/10" : "hover:bg-muted/50"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                            isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                          )}>
                            {isSelected && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-foreground truncate">{asset.name}</div>
                            <div className="text-xs text-muted-foreground">{asset.type} {asset.ip !== "-" && `• ${asset.ip}`}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">Click to select/deselect assets from your inventory</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Target</Label>
                  <Textarea
                    placeholder={
                      newScan.type === "network" 
                        ? "Enter IP addresses or CIDR ranges\ne.g., 192.168.1.0/24, 10.0.0.1-10.0.0.255" 
                        : newScan.type === "webapp"
                        ? "Enter URLs to scan\ne.g., https://app.company.com"
                        : "Enter domains, IPs, or asset identifiers\ne.g., *.company.com, api.company.com"
                    }
                    value={newScan.target}
                    onChange={(e) => setNewScan({ ...newScan, target: e.target.value })}
                    rows={4}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">Enter one target per line for multiple targets</p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Scan Intensity</Label>
                <Select value={newScan.intensity} onValueChange={(value) => setNewScan({ ...newScan, intensity: value })}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-success" />
                        <span>Light - Quick scan, minimal impact</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="normal">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-warning" />
                        <span>Normal - Balanced scan (recommended)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="aggressive">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-destructive" />
                        <span>Aggressive - Deep scan, may impact performance</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Schedule & Options</h3>
              <p className="text-sm text-muted-foreground">Set when and how to run this scan</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Schedule</Label>
                <Select value={newScan.schedule} onValueChange={(value) => setNewScan({ ...newScan, schedule: value })}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Run Manually</SelectItem>
                    <SelectItem value="hourly">Every Hour</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-muted/30 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Get notified when scan completes</div>
                  </div>
                  <Switch 
                    checked={newScan.notifications} 
                    onCheckedChange={(checked) => setNewScan({ ...newScan, notifications: checked })} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">Auto-Remediation</div>
                    <div className="text-sm text-muted-foreground">Automatically fix low-risk issues</div>
                  </div>
                  <Switch 
                    checked={newScan.autoRemediate} 
                    onCheckedChange={(checked) => setNewScan({ ...newScan, autoRemediate: checked })} 
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <h4 className="font-medium text-foreground mb-3">Scan Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium text-foreground">{newScan.name || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium text-foreground capitalize">{newScan.type || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target:</span>
                    <span className="font-medium text-foreground truncate max-w-[200px]">
                      {targetMode === "inventory" 
                        ? (selectedAssets.length > 0 ? `${selectedAssets.length} asset(s) selected` : "Not set")
                        : (newScan.target || "Not set")
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Schedule:</span>
                    <span className="font-medium text-foreground capitalize">{newScan.schedule}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Radar className="w-5 h-5 text-primary" />
            Scan Manager
          </h2>
          <p className="text-sm text-muted-foreground">Create, schedule, and monitor security scans</p>
        </div>
        <Button variant="gradient" onClick={() => setIsNewScanOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Scan
        </Button>
      </div>

      <Tabs defaultValue="scans">
        <TabsList>
          <TabsTrigger value="scans">All Scans</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="running">Running</TabsTrigger>
        </TabsList>

        <TabsContent value="scans" className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search scans..."
              className="pl-11 h-11 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {filteredScans.map((scan, index) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(scan.status)}
                    <div>
                      <div className="font-medium text-foreground">{scan.name}</div>
                      <div className="text-sm text-muted-foreground font-mono">{scan.target}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${getStatusColor(scan.status)}`}>
                      {scan.status}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />View Results
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRunScan(scan.name)}>
                          <Play className="w-4 h-4 mr-2" />Run Now
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedScan(scan); setIsEditOpen(true); }}>
                          <Edit className="w-4 h-4 mr-2" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => setDeleteConfirm({ id: scan.id, name: scan.name })}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {scan.status === "running" && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{scan.progress}%</span>
                    </div>
                    <Progress value={scan.progress} className="h-2" />
                  </div>
                )}

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{scan.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{scan.findings} findings</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{scan.schedule}</span>
                  </div>
                  <div className="ml-auto text-xs">
                    Last run: {scan.lastRun}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredScans.length === 0 && (
            <EmptyState
              icon={Search}
              title="No scans found"
              description="No scans match your search. Create a new scan to get started."
              actionLabel="New Scan"
              onAction={() => setIsNewScanOpen(true)}
            />
          )}
        </TabsContent>

        <TabsContent value="schedules" className="mt-4">
          <div className="space-y-3">
            {schedules.map((schedule, index) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${schedule.enabled ? "bg-success" : "bg-muted"}`} />
                  <div>
                    <div className="font-medium text-foreground">{schedule.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Next run: {schedule.nextRun} • {schedule.targets} targets
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Switch checked={schedule.enabled} />
                </div>
              </motion.div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Schedule
          </Button>
        </TabsContent>

        <TabsContent value="running" className="mt-4">
          {scans.filter((s) => s.status === "running").length > 0 ? (
            <div className="space-y-4">
              {scans
                .filter((s) => s.status === "running")
                .map((scan) => (
                  <motion.div
                    key={scan.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-card rounded-2xl border border-border p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        <div>
                          <div className="font-medium text-foreground">{scan.name}</div>
                          <div className="text-sm text-muted-foreground">{scan.target}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </Button>
                        <Button variant="destructive" size="sm">
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Overall Progress</span>
                          <span className="font-medium">{scan.progress}%</span>
                        </div>
                        <Progress value={scan.progress} className="h-3" />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-muted/30 rounded-xl text-center">
                          <div className="text-2xl font-bold text-foreground">{scan.findings}</div>
                          <div className="text-xs text-muted-foreground">Findings</div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-xl text-center">
                          <div className="text-2xl font-bold text-foreground">{scan.duration}</div>
                          <div className="text-xs text-muted-foreground">Elapsed</div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-xl text-center">
                          <div className="text-2xl font-bold text-foreground">~8m</div>
                          <div className="text-xs text-muted-foreground">Remaining</div>
                        </div>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-xl font-mono text-xs overflow-y-auto max-h-32 space-y-1">
                        <div className="text-muted-foreground">[14:45:23] Scanning api.company.com...</div>
                        <div className="text-muted-foreground">[14:45:24] Found open port 443</div>
                        <div className="text-muted-foreground">[14:45:25] Checking SSL certificate...</div>
                        <div className="text-warning">[14:45:26] Warning: Certificate expires in 30 days</div>
                        <div className="text-muted-foreground">[14:45:27] Scanning for vulnerabilities...</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          ) : (
            <EmptyState
              icon={RefreshCw}
              title="No running scans"
              description="There are currently no scans in progress."
              actionLabel="Start a Scan"
              onAction={() => setIsNewScanOpen(true)}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* New Scan Wizard Dialog */}
      <Dialog open={isNewScanOpen} onOpenChange={(open) => { setIsNewScanOpen(open); if (!open) setWizardStep(1); }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Create New Scan
            </DialogTitle>
            <DialogDescription>
              Step {wizardStep} of 3 - {wizardStep === 1 ? "Select Type" : wizardStep === 2 ? "Configure Target" : "Schedule & Options"}
            </DialogDescription>
          </DialogHeader>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 py-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step === wizardStep 
                    ? "bg-primary text-primary-foreground" 
                    : step < wizardStep 
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {step < wizardStep ? <CheckCircle2 className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${step < wizardStep ? "bg-success" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {renderWizardStep()}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 pt-4 border-t border-border">
            {wizardStep > 1 && (
              <Button variant="outline" className="flex-1" onClick={() => setWizardStep(wizardStep - 1)}>
                Back
              </Button>
            )}
            {wizardStep < 3 ? (
              <Button 
                variant="gradient" 
                className="flex-1" 
                onClick={() => setWizardStep(wizardStep + 1)}
                disabled={wizardStep === 1 && !newScan.type}
              >
                Continue
              </Button>
            ) : (
              <Button variant="gradient" className="flex-1" onClick={handleCreateScan}>
                <Radar className="w-4 h-4 mr-2" />
                Create Scan
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Scan</DialogTitle>
            <DialogDescription>Update scan configuration</DialogDescription>
          </DialogHeader>
          {selectedScan && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Scan Name</Label>
                <Input defaultValue={selectedScan.name} />
              </div>
              <div className="space-y-2">
                <Label>Target</Label>
                <Input defaultValue={selectedScan.target} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select defaultValue={selectedScan.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {scanTypes.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Schedule</Label>
                  <Select defaultValue={selectedScan.schedule.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button variant="gradient" className="flex-1" onClick={() => { toast({ title: "Scan Updated" }); setIsEditOpen(false); }}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
