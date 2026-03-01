import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { TrendingUp, Clock, CheckCircle2, AlertTriangle, MessageSquare, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { API_BASE_URL } from "@/lib/api";

const iconMap: Record<string, any> = {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Users
};

const COLORS = ["hsl(152, 60%, 40%)", "hsl(210, 80%, 52%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)"];

const AdminAnalytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/analytics/admin`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const json = await res.json();
        if (res.ok) setData(json);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <DashboardLayout role="admin"><div className="p-10 text-center">Loading analytics...</div></DashboardLayout>;

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">System performance and complaint analytics</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {data?.summary.map((s: any) => {
            const Icon = iconMap[s.icon] || TrendingUp;
            return (
              <div key={s.label} className="p-5 rounded-xl bg-card border border-border shadow-card">
                <Icon className={`w-5 h-5 mb-2 ${s.color}`} />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <h3 className="font-display font-bold mb-4">Complaints by Department</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data?.deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="complaints" fill="hsl(222,60%,18%)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <h3 className="font-display font-bold mb-4">Monthly Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data?.monthlyData}>
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
              <Pie data={data?.statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name">
                {data?.statusData.map((_e: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {data?.statusData.map((s: any, index: number) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                <span className="text-muted-foreground uppercase">{s.name}</span>
                <span className="ml-auto font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
