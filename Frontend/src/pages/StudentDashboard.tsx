import DashboardLayout from "@/components/DashboardLayout";
import AIChatWidget from "@/components/AIChatWidget";
import { motion } from "framer-motion";
import { Plus, Clock, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const iconMap: Record<string, any> = {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle
};

import { API_BASE_URL } from "../lib/api";

const StudentDashboard = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
        const [complaintsRes, userRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/complaints`, { headers }),
          fetch(`${API_BASE_URL}/api/auth/me`, { headers }).catch(() => null)
        ]);

        const complaints = await complaintsRes.json();
        if (complaintsRes.ok) {
          // Calculate stats locally for student (or create a student analytics endpoint)
          const total = complaints.length;
          const pending = complaints.filter((c: any) => c.status === "pending").length;
          const resolved = complaints.filter((c: any) => c.status === "resolved").length;
          const rejected = complaints.filter((c: any) => c.status === "rejected").length;

          const statsData = [
            { label: "Total Complaints", value: total.toString(), icon: MessageSquare, color: "text-info" },
            { label: "Pending", value: pending.toString(), icon: Clock, color: "text-warning" },
            { label: "Resolved", value: resolved.toString(), icon: CheckCircle2, color: "text-success" },
            { label: "Rejected", value: rejected.toString(), icon: AlertCircle, color: "text-destructive" },
          ];
          setStats(statsData as any);
          setRecent(complaints.slice(0, 4));
        }

        // Try to get name from localStorage as fallback
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (userData.name) setUserName(userData.name.split(" ")[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved": return "default";
      case "in_progress": return "secondary";
      case "pending": return "outline";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  if (loading) return <DashboardLayout role="student"><div className="p-10 text-center">Loading dashboard...</div></DashboardLayout>;

  return (
    <DashboardLayout role="student">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Welcome, {userName}</h1>
            <p className="text-sm text-muted-foreground">Track and manage your complaints</p>
          </div>
          <Link to="/student/complaints">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              New Complaint
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="p-5 rounded-xl bg-card border border-border shadow-card">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recent */}
        <div className="rounded-xl bg-card border border-border shadow-card">
          <div className="p-5 border-b border-border">
            <h2 className="font-display font-bold">Recent Complaints</h2>
          </div>
          <div className="divide-y divide-border">
            {recent.map((c) => (
              <div key={c._id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">{c._id.slice(-6)}</span>
                    <Badge variant={statusVariant(c.status) as any}>{c.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="font-medium text-sm">{c.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.department} · {new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
                <Link to="/student/complaints">
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </div>
            ))}
            {recent.length === 0 && <div className="p-10 text-center text-muted-foreground">You haven't submitted any complaints yet</div>}
          </div>
        </div>
      </motion.div>

      {/* AI Chat Widget */}
      <AIChatWidget />
    </DashboardLayout>
  );
};

export default StudentDashboard;
