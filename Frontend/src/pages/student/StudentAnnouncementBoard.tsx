import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Bell, Calendar, Megaphone, Users, Shield, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

const sourceIcon = (source: string) => {
  if (source === "Admin" || source?.toLowerCase().includes("admin")) return <Shield className="w-3 h-3" />;
  if (source?.includes("Club") || source?.includes("Community")) return <Users className="w-3 h-3" />;
  return <Bell className="w-3 h-3" />;
};

const StudentAnnouncementBoard = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

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

  const filtered = announcements.filter((a) => {
    const posterName: string = a.createdBy?.name || "Admin";
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.content || "").toLowerCase().includes(search.toLowerCase());
    const matchTab =
      tab === "all" ||
      (tab === "admin" && posterName.toLowerCase() === "admin") ||
      (tab === "staff" && posterName.toLowerCase().includes("staff")) ||
      (tab === "clubs" && (posterName.includes("Club") || posterName.includes("Community")));
    return matchSearch && matchTab;
  });

  return (
    <DashboardLayout role="student">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">Announcement Board</h1>
          <p className="text-sm text-muted-foreground">All announcements from admin, staff, and campus clubs</p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search announcements..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading && <p className="text-muted-foreground">Loading announcements...</p>}
        {error && <p className="text-destructive">{error}</p>}

        <div className="space-y-4">
          {!loading && filtered.length === 0 && (
            <div className="rounded-xl bg-card border border-border p-10 text-center text-muted-foreground">
              No announcements found
            </div>
          )}
          {filtered.map((a, i) => {
            const posterName = a.createdBy?.name || "Admin";
            return (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl bg-card border border-border shadow-card p-5 hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Megaphone className="w-4 h-4 text-accent" />
                    <h3 className="font-display font-bold text-sm">{a.title}</h3>
                    {a.tags?.map((tag: string) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-foreground mb-3">{a.content}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    {sourceIcon(posterName)} {posterName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default StudentAnnouncementBoard;
