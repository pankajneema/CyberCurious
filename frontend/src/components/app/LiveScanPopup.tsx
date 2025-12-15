import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Radar, Bug, X, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ScanNotification {
  id: string;
  type: "asm" | "vs";
  title: string;
  target: string;
  status: "running" | "completed" | "found";
  progress?: number;
  message?: string;
  severity?: "critical" | "high" | "medium" | "low";
}

const mockNotifications: ScanNotification[] = [
  { id: "1", type: "asm", title: "ASM Discovery", target: "company.com", status: "running", progress: 45 },
  { id: "2", type: "vs", title: "Vulnerability Scan", target: "api.company.com", status: "running", progress: 78 },
];

export function LiveScanPopup() {
  const [notifications, setNotifications] = useState<ScanNotification[]>(mockNotifications);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ScanNotification[]>([]);

  // Simulate scan progress and discoveries
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev => prev.map(n => {
        if (n.status === "running" && n.progress !== undefined) {
          const newProgress = Math.min(n.progress + Math.random() * 5, 100);
          if (newProgress >= 100) {
            // Add completion toast
            const completedToast: ScanNotification = {
              ...n,
              status: "completed",
              message: "Scan completed successfully",
            };
            setToasts(t => [...t, completedToast]);
            setTimeout(() => setToasts(t => t.filter(toast => toast.id !== n.id)), 5000);
            return { ...n, progress: 100, status: "completed" as const };
          }
          return { ...n, progress: newProgress };
        }
        return n;
      }));
    }, 2000);

    // Simulate finding vulnerabilities
    const discoveryInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const severities: ("critical" | "high" | "medium" | "low")[] = ["critical", "high", "medium", "low"];
        const newDiscovery: ScanNotification = {
          id: `discovery-${Date.now()}`,
          type: "vs",
          title: "Vulnerability Found",
          target: ["api.company.com", "mail.company.com", "staging.app.com"][Math.floor(Math.random() * 3)],
          status: "found",
          severity: severities[Math.floor(Math.random() * 4)],
          message: ["SQL Injection detected", "XSS vulnerability found", "Outdated SSL certificate", "Open port detected"][Math.floor(Math.random() * 4)],
        };
        setToasts(t => [...t.slice(-3), newDiscovery]);
        setTimeout(() => setToasts(t => t.filter(toast => toast.id !== newDiscovery.id)), 6000);
      }
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(discoveryInterval);
    };
  }, []);

  const activeScans = notifications.filter(n => n.status === "running" && !dismissed.includes(n.id));

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "critical": return "from-red-500 to-red-600";
      case "high": return "from-orange-500 to-orange-600";
      case "medium": return "from-yellow-500 to-yellow-600";
      default: return "from-blue-500 to-blue-600";
    }
  };

  if (activeScans.length === 0 && toasts.length === 0) return null;

  return (
    <>
      {/* Floating Scan Status - PUBG Style */}
      <AnimatePresence>
        {activeScans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-20 right-4 z-50 space-y-2"
          >
            {activeScans.map((scan) => (
              <motion.div
                key={scan.id}
                layout
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 50 }}
                className="bg-gradient-to-r from-card/95 to-card/80 backdrop-blur-xl border border-border/50 rounded-xl p-3 shadow-2xl min-w-[280px]"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    scan.type === "asm" ? "bg-primary/20" : "bg-accent/20"
                  }`}>
                    {scan.type === "asm" ? (
                      <Radar className="w-5 h-5 text-primary animate-pulse" />
                    ) : (
                      <Bug className="w-5 h-5 text-accent animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{scan.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mr-1"
                        onClick={() => setDismissed(d => [...d, scan.id])}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{scan.target}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Progress value={scan.progress} className="h-1.5 flex-1" />
                      <span className="text-xs font-medium text-primary">{Math.round(scan.progress || 0)}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications - Game Style Pop-ups */}
      <AnimatePresence>
        {toasts.length > 0 && (
          <div className="fixed bottom-24 right-4 z-50 space-y-2">
            {toasts.map((toast, index) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="relative overflow-hidden"
              >
                <div className={`
                  relative bg-gradient-to-r ${toast.status === "found" ? getSeverityColor(toast.severity) : "from-success to-emerald-600"}
                  rounded-xl p-0.5 shadow-2xl
                `}>
                  <div className="bg-card/95 backdrop-blur-xl rounded-[10px] p-3 flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${toast.status === "found" 
                        ? toast.severity === "critical" ? "bg-destructive/20" : "bg-warning/20"
                        : "bg-success/20"
                      }
                    `}>
                      {toast.status === "found" ? (
                        <AlertTriangle className={`w-5 h-5 ${
                          toast.severity === "critical" ? "text-destructive" : "text-warning"
                        }`} />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{toast.title}</span>
                        {toast.severity && (
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            toast.severity === "critical" ? "bg-destructive/20 text-destructive" :
                            toast.severity === "high" ? "bg-warning/20 text-warning" :
                            "bg-accent/20 text-accent"
                          }`}>
                            {toast.severity}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{toast.message}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5">{toast.target}</p>
                    </div>
                    <Link 
                      to={toast.type === "asm" ? "/app/asm" : "/app/vs"} 
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                
                {/* Animated progress bar */}
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: toast.status === "found" ? 6 : 5, ease: "linear" }}
                  className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left ${
                    toast.status === "found" 
                      ? toast.severity === "critical" ? "bg-destructive" : "bg-warning"
                      : "bg-success"
                  }`}
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}