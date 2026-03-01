import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Bell, Calendar, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

const typeColor = (type: string) => {
  switch (type) {
    case "Maintenance": return "destructive";
    case "Academic": return "default";
    case "Event": return "secondary";
    default: return "outline";
  }
};

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/announcements", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch announcements");
        const data = await res.json();
        setAnnouncements(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <DashboardLayout role="student">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">Announcements</h1>
          <p className="text-sm text-muted-foreground">Stay updated with the latest from your departments</p>
        </div>

        {loading && <p className="text-muted-foreground">Loading announcements...</p>}
        {error && <p className="text-destructive">{error}</p>}

        <div className="space-y-4">
          {!loading && announcements.length === 0 && (
            <div className="rounded-xl bg-card border border-border p-10 text-center text-muted-foreground">
              No announcements yet
            </div>
          )}
          {announcements.map((a, i) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-card border border-border shadow-card p-5 hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-accent" />
                  <h3 className="font-display font-bold text-sm">{a.title}</h3>
                </div>
                {a.tags && a.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
              <p className="text-sm text-foreground mb-2">{a.content}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Bell className="w-3 h-3" />
                  {a.createdBy?.name || "Admin"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default StudentAnnouncements;
