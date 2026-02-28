import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Assigned Tickets", value: "18", icon: MessageSquare, color: "text-info" },
  { label: "Pending Review", value: "5", icon: Clock, color: "text-warning" },
  { label: "Resolved", value: "11", icon: CheckCircle2, color: "text-success" },
  { label: "Rejected", value: "2", icon: AlertCircle, color: "text-destructive" },
];

const tickets = [
  { id: "T-1042", student: "Abebe K.", title: "Water supply issue in Block 5", status: "Pending", date: "Feb 25, 2026" },
  { id: "T-1040", student: "Tigist M.", title: "Broken door lock in Room 108", status: "In Progress", date: "Feb 24, 2026" },
  { id: "T-1037", student: "Dawit A.", title: "No hot water in Block 3", status: "Pending", date: "Feb 22, 2026" },
  { id: "T-1030", student: "Sara B.", title: "Electrical socket not working", status: "Resolved", date: "Feb 19, 2026" },
];

const statusColor = (s: string) => {
  if (s === "Resolved") return "default";
  if (s === "In Progress") return "secondary";
  if (s === "Pending") return "outline";
  return "destructive";
};

const StaffDashboard = () => (
  <DashboardLayout role="staff">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold">Dormitory Staff Panel</h1>
        <p className="text-sm text-muted-foreground">Manage complaints assigned to your department</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="p-5 rounded-xl bg-card border border-border shadow-card">
            <s.icon className={`w-5 h-5 mb-2 ${s.color}`} />
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-card border border-border shadow-card">
        <div className="p-5 border-b border-border">
          <h2 className="font-display font-bold">Assigned Tickets</h2>
        </div>
        <div className="divide-y divide-border">
          {tickets.map((t) => (
            <div key={t.id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">{t.id}</span>
                  <Badge variant={statusColor(t.status) as any}>{t.status}</Badge>
                </div>
                <p className="font-medium text-sm">{t.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">By {t.student} · {t.date}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Respond</Button>
                <Button size="sm">Resolve</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  </DashboardLayout>
);

export default StaffDashboard;
