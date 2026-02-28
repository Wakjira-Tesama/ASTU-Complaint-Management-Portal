import DashboardLayout from "@/components/DashboardLayout";
import AIChatWidget from "@/components/AIChatWidget";
import { motion } from "framer-motion";
import { 
  Plus, Clock, CheckCircle2, AlertCircle, MessageSquare, 
  Calendar, Users, Megaphone, ArrowRight, Sparkles,
  TrendingUp, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../lib/api";

const StudentDashboard = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
        
        // Parallel fetching of all dashboard data
        const [complaintsRes, userRes, annRes, eventRes, clubRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/complaints`, { headers }),
          fetch(`${API_BASE_URL}/api/auth/me`, { headers }).catch(() => null),
          fetch(`${API_BASE_URL}/api/announcements`, { headers }),
          fetch(`${API_BASE_URL}/api/events`, { headers }),
          fetch(`${API_BASE_URL}/api/clubs`, { headers })
        ]);

        const [complaints, announcementsData, eventsData, clubsData] = await Promise.all([
          complaintsRes.json(),
          annRes.json(),
          eventRes.json(),
          clubRes.json()
        ]);

        if (complaintsRes.ok) {
          const total = complaints.length;
          const pending = complaints.filter((c: any) => c.status === "pending").length;
          const resolved = complaints.filter((c: any) => c.status === "resolved").length;

          const statsData = [
            { label: "Total Complaints", value: total.toString(), icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Pending", value: pending.toString(), icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "Resolved", value: resolved.toString(), icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Activity", value: "High", icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10" },
          ];
          setStats(statsData as any);
          setRecent(complaints.slice(0, 3));
        }

        if (annRes.ok && Array.isArray(announcementsData)) setAnnouncements(announcementsData.slice(0, 3));
        if (eventRes.ok && Array.isArray(eventsData)) setEvents(eventsData.slice(0, 2));
        if (clubRes.ok && Array.isArray(clubsData)) setClubs(clubsData.slice(0, 3));

        const userString = localStorage.getItem("user");
        if (userString) {
          const userData = JSON.parse(userString);
          if (userData.name) setUserName(userData.name.split(" ")[0]);
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
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

  if (loading) return (
    <DashboardLayout role="student">
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse font-display text-lg">Preparing your Student Hub...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout role="student">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Personalized Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="relative overflow-hidden rounded-[2.5rem] bg-hero p-8 md:p-12 mb-10 text-primary-foreground shadow-2xl shadow-accent/20"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-accent/20 backdrop-blur-md">
                  <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                </div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">ASTU Student Hub</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tight leading-[1.1]">
                Hello, <span className="text-accent">{userName}</span>!
              </h1>
              <p className="text-primary-foreground/80 md:text-lg leading-relaxed opacity-90 max-w-lg">
                Your simplified campus experience starts here. Explore announcements, track complaints, and discover communities.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/student/complaints">
                <Button size="lg" className="h-14 bg-accent text-accent-foreground hover:bg-white hover:text-primary transition-all duration-500 rounded-2xl px-10 shadow-xl shadow-accent/30 font-bold text-lg group">
                  <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                  New Complaint
                </Button>
              </Link>
            </div>
          </div>
          {/* Advanced Decorative Elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/30 rounded-full blur-[80px] -ml-24 -mb-24" />
        </motion.div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((s, i) => (
            <motion.div 
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-3xl bg-card border border-border/50 shadow-card hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500"
            >
              <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center mb-6 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
                <s.icon className={`w-7 h-7 ${s.color}`} />
              </div>
              <p className="text-4xl font-bold tracking-tighter mb-1">{s.value}</p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.15em]">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10 mb-12">
          {/* Announcements Feed Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                <Megaphone className="w-6 h-6 text-accent" />
                Campus Global Updates
              </h2>
              <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10 font-bold group px-4">
                View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="grid gap-6">
              {announcements.map((ann, i) => (
                <motion.div 
                  key={ann._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative p-6 rounded-[2rem] bg-card border border-border/40 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-muted/40 border border-border min-w-[85px] h-[85px] group-hover:bg-accent/5 group-hover:border-accent/20 transition-colors">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70 tracking-widest">{new Date(ann.createdAt).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-2xl font-bold leading-none mt-1">{new Date(ann.createdAt).getDate()}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {ann.tags?.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-[9px] font-bold px-3 py-1 rounded-full bg-accent/5 text-accent border-none">
                            #{tag.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="font-bold text-xl mb-2 group-hover:text-accent transition-colors leading-snug">{ann.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed opacity-85">
                        {ann.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {announcements.length === 0 && (
                <div className="py-20 text-center rounded-[2.5rem] border-2 border-dashed border-muted/30">
                  <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-10" />
                  <p className="text-muted-foreground font-medium">Listening for campus updates...</p>
                </div>
              )}
            </div>
          </div>

          {/* Events Sidebar Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-display font-bold flex items-center gap-3">
              <Calendar className="w-6 h-6 text-accent" />
              What's Happening
            </h2>
            <div className="grid gap-5">
              {events.map((event, i) => (
                <motion.div 
                  key={event._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-6 rounded-[2rem] border border-border/50 bg-card hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                      {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long' })}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-2 leading-tight group-hover:text-accent transition-colors">{event.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-5 opacity-80 leading-relaxed">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between pt-5 border-t border-border/50">
                    <span className="text-xs font-bold text-accent">
                      {new Date(event.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <Button variant="ghost" size="sm" className="h-9 text-[10px] font-bold uppercase tracking-widest px-4 rounded-xl hover:bg-accent/10">
                      Add to Calendar
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Interactive Campus Card */}
            <div className="mt-6 p-8 rounded-[2.5rem] bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white shadow-2xl relative overflow-hidden group cursor-pointer" onClick={() => window.location.href = '/student/complaints'}>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
                  <Activity className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 tracking-tight">Need AI Help?</h3>
                <p className="text-xs opacity-60 mb-6 leading-relaxed max-w-[200px]">Ask our virtual assistant anything about campus policies or ticket updates.</p>
                <div className="inline-flex items-center text-accent text-xs font-bold uppercase tracking-widest gap-2 bg-accent/10 py-2.5 px-5 rounded-full hover:bg-accent/20 transition-all duration-300">
                  Join Chat <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>
        </div>

        {/* Discovery Sections (Clubs) */}
        <div className="mb-14 pt-10 border-t border-border/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                <Users className="w-6 h-6 text-accent" />
                Explore Student Communities
              </h2>
              <p className="text-sm text-muted-foreground mt-1 font-medium opacity-70 tracking-wide">Find your passion and connect with peers</p>
            </div>
            <Button variant="ghost" className="text-accent font-bold hover:bg-accent/5 rounded-2xl px-6">
              Browse All Communities
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {clubs.map((club, i) => (
              <motion.div 
                key={club._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="group p-8 rounded-[2.2rem] bg-card/40 border border-border/40 hover:border-accent/40 hover:bg-card hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-[1.2rem] bg-accent/5 flex items-center justify-center text-accent font-bold text-xl border border-accent/10">
                    {club.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg group-hover:text-accent transition-colors leading-tight">{club.name}</h4>
                    <span className="text-[9px] text-accent/80 uppercase font-black tracking-widest mt-1 inline-block py-0.5 px-2 bg-accent/5 rounded-md">{club.status}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed opacity-85">
                  {club.description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{club.coordinator}</span>
                  </div>
                  <Button variant="link" size="sm" className="text-accent font-black p-0 h-auto uppercase tracking-widest text-[10px]">Learn More</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity Footnote */}
        <div className="relative pt-10 border-t border-border/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold flex items-center gap-3">
              <Activity className="w-6 h-6 text-accent" />
              Your Recent Activity
            </h2>
            <Link to="/student/complaints">
              <Button variant="outline" size="sm" className="rounded-xl border-border/60 font-bold px-6">
                History
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {recent.map((c, i) => (
              <motion.div 
                key={c._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="p-7 rounded-[2rem] bg-card border border-border/40 hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-mono font-black text-muted-foreground inline-block py-1 px-3 bg-muted/50 rounded-lg">{c._id.slice(-6).toUpperCase()}</span>
                  <Badge variant={statusVariant(c.status) as any} className="text-[9px] font-black tracking-widest px-3 h-6 rounded-full uppercase">
                    {c.status.replace("_", " ")}
                  </Badge>
                </div>
                <h4 className="font-bold text-base mb-2 line-clamp-1 group-hover:text-accent transition-colors tracking-tight">{c.title}</h4>
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase opacity-70 mb-5">
                  <span>{c.department}</span>
                  <span>•</span>
                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <Link to="/student/complaints">
                  <Button variant="outline" className="w-full text-[10px] font-black h-11 rounded-xl border-accent/20 text-accent hover:bg-accent hover:text-white transition-all tracking-[0.2em] uppercase">
                    Full Tracking Details
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AIChatWidget />
    </DashboardLayout>
  );
};

export default StudentDashboard;
