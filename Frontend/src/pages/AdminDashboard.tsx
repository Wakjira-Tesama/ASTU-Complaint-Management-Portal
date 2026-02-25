import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const stats = [
  { label: "Total Complaints", value: "156", icon: MessageSquare, color: "text-info" },
  { label: "Active Staff", value: "24", icon: Users, color: "text-accent" },
  { label: "Resolution Rate", value: "87%", icon: TrendingUp, color: "text-success" },
  { label: "Avg. Resolution", value: "2.3d", icon: Clock, color: "text-warning" },
];

const departmentData = [
  { name: "Dormitory", complaints: 45 },
  { name: "Cafeteria", complaints: 32 },
  { name: "Academic", complaints: 28 },
  { name: "Library", complaints: 18 },
  { name: "Sports", complaints: 12 },
  { name: "Other", complaints: 21 },
];

const statusData = [
  { name: "Resolved", value: 87, color: "hsl(152, 60%, 40%)" },
  { name: "In Progress", value: 34, color: "hsl(210, 80%, 52%)" },
  { name: "Pending", value: 23, color: "hsl(38, 92%, 50%)" },
  { name: "Rejected", value: 12, color: "hsl(0, 72%, 51%)" },
];

const recentStaff = [
  { name: "Meron T.", dept: "Dormitory", resolved: 23, pending: 2 },
  { name: "Yonas G.", dept: "Cafeteria", resolved: 18, pending: 4 },
  { name: "Hanna L.", dept: "Academic", resolved: 15, pending: 1 },
  { name: "Biniam K.", dept: "Library", resolved: 12, pending: 3 },
];

const AdminDashboard = () => (
  <DashboardLayout role="admin">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">System overview and performance metrics</p>
        </div>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
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

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Bar chart */}
        <div className="lg:col-span-2 rounded-xl bg-card border border-border shadow-card p-5">
          <h3 className="font-display font-bold mb-4">Complaints by Department</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="complaints" fill="hsl(222, 60%, 18%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="rounded-xl bg-card border border-border shadow-card p-5">
          <h3 className="font-display font-bold mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="ml-auto font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff performance */}
      <div className="rounded-xl bg-card border border-border shadow-card">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-bold">Staff Performance</h3>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        <div className="divide-y divide-border">
          {recentStaff.map((s) => (
            <div key={s.name} className="p-5 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.dept} Department</p>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>{s.resolved} resolved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span>{s.pending} pending</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  </DashboardLayout>
);

export default AdminDashboard;
