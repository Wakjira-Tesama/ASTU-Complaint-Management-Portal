import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { TrendingUp, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

const stats = [
  { label: "Total Complaints", value: "156", icon: TrendingUp, color: "text-info" },
  { label: "Resolution Rate", value: "87%", icon: CheckCircle2, color: "text-success" },
  { label: "Avg Resolution Time", value: "2.3 days", icon: Clock, color: "text-warning" },
  { label: "Pending Now", value: "23", icon: AlertTriangle, color: "text-destructive" },
];

const deptData = [
  { name: "Dormitory", complaints: 45, resolved: 38 },
  { name: "Cafeteria", complaints: 32, resolved: 28 },
  { name: "Academic", complaints: 28, resolved: 25 },
  { name: "Library", complaints: 18, resolved: 16 },
  { name: "Sports", complaints: 12, resolved: 10 },
  { name: "Other", complaints: 21, resolved: 18 },
];

const monthlyData = [
  { month: "Sep", complaints: 22 }, { month: "Oct", complaints: 28 }, { month: "Nov", complaints: 35 },
  { month: "Dec", complaints: 18 }, { month: "Jan", complaints: 30 }, { month: "Feb", complaints: 23 },
];

const statusData = [
  { name: "Resolved", value: 87, color: "hsl(152, 60%, 40%)" },
  { name: "In Progress", value: 34, color: "hsl(210, 80%, 52%)" },
  { name: "Pending", value: 23, color: "hsl(38, 92%, 50%)" },
  { name: "Rejected", value: 12, color: "hsl(0, 72%, 51%)" },
];

const AdminAnalytics = () => (
  <DashboardLayout role="admin">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">System performance and complaint analytics</p>
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

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-card border border-border shadow-card p-5">
          <h3 className="font-display font-bold mb-4">Complaints by Department</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="complaints" fill="hsl(222,60%,18%)" radius={[4,4,0,0]} />
              <Bar dataKey="resolved" fill="hsl(152,60%,40%)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-card border border-border shadow-card p-5">
          <h3 className="font-display font-bold mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="complaints" stroke="hsl(222,60%,18%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border shadow-card p-5 max-w-md">
        <h3 className="font-display font-bold mb-4">Status Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
              {statusData.map((e) => <Cell key={e.name} fill={e.color} />)}
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
    </motion.div>
  </DashboardLayout>
);

export default AdminAnalytics;
