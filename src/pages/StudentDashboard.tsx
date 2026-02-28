import DashboardLayout from "@/components/DashboardLayout";
import AIChatWidget from "@/components/AIChatWidget";
import { motion } from "framer-motion";
import { Plus, Clock, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const stats = [
  { label: "Total Complaints", value: "12", icon: MessageSquare, color: "text-info" },
  { label: "Pending", value: "3", icon: Clock, color: "text-warning" },
  { label: "Resolved", value: "8", icon: CheckCircle2, color: "text-success" },
  { label: "Rejected", value: "1", icon: AlertCircle, color: "text-destructive" },
];

const recentComplaints = [
  { id: "T-1042", title: "Water supply issue in Block 5", department: "Dormitory", status: "Pending", date: "Feb 25, 2026" },
  { id: "T-1038", title: "Broken projector in Room 204", department: "Academic", status: "In Progress", date: "Feb 23, 2026" },
  { id: "T-1035", title: "Cafeteria food quality concern", department: "Cafeteria", status: "Resolved", date: "Feb 20, 2026" },
  { id: "T-1029", title: "Library hours extension request", department: "Library", status: "Resolved", date: "Feb 18, 2026" },
];

const statusVariant = (status: string) => {
  switch (status) {
    case "Resolved": return "default";
    case "In Progress": return "secondary";
    case "Pending": return "outline";
    case "Rejected": return "destructive";
    default: return "outline";
  }
};

const StudentDashboard = () => {
  return (
    <DashboardLayout role="student">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Welcome, Abebe</h1>
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
            {recentComplaints.map((c) => (
              <div key={c.id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                    <Badge variant={statusVariant(c.status) as any}>{c.status}</Badge>
                  </div>
                  <p className="font-medium text-sm">{c.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.department} · {c.date}</p>
                </div>
                <Link to="/student/complaints">
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* AI Chat Widget */}
      <AIChatWidget />
    </DashboardLayout>
  );
};

export default StudentDashboard;
