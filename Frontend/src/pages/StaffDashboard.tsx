import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const [statsRes, ticketsRes] = await Promise.all([
        fetch("/api/analytics/staff", { headers }),
        fetch("/api/complaints", { headers })
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

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/complaints/${id}/status`, {
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">{dept} Staff Panel</h1>
          <p className="text-sm text-muted-foreground">Manage complaints assigned to your department</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s: any) => {
            const Icon = iconMap[s.icon] || MessageSquare;
            return (
              <div key={s.label} className="p-5 rounded-xl bg-card border border-border shadow-card">
                <Icon className={`w-5 h-5 mb-2 ${s.color}`} />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl bg-card border border-border shadow-card">
          <div className="p-5 border-b border-border">
            <h2 className="font-display font-bold">Recent Assigned Tickets</h2>
          </div>
          <div className="divide-y divide-border">
            {tickets.map((t) => (
              <div key={t._id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">{t._id.slice(-6)}</span>
                    <Badge variant={statusColor(t.status) as any}>{t.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="font-medium text-sm">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">By {t.student?.name || "Anonymous"} · {new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  {t.status === "pending" && (
                    <Button variant="outline" size="sm" onClick={() => handleStatusUpdate(t._id, "in_progress")}>Process</Button>
                  )}
                  {t.status !== "resolved" && (
                    <Button size="sm" onClick={() => handleStatusUpdate(t._id, "resolved")}>Resolve</Button>
                  )}
                </div>
              </div>
            ))}
            {tickets.length === 0 && <div className="p-10 text-center text-muted-foreground">No tickets assigned to your department</div>}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
