import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Trash2, Calendar, Megaphone, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Announcement {
  id: number;
  title: string;
  description: string;
  category: string;
  type: string;
  postedBy: string;
  date: string;
}

const initialAnnouncements: Announcement[] = [
  { id: 1, title: "University-Wide Holiday Notice", description: "The university will be closed on March 5, 2026 for National Day celebrations. All classes and services will resume on March 6.", category: "University", type: "Notice", postedBy: "Admin", date: "Feb 28, 2026" },
  { id: 2, title: "New Student Registration Deadline", description: "All new students must complete registration by March 10, 2026. Late registration will not be accepted.", category: "Academic", type: "Deadline", postedBy: "Admin", date: "Feb 27, 2026" },
  { id: 3, title: "Campus WiFi Upgrade", description: "IT Services will upgrade the campus WiFi infrastructure from March 1-3. Expect intermittent connectivity.", category: "IT Services", type: "Maintenance", postedBy: "IT Staff", date: "Feb 26, 2026" },
  { id: 4, title: "Annual Science Fair 2026", description: "The Annual Science Fair will be held on March 15 at the main auditorium. All departments are encouraged to participate.", category: "Event", type: "Event", postedBy: "Admin", date: "Feb 25, 2026" },
  { id: 5, title: "Scholarship Application Open", description: "Merit-based scholarship applications are now open for Spring 2026. Apply through the student portal before March 20.", category: "Financial", type: "Opportunity", postedBy: "Admin", date: "Feb 24, 2026" },
];

const announcementCategories = ["University", "Academic", "IT Services", "Event", "Financial", "Sports", "Health", "Dormitory", "Cafeteria", "Library", "Club"];
const announcementTypes = ["Notice", "Event", "Maintenance", "Deadline", "Opportunity", "Update", "Alert"];

const typeColor = (type: string) => {
  switch (type) {
    case "Alert": case "Maintenance": return "destructive";
    case "Event": case "Opportunity": return "secondary";
    case "Deadline": return "default";
    default: return "outline";
  }
};

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const { toast } = useToast();

  const handlePost = () => {
    if (!title || !description || !category || !type) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    setAnnouncements([
      { id: Date.now(), title, description, category, type, postedBy: "Admin", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
      ...announcements,
    ]);
    setTitle(""); setDescription(""); setCategory(""); setType("");
    toast({ title: "Announcement Posted", description: "All students will see this announcement." });
  };

  const handleDelete = (id: number) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    toast({ title: "Announcement Deleted" });
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Announcements</h1>
            <p className="text-sm text-muted-foreground">Post and manage university-wide announcements</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />New Announcement</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle className="font-display">Post Announcement</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div><Label>Title</Label><Input placeholder="Announcement title" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                      <SelectContent>{announcementCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                      <SelectContent>{announcementTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Description</Label><Textarea placeholder="Announcement details..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} /></div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <DialogClose asChild><Button onClick={handlePost}>Publish</Button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {announcements.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-card border border-border shadow-card p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-accent" />
                  <h3 className="font-display font-bold text-sm">{a.title}</h3>
                  <Badge variant={typeColor(a.type) as any}>{a.type}</Badge>
                  <Badge variant="outline" className="text-[10px]">{a.category}</Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(a.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <p className="text-sm text-foreground mb-2">{a.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Bell className="w-3 h-3" />Posted by {a.postedBy}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{a.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminAnnouncements;
