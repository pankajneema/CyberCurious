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
  Users,
  Shield,
  Network,
  Upload,
  FileText,
  CheckCircle2,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

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
  user: Users,
};

const assetTypes = [
  { value: "domain", label: "Domain", icon: Globe, description: "Add domain names (e.g., example.com)" },
  { value: "ip", label: "IP Address", icon: Server, description: "Add IP addresses or CIDR ranges" },
  { value: "cloud", label: "Cloud Asset", icon: Cloud, description: "AWS, Azure, GCP resources" },
  { value: "repo", label: "Repository", icon: Code, description: "GitHub, GitLab, Bitbucket repos" },
  { value: "saas", label: "SaaS App", icon: Box, description: "Third-party SaaS applications" },
  { value: "user", label: "User Account", icon: Users, description: "Employee or service accounts" },
];

export function AssetInventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<typeof assets[0] | null>(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [exposureFilter, setExposureFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<string | null>(null);
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "",
    exposure: "public",
    tags: "",
    description: "",
    bulkInput: "",
  });

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
    if (!newAsset.name && !newAsset.bulkInput) {
      toast({ title: "Error", description: "Please enter asset details", variant: "destructive" });
      return;
    }

    const assetsToAdd = newAsset.bulkInput 
      ? newAsset.bulkInput.split("\n").filter(line => line.trim()).length
      : 1;

    toast({ 
      title: "Assets Added", 
      description: `${assetsToAdd} asset${assetsToAdd > 1 ? 's' : ''} added successfully` 
    });
    setIsAddOpen(false);
    setSelectedAssetType(null);
    setNewAsset({ name: "", type: "", exposure: "public", tags: "", description: "", bulkInput: "" });
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

  const renderAssetTypeForm = () => {
    const type = assetTypes.find(t => t.value === selectedAssetType);
    if (!type) return null;

    const Icon = type.icon;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">{type.label}</h4>
            <p className="text-sm text-muted-foreground">{type.description}</p>
          </div>
        </div>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Entry</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>
                {selectedAssetType === "ip" ? "IP Address / CIDR Range" :
                 selectedAssetType === "domain" ? "Domain Name" :
                 selectedAssetType === "user" ? "Email / Username" :
                 "Asset Name"}
              </Label>
              <Input
                placeholder={
                  selectedAssetType === "ip" ? "e.g., 192.168.1.1 or 10.0.0.0/24" :
                  selectedAssetType === "domain" ? "e.g., api.company.com" :
                  selectedAssetType === "user" ? "e.g., john@company.com" :
                  "Enter asset name"
                }
                value={newAsset.name}
                onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
              />
            </div>

            {selectedAssetType === "user" && (
              <>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Access Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="standard">Standard User</SelectItem>
                      <SelectItem value="limited">Limited Access</SelectItem>
                      <SelectItem value="guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {selectedAssetType === "cloud" && (
              <div className="space-y-2">
                <Label>Cloud Provider</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws">Amazon Web Services</SelectItem>
                    <SelectItem value="azure">Microsoft Azure</SelectItem>
                    <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Exposure</Label>
              <Select 
                value={newAsset.exposure} 
                onValueChange={(value) => setNewAsset({ ...newAsset, exposure: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public (Internet-facing)</SelectItem>
                  <SelectItem value="internal">Internal (Private network)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input
                placeholder="e.g., production, critical, api"
                value={newAsset.tags}
                onChange={(e) => setNewAsset({ ...newAsset, tags: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                placeholder="Add notes about this asset..."
                value={newAsset.description}
                onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4 mt-4">
            <div className="p-4 bg-muted/30 rounded-xl border border-dashed border-border">
              <div className="flex items-center gap-3 mb-3">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Bulk Import</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Enter one {selectedAssetType === "ip" ? "IP/CIDR" : selectedAssetType === "domain" ? "domain" : "asset"} per line, or upload a CSV file
              </p>
              <Textarea
                placeholder={
                  selectedAssetType === "ip" 
                    ? "192.168.1.1\n192.168.1.2\n10.0.0.0/24" 
                    : selectedAssetType === "domain"
                    ? "api.company.com\nmail.company.com\nstaging.company.com"
                    : "Enter assets, one per line..."
                }
                value={newAsset.bulkInput}
                onChange={(e) => setNewAsset({ ...newAsset, bulkInput: e.target.value })}
                rows={8}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="w-4 h-4" />
                Upload CSV
              </Button>
              <span className="text-xs text-muted-foreground">or paste directly above</span>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={() => setSelectedAssetType(null)}>
            Back
          </Button>
          <Button variant="gradient" className="flex-1" onClick={handleAddAsset}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Add Asset{newAsset.bulkInput ? "s" : ""}
          </Button>
        </div>
      </motion.div>
    );
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
            Export
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
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-1" />Re-scan</Button>
                  <Button variant="outline" size="sm"><UserPlus className="w-4 h-4 mr-1" />Assign</Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}><Edit className="w-4 h-4 mr-1" />Edit</Button>
                </div>

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

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAsset.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Asset Dialog */}
      <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) setSelectedAssetType(null); }}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Add New Asset
            </DialogTitle>
            <DialogDescription>
              Select the type of asset you want to add to your inventory
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {!selectedAssetType ? (
              <motion.div
                key="type-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-2 gap-3 py-4"
              >
                {assetTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <motion.button
                      key={type.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedAssetType(type.value)}
                      className="p-4 bg-muted/30 hover:bg-muted/50 rounded-xl border border-border hover:border-primary/30 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="font-medium text-foreground">{type.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <div key="form" className="py-4">
                {renderAssetTypeForm()}
              </div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>Update asset information</DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Asset Name</Label>
                <Input defaultValue={selectedAsset.name} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select defaultValue={selectedAsset.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {assetTypes.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
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
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input defaultValue={selectedAsset.tags.join(", ")} />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button variant="gradient" className="flex-1" onClick={() => { toast({ title: "Asset Updated" }); setIsEditOpen(false); }}>
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
            <AlertDialogTitle>Delete Asset</AlertDialogTitle>
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
