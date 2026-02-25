import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Bell, Calendar, Megaphone, Users, Shield, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const allAnnouncements = [
  { id: 1, title: "University-Wide Holiday Notice", source: "Admin", category: "University", date: "Feb 28, 2026", description: "The university will be closed on March 5, 2026 for National Day celebrations.", type: "Notice" },
  { id: 2, title: "Annual Science Fair 2026", source: "Admin", category: "Event", date: "Feb 25, 2026", description: "The Annual Science Fair will be held on March 15 at the main auditorium. All departments are encouraged to participate.", type: "Event" },
  { id: 3, title: "Water Maintenance Scheduled", source: "Dormitory Staff", category: "Dormitory", date: "Feb 26, 2026", description: "Water supply will be interrupted on Sunday from 8:00 AM to 12:00 PM for maintenance in Blocks 3-5.", type: "Maintenance" },
  { id: 4, title: "Mid-term Exam Schedule Published", source: "Academic Staff", category: "Academic", date: "Feb 24, 2026", description: "The mid-term examination schedule for Spring 2026 has been published. Please check the academic portal.", type: "Academic" },
  { id: 5, title: "Scholarship Application Open", source: "Admin", category: "Financial", date: "Feb 24, 2026", description: "Merit-based scholarship applications are now open for Spring 2026. Apply through the student portal before March 20.", type: "Opportunity" },
  { id: 6, title: "Coding Hackathon 2026", source: "Coding Community", category: "Club", date: "Feb 23, 2026", description: "Join us for a 24-hour hackathon on March 8! Open to all students. Prizes for top 3 teams.", type: "Event" },
  { id: 7, title: "Cafeteria Menu Update", source: "Cafeteria Staff", category: "Cafeteria", date: "Feb 22, 2026", description: "New healthy menu options are now available in the main cafeteria. Vegetarian options expanded.", type: "Update" },
  { id: 8, title: "Robotics Competition Tryouts", source: "ASTU Robotics Club", category: "Club", date: "Feb 21, 2026", description: "Tryouts for the national robotics competition team. Meet at Lab 302 on March 2 at 3:00 PM.", type: "Event" },
  { id: 9, title: "Library Extended Hours During Exams", source: "Library Staff", category: "Library", date: "Feb 20, 2026", description: "The library will be open from 6:00 AM to midnight during the exam period (March 1-15).", type: "Service" },
  { id: 10, title: "Campus WiFi Upgrade", source: "IT Staff", category: "IT Services", date: "Feb 19, 2026", description: "IT Services will upgrade the campus WiFi infrastructure from March 1-3. Expect intermittent connectivity.", type: "Maintenance" },
  { id: 11, title: "Environmental Cleanup Day", source: "Environmental Club", category: "Club", date: "Feb 18, 2026", description: "Join the campus cleanup initiative on Feb 28. Meeting point: Main Gate at 8:00 AM.", type: "Event" },
  { id: 12, title: "Sports Tournament Registration", source: "Sports & Fitness Club", category: "Sports", date: "Feb 17, 2026", description: "Registration for the inter-department sports tournament is now open. Deadline: March 5.", type: "Event" },
];

const typeColor = (type: string) => {
  switch (type) {
    case "Maintenance": case "Alert": return "destructive";
    case "Event": case "Opportunity": return "secondary";
    case "Academic": case "Notice": return "default";
    default: return "outline";
  }
};

const sourceIcon = (source: string) => {
  if (source === "Admin") return <Shield className="w-3 h-3" />;
  if (source.includes("Club") || source.includes("Community")) return <Users className="w-3 h-3" />;
  return <Bell className="w-3 h-3" />;
};

const StudentAnnouncementBoard = () => {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [tab, setTab] = useState("all");

  const filtered = allAnnouncements.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || a.category === filterCategory;
    const matchTab = tab === "all" ||
      (tab === "admin" && a.source === "Admin") ||
      (tab === "staff" && a.source.includes("Staff")) ||
      (tab === "clubs" && (a.source.includes("Club") || a.source.includes("Community")));
    return matchSearch && matchCategory && matchTab;
  });

  const categories = [...new Set(allAnnouncements.map((a) => a.category))];

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
            <Input placeholder="Search announcements..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="rounded-xl bg-card border border-border p-10 text-center text-muted-foreground">No announcements found</div>
          )}
          {filtered.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="rounded-xl bg-card border border-border shadow-card p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Megaphone className="w-4 h-4 text-accent" />
                  <h3 className="font-display font-bold text-sm">{a.title}</h3>
                  <Badge variant={typeColor(a.type) as any}>{a.type}</Badge>
                  <Badge variant="outline" className="text-[10px]">{a.category}</Badge>
                </div>
              </div>
              <p className="text-sm text-foreground mb-3">{a.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">{sourceIcon(a.source)} {a.source}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{a.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default StudentAnnouncementBoard;
