import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SeverityBadge } from "./SeverityBadge";
import { EmptyState } from "./EmptyState";
import {
  Search,
  Download,
  Plus,
  MoreHorizontal,
  Globe,
  Server,
  Cloud,
  Code,
  Box,
  Trash2,
  Edit,
  Eye,
  UserPlus,
  Tag,
  RefreshCw,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";

const assets = [
  { id: 1, name: "api.company.com", type: "domain", exposure: "public", risk: 78, tags: ["production", "api"], lastSeen: "2 min ago", status: "active" },
  { id: 2, name: "192.168.1.100", type: "ip", exposure: "internal", risk: 45, tags: ["database"], lastSeen: "5 min ago", status: "active" },
  { id: 3, name: "aws-s3-backup", type: "cloud", exposure: "public", risk: 92, tags: ["aws", "storage"], lastSeen: "10 min ago", status: "critical" },
  { id: 4, name: "github.com/company/repo", type: "repo", exposure: "public", risk: 35, tags: ["code"], lastSeen: "1 hour ago", status: "active" },
  { id: 5, name: "mail.company.com", type: "domain", exposure: "public", risk: 67, tags: ["email", "production"], lastSeen: "15 min ago", status: "warning" },
  { id: 6, name: "staging.company.com", type: "domain", exposure: "internal", risk: 23, tags: ["staging"], lastSeen: "30 min ago", status: "active" },
  { id: 7, name: "slack-workspace", type: "saas", exposure: "internal", risk: 18, tags: ["communication"], lastSeen: "1 hour ago", status: "active" },
  { id: 8, name: "10.0.0.50", type: "ip", exposure: "internal", risk: 56, tags: ["server"], lastSeen: "45 min ago", status: "warning" },
];

const typeIcons: Record<string, typeof Globe> = {
  domain: Globe,
  ip: Server,
  cloud: Cloud,
  repo: Code,
  saas: Box,
};

export function AssetInventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<typeof assets[0] | null>(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [exposureFilter, setExposureFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);
  const [newAsset, setNewAsset] = useState({ name: "", type: "", exposure: "public" });

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || asset.type === typeFilter;
    const matchesExposure = exposureFilter === "all" || asset.exposure === exposureFilter;
    return matchesSearch && matchesType && matchesExposure;
  });

  const toggleSelectAll = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map((a) => a.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedAssets((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getSeverity = (risk: number) => {
    if (risk >= 80) return "critical";
    if (risk >= 60) return "high";
    if (risk >= 40) return "medium";
    return "low";
  };

  const handleAddAsset = () => {
    if (!newAsset.name || !newAsset.type) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    toast({ title: "Asset Added", description: `${newAsset.name} has been added` });
    setIsAddOpen(false);
    setNewAsset({ name: "", type: "", exposure: "public" });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      toast({ title: "Asset Deleted", description: `${deleteConfirm.name} has been removed` });
      setDeleteConfirm(null);
    }
  };

  const handleBulkDelete = () => {
    toast({ title: "Assets Deleted", description: `${selectedAssets.length} assets have been removed` });
    setSelectedAssets([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            Asset Inventory
          </h2>
          <p className="text-sm text-muted-foreground">{assets.length} assets discovered</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="gradient" onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search assets by name, IP, domain..."
            className="pl-11 h-11 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] h-11 rounded-xl">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="domain">Domain</SelectItem>
              <SelectItem value="ip">IP Address</SelectItem>
              <SelectItem value="cloud">Cloud</SelectItem>
              <SelectItem value="repo">Repository</SelectItem>
              <SelectItem value="saas">SaaS</SelectItem>
            </SelectContent>
          </Select>
          <Select value={exposureFilter} onValueChange={setExposureFilter}>
            <SelectTrigger className="w-[140px] h-11 rounded-xl">
              <SelectValue placeholder="Exposure" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exposure</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedAssets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl"
          >
            <span className="text-sm font-medium text-foreground">
              {selectedAssets.length} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Tag className="w-4 h-4 mr-1" />
                Tag
              </Button>
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-1" />
                Assign
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedAssets([])}>
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="p-4 font-medium">
                  <Checkbox
                    checked={selectedAssets.length === filteredAssets.length && filteredAssets.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4 font-medium">Asset Name</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Exposure</th>
                <th className="p-4 font-medium">Risk Score</th>
                <th className="p-4 font-medium">Tags</th>
                <th className="p-4 font-medium">Last Seen</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => {
                const TypeIcon = typeIcons[asset.type] || Server;
                return (
                  <motion.tr
                    key={asset.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-border hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedAssets.includes(asset.id)}
                        onCheckedChange={() => toggleSelect(asset.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                          <TypeIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{asset.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">{asset.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-sm text-muted-foreground">{asset.type}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        asset.exposure === "public" 
                          ? "bg-warning/10 text-warning" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {asset.exposure}
                      </span>
                    </td>
                    <td className="p-4">
                      <SeverityBadge severity={getSeverity(asset.risk) as any} showDot={false} />
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {asset.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                        {asset.tags.length > 2 && (
                          <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                            +{asset.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{asset.lastSeen}</td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedAsset(asset)}>
                            <Eye className="w-4 h-4 mr-2" />View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedAsset(asset); setIsEditOpen(true); }}>
                            <Edit className="w-4 h-4 mr-2" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="w-4 h-4 mr-2" />Re-scan
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="w-4 h-4 mr-2" />Assign Owner
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeleteConfirm({ id: asset.id, name: asset.name })}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredAssets.length === 0 && (
          <EmptyState
            icon={Server}
            title="No assets found"
            description="No assets match your current filters. Try adjusting your search or add new assets."
            actionLabel="Add Asset"
            onAction={() => setIsAddOpen(true)}
          />
        )}
      </div>

      {/* Asset Detail Sheet */}
      <Sheet open={!!selectedAsset && !isEditOpen} onOpenChange={() => setSelectedAsset(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedAsset && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  {(() => {
                    const TypeIcon = typeIcons[selectedAsset.type] || Server;
                    return <TypeIcon className="w-5 h-5 text-primary" />;
                  })()}
                  {selectedAsset.name}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-1" />Re-scan</Button>
                  <Button variant="outline" size="sm"><UserPlus className="w-4 h-4 mr-1" />Assign</Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}><Edit className="w-4 h-4 mr-1" />Edit</Button>
                </div>

                {/* Asset Info */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Asset Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <div className="text-xs text-muted-foreground mb-1">Type</div>
                      <div className="text-sm font-medium capitalize">{selectedAsset.type}</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <div className="text-xs text-muted-foreground mb-1">Exposure</div>
                      <div className="text-sm font-medium capitalize">{selectedAsset.exposure}</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <div className="text-xs text-muted-foreground mb-1">Risk Score</div>
                      <div className="text-sm font-medium">{selectedAsset.risk}/100</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <div className="text-xs text-muted-foreground mb-1">Last Seen</div>
                      <div className="text-sm font-medium">{selectedAsset.lastSeen}</div>
                    </div>
                  </div>
                </div>

                {/* Open Ports */}
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Open Ports</h4>
                  <div className="flex flex-wrap gap-2">
                    {[22, 80, 443, 3306, 5432].map((port) => (
                      <span key={port} className="px-3 py-1.5 bg-warning/10 text-warning text-sm rounded-lg font-mono">
                        {port}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Technologies Detected</h4>
                  <div className="flex flex-wrap gap-2">
                    {["nginx", "Node.js", "PostgreSQL", "React"].map((tech) => (
                      <span key={tech} className="px-3 py-1.5 bg-muted text-muted-foreground text-sm rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Vulnerabilities */}
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Related Vulnerabilities</h4>
                  <div className="space-y-2">
                    {[
                      { title: "Outdated SSL Certificate", severity: "high" },
                      { title: "Missing Security Headers", severity: "medium" },
                    ].map((vuln, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <span className="text-sm">{vuln.title}</span>
                        <SeverityBadge severity={vuln.severity as any} showDot={false} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAsset.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-lg flex items-center gap-2">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer hover:text-destructive" />
                      </span>
                    ))}
                    <Button variant="ghost" size="sm" className="h-8">
                      <Plus className="w-3 h-3 mr-1" />
                      Add Tag
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Asset Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Asset
            </DialogTitle>
            <DialogDescription>
              Add a new asset to your inventory
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Asset Name / Address</Label>
              <Input
                placeholder="e.g., api.company.com"
                value={newAsset.name}
                onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Asset Type</Label>
              <Select value={newAsset.type} onValueChange={(value) => setNewAsset({ ...newAsset, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="domain">Domain</SelectItem>
                  <SelectItem value="ip">IP Address</SelectItem>
                  <SelectItem value="cloud">Cloud Resource</SelectItem>
                  <SelectItem value="repo">Repository</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Exposure</Label>
              <Select value={newAsset.exposure} onValueChange={(value) => setNewAsset({ ...newAsset, exposure: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exposure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button variant="gradient" onClick={handleAddAsset}>Add Asset</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Asset Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Edit Asset
            </DialogTitle>
            <DialogDescription>
              Update asset information
            </DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Asset Name</Label>
                <Input defaultValue={selectedAsset.name} />
              </div>
              <div className="space-y-2">
                <Label>Asset Type</Label>
                <Select defaultValue={selectedAsset.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domain">Domain</SelectItem>
                    <SelectItem value="ip">IP Address</SelectItem>
                    <SelectItem value="cloud">Cloud Resource</SelectItem>
                    <SelectItem value="repo">Repository</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Exposure</Label>
                <Select defaultValue={selectedAsset.exposure}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button variant="gradient" onClick={() => { 
                  toast({ title: "Asset Updated", description: "Changes have been saved" });
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
            <AlertDialogTitle>Delete Asset?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{deleteConfirm?.name}</span>? 
              This action cannot be undone.
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
