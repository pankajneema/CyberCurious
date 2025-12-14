import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SeverityBadge } from "./SeverityBadge";
import { EmptyState } from "./EmptyState";
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
import { Label } from "@/components/ui/label";
import {
  Search,
  Download,
  Plus,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Globe,
  Trash2,
  Server,
  Shield,
  Network,
  Radar,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface Subdomain {
  id: number;
  name: string;
  risk: "critical" | "high" | "medium" | "low";
  dns: string;
  hosting: string;
  ip: string;
  status: "active" | "inactive";
  children?: Subdomain[];
}

const subdomains: Subdomain[] = [
  {
    id: 1,
    name: "company.com",
    risk: "medium",
    dns: "A",
    hosting: "AWS",
    ip: "52.84.123.45",
    status: "active",
    children: [
      {
        id: 2,
        name: "api.company.com",
        risk: "high",
        dns: "A",
        hosting: "AWS",
        ip: "52.84.123.46",
        status: "active",
        children: [
          { id: 3, name: "v1.api.company.com", risk: "low", dns: "CNAME", hosting: "AWS", ip: "52.84.123.47", status: "active" },
          { id: 4, name: "v2.api.company.com", risk: "medium", dns: "CNAME", hosting: "AWS", ip: "52.84.123.48", status: "active" },
        ],
      },
      {
        id: 5,
        name: "app.company.com",
        risk: "medium",
        dns: "A",
        hosting: "Cloudflare",
        ip: "104.26.10.5",
        status: "active",
        children: [
          { id: 6, name: "staging.app.company.com", risk: "high", dns: "A", hosting: "AWS", ip: "52.84.123.49", status: "active" },
        ],
      },
      { id: 7, name: "mail.company.com", risk: "critical", dns: "MX", hosting: "Google", ip: "142.250.185.5", status: "active" },
      { id: 8, name: "cdn.company.com", risk: "low", dns: "CNAME", hosting: "Cloudflare", ip: "104.26.10.6", status: "active" },
      { id: 9, name: "legacy.company.com", risk: "critical", dns: "A", hosting: "On-prem", ip: "203.0.113.50", status: "inactive" },
    ],
  },
];

function SubdomainNode({ 
  subdomain, 
  level = 0,
  onDelete,
  onRescan
}: { 
  subdomain: Subdomain; 
  level?: number;
  onDelete: (id: number, name: string) => void;
  onRescan: (name: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasChildren = subdomain.children && subdomain.children.length > 0;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-center gap-3 p-3 hover:bg-muted/50 rounded-xl cursor-pointer transition-all duration-200 group`}
        style={{ marginLeft: level * 28 }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          {hasChildren ? (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-primary/50" />
          )}
        </div>
        
        <div className={`p-2 rounded-lg ${
          subdomain.status === "active" ? "bg-primary/10" : "bg-muted"
        }`}>
          <Globe className={`w-4 h-4 ${subdomain.status === "active" ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground group-hover:text-primary transition-colors">{subdomain.name}</span>
            {subdomain.status === "inactive" && (
              <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">Inactive</span>
            )}
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <span className="text-xs px-2.5 py-1 bg-muted rounded-lg text-muted-foreground font-mono">{subdomain.dns}</span>
          <span className="text-xs text-muted-foreground w-20">{subdomain.hosting}</span>
          <span className="text-xs text-muted-foreground font-mono w-28">{subdomain.ip}</span>
        </div>
        
        <SeverityBadge severity={subdomain.risk} showDot={false} />
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={(e) => { e.stopPropagation(); onRescan(subdomain.name); }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:text-destructive" 
            onClick={(e) => { e.stopPropagation(); onDelete(subdomain.id, subdomain.name); }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </motion.div>
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {subdomain.children?.map((child) => (
              <SubdomainNode 
                key={child.id} 
                subdomain={child} 
                level={level + 1}
                onDelete={onDelete}
                onRescan={onRescan}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SubdomainDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);
  const [newSubdomain, setNewSubdomain] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const handleAddSubdomain = () => {
    if (!newSubdomain) {
      toast({ title: "Error", description: "Please enter a subdomain", variant: "destructive" });
      return;
    }
    toast({ title: "Subdomain Added", description: `${newSubdomain} has been queued for discovery` });
    setIsAddOpen(false);
    setNewSubdomain("");
  };

  const handleDelete = (id: number, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      toast({ title: "Subdomain Removed", description: `${deleteConfirm.name} has been removed` });
      setDeleteConfirm(null);
    }
  };

  const handleRescan = (name: string) => {
    toast({ title: "Re-scanning", description: `Scanning ${name}...` });
  };

  const handleFullScan = () => {
    setIsScanning(true);
    toast({ title: "Discovery Started", description: "Scanning all subdomains..." });
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Subdomain Discovery
          </h2>
          <p className="text-sm text-muted-foreground">Explore your domain hierarchy and discover hidden subdomains</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" disabled={isScanning} onClick={handleFullScan}>
            <Radar className={`w-4 h-4 mr-2 ${isScanning ? "animate-spin" : ""}`} />
            {isScanning ? "Scanning..." : "Discover All"}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="gradient" onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Subdomain
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: "Total Subdomains", value: "127", icon: Globe, color: "bg-primary/10 text-primary" },
          { label: "Active", value: "118", icon: Shield, color: "bg-success/10 text-success" },
          { label: "Critical Risk", value: "8", icon: Server, color: "bg-destructive/10 text-destructive" },
          { label: "New This Week", value: "12", icon: Plus, color: "bg-accent/10 text-accent" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search subdomains..."
          className="pl-11 h-12 rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tree View */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Domain Hierarchy</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={handleFullScan}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? "animate-spin" : ""}`} />
            Re-scan All
          </Button>
        </div>
        <div className="p-4 space-y-1">
          {subdomains.map((subdomain) => (
            <SubdomainNode 
              key={subdomain.id} 
              subdomain={subdomain}
              onDelete={handleDelete}
              onRescan={handleRescan}
            />
          ))}
        </div>
      </div>

      {/* DNS Records Summary */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">DNS Record Distribution</h3>
        </div>
        <div className="grid sm:grid-cols-5 gap-4">
          {[
            { type: "A", count: 45, color: "bg-primary" },
            { type: "AAAA", count: 12, color: "bg-secondary" },
            { type: "CNAME", count: 38, color: "bg-accent" },
            { type: "MX", count: 8, color: "bg-warning" },
            { type: "TXT", count: 24, color: "bg-success" },
          ].map((record) => (
            <div key={record.type} className="text-center p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="text-2xl font-bold text-foreground">{record.count}</div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${record.color}`} />
                <span className="text-sm text-muted-foreground font-mono">{record.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Subdomain Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add Subdomain
            </DialogTitle>
            <DialogDescription>
              Add a subdomain to monitor and discover
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Subdomain</Label>
              <Input
                placeholder="e.g., api.example.com"
                value={newSubdomain}
                onChange={(e) => setNewSubdomain(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button variant="gradient" onClick={handleAddSubdomain}>Add Subdomain</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Subdomain?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <span className="font-mono font-semibold">{deleteConfirm?.name}</span>? 
              This will stop monitoring this subdomain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
