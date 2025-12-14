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
  Settings,
  Eye,
  RefreshCw,
  AlertTriangle,
  Radar,
  Edit,
} from "lucide-react";
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
import { motion } from "framer-motion";
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

export function ScanManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewScanOpen, setIsNewScanOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);
  const [selectedScan, setSelectedScan] = useState<typeof scans[0] | null>(null);
  const [newScan, setNewScan] = useState({ name: "", target: "", type: "", schedule: "" });

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
    if (!newScan.name || !newScan.target || !newScan.type) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Scan Created", description: `${newScan.name} has been created` });
    setIsNewScanOpen(false);
    setNewScan({ name: "", target: "", type: "", schedule: "" });
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
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search scans..."
              className="pl-11 h-11 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Scans List */}
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

                      {/* Live Logs */}
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

      {/* New Scan Dialog */}
      <Dialog open={isNewScanOpen} onOpenChange={setIsNewScanOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Radar className="w-5 h-5 text-primary" />
              Create New Scan
            </DialogTitle>
            <DialogDescription>
              Configure and schedule a new security scan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Scan Name</Label>
              <Input 
                placeholder="e.g., Weekly External Scan"
                value={newScan.name}
                onChange={(e) => setNewScan({ ...newScan, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Target</Label>
              <Input 
                placeholder="e.g., *.company.com, 10.0.0.0/24"
                value={newScan.target}
                onChange={(e) => setNewScan({ ...newScan, target: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Scan Type</Label>
                <Select value={newScan.type} onValueChange={(value) => setNewScan({ ...newScan, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="external">External</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="webapp">Web Application</SelectItem>
                    <SelectItem value="cloud">Cloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Schedule</Label>
                <Select value={newScan.schedule} onValueChange={(value) => setNewScan({ ...newScan, schedule: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule" />
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
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsNewScanOpen(false)}>Cancel</Button>
              <Button variant="gradient" onClick={handleCreateScan}>Create Scan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Scan Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Edit Scan
            </DialogTitle>
            <DialogDescription>
              Update scan configuration
            </DialogDescription>
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
                  <Label>Scan Type</Label>
                  <Select defaultValue={selectedScan.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="external">External</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="webapp">Web Application</SelectItem>
                      <SelectItem value="cloud">Cloud</SelectItem>
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
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button variant="gradient" onClick={() => {
                  toast({ title: "Scan Updated", description: "Changes have been saved" });
                  setIsEditOpen(false);
                }}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scan?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{deleteConfirm?.name}</span>? 
              This will also remove all scan history and results.
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
