import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertCircle, MessageSquare, Send, UserCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

const iconMap: Record<string, any> = {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle
};

const StaffDashboard = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dept, setDept] = useState("");
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const [statsRes, ticketsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/analytics/staff`, { headers }),
        fetch(`${API_BASE_URL}/api/complaints`, { headers })
      ]);

      const statsData = await statsRes.json();
      const ticketsData = await ticketsRes.json();

      if (statsRes.ok) {
        setStats(statsData.summary);
        setDept(statsData.department);
      }
      if (ticketsRes.ok) {
        setTickets(ticketsData.slice(0, 5)); // Show recent 5
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (dept) {
      fetchMessages();
    }
  }, [dept]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatMessages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin-messages/${encodeURIComponent(dept)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        setChatMessages(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !dept) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin-messages/${encodeURIComponent(dept)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ text: newMessage })
      });
      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast({ title: "Status Updated", description: `Ticket marked as ${newStatus}` });
        fetchData();
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const statusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "resolved": return "default";
      case "in_progress": return "secondary";
      case "pending": return "outline";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  if (loading) return <DashboardLayout role="staff"><div className="p-10 text-center">Loading panel...</div></DashboardLayout>;

  return (
    <DashboardLayout role="staff">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="h-full flex flex-col xl:flex-row gap-6">
        
        {/* Main Dashboard Content */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                {dept} Department
              </h1>
              <p className="text-muted-foreground mt-1">Manage complaints securely and efficiently</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s: any) => {
              const Icon = iconMap[s.icon] || MessageSquare;
              return (
                <div key={s.label} className="p-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow group">
                  <div className={`w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${s.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-3xl font-display font-bold">{s.value}</h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/20">
              <h2 className="font-display font-bold text-lg">Active Tickets</h2>
              <p className="text-sm text-muted-foreground">Recent complaints requiring your attention</p>
            </div>
            <div className="divide-y divide-border">
              {tickets.map((t) => (
                <div key={t._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-mono text-muted-foreground uppercase">
                        #{t._id.slice(-6)}
                      </span>
                      <Badge variant={statusColor(t.status) as any} className="shadow-sm">{t.status.replace("_", " ")}</Badge>
                    </div>
                    <p className="font-semibold text-base mb-1">{t.title}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5" />
                      {t.student?.name || "Anonymous"} 
                      <span className="text-border">•</span> 
                      {new Date(t.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {t.status === "pending" && (
                      <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl" onClick={() => handleStatusUpdate(t._id, "in_progress")}>
                        Process
                      </Button>
                    )}
                    {t.status !== "resolved" && (
                      <Button size="sm" className="h-9 px-4 rounded-xl shadow-gold" onClick={() => handleStatusUpdate(t._id, "resolved")}>
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {tickets.length === 0 && (
                <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mb-4 text-muted" />
                  <p className="font-medium text-lg">All caught up!</p>
                  <p className="text-sm">No new tickets assigned to your department.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Admin Communication Panel */}
        <div className="xl:w-[380px] shrink-0 flex flex-col bg-card border border-border shadow-2xl rounded-2xl overflow-hidden h-[600px] xl:h-auto xl:min-h-[calc(100vh-8rem)]">
          <div className="p-6 border-b border-border bg-primary/5 relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  Admin Channel
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Direct line to administration</p>
              </div>
            </div>
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/10">
            {chatMessages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground opacity-50">
                <MessageSquare className="w-8 h-8 mb-2" />
                <p className="text-sm">No messages yet.</p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex flex-col ${msg.senderRole === "staff" ? "items-end" : "items-start"}`}>
                <div className="flex items-end gap-2 mb-1">
                  {msg.senderRole === "admin" && <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Admin</span>}
                  {msg.senderRole === "staff" && <span className="text-[10px] text-muted-foreground">You</span>}
                </div>
                <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] shadow-sm ${
                  msg.senderRole === "staff" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border rounded-bl-sm"
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-4 border-t border-border bg-card flex items-center gap-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Message admin..."
              className="rounded-xl border-muted-foreground/30 focus-visible:ring-primary h-11 bg-muted/50"
            />
            <Button size="icon" className="rounded-xl shrink-0 h-11 w-11 shadow-gold" onClick={handleSendMessage} disabled={!newMessage.trim() || !dept}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </motion.div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
