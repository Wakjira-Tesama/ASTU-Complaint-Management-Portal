import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";

const iconMap: Record<string, any> = {
  MessageSquare,
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
};

const COLORS = ["hsl(152, 60%, 40%)", "hsl(210, 80%, 52%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)"];

import { API_BASE_URL } from "../lib/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      
      const [analyticsRes, staffRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/analytics/admin`, { headers }),
        fetch(`${API_BASE_URL}/api/users/staff`, { headers })
      ]);

      const analyticsData = await analyticsRes.json();
      const staffData = await staffRes.json();

      if (analyticsRes.ok) setStats(analyticsData);
      if (staffRes.ok) setStaff(staffData.slice(0, 4));
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <DashboardLayout role="admin"><div className="p-10 text-center">Loading dashboard...</div></DashboardLayout>;

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">System overview and performance metrics</p>
          </div>
          <Link to="/admin/staff">
            <Button>
              <Users className="w-4 h-4 mr-2" />
              Manage Staff
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats?.summary.map((s: any) => {
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

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Bar chart */}
          <div className="lg:col-span-2 rounded-xl bg-card border border-border shadow-card p-5">
            <h3 className="font-display font-bold mb-4">Complaints by Department</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats?.deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
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
                <Pie data={stats?.statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name">
                  {stats?.statusData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1 text-[10px] uppercase tracking-wider font-semibold">
              {stats?.statusData.map((s: any, index: number) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="ml-auto font-bold">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Staff performance */}
        <div className="rounded-xl bg-card border border-border shadow-card">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-bold">Staff Performance</h3>
            <Link to="/admin/staff">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {staff.map((s) => (
              <div key={s.id} className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.department}</p>
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
            {staff.length === 0 && <div className="p-10 text-center text-muted-foreground">No staff data available</div>}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
