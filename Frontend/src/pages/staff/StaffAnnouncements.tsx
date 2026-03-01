import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Plus, Trash2, Calendar, Megaphone, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const API = "http://localhost:5000/api/announcements";

const announcementCategories = ["Academic", "Financial", "Sports", "Health", "Dormitory", "Cafeteria", "Library", "Club", "IT Services"];
const announcementTypes = ["Notice", "Event", "Maintenance", "Deadline", "Update", "Alert"];

const typeColor = (tag: string) => {
  if (["Alert", "Maintenance", "Urgent"].includes(tag)) return "destructive";
  if (["Event", "Opportunity"].includes(tag)) return "secondary";
  if (["Deadline"].includes(tag)) return "default";
  return "outline";
};

const StaffAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const { toast } = useToast();

  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(API, { headers });
      const data = await res.json();
      // Only show announcements created by this staff member
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setAnnouncements(data.filter((a: any) => a.createdBy?._id === user.id));
    } catch {
      toast({ title: "Error", description: "Failed to load announcements", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handlePost = async () => {
    if (!title || !description) {
      toast({ title: "Error", description: "Title and description are required", variant: "destructive" });
      return;
    }
    try {
      const tags = [type, category].filter(Boolean);
      const res = await fetch(API, {
        method: "POST",
        headers,
        body: JSON.stringify({ title, content: description, tags }),
      });
      if (!res.ok) throw new Error("Failed to post");
      toast({ title: "Announcement Published", description: "Students can now see your update." });
      setTitle(""); setDescription(""); setCategory(""); setType("");
      fetchAnnouncements();
    } catch {
      toast({ title: "Error", description: "Could not post announcement", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE", headers });
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      toast({ title: "Removed Successfully" });
    } catch {
      toast({ title: "Error", description: "Could not delete", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout role="staff">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Department Announcements</h1>
            <p className="text-sm text-muted-foreground">Share updates and notices with students</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />New Post</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle className="font-display">Post Announcement</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div><Label>Title</Label><Input placeholder="Headline" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{announcementCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{announcementTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Content</Label><Textarea placeholder="Share details here..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} /></div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Discard</Button></DialogClose>
                <DialogClose asChild><Button onClick={handlePost}>Publish</Button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {loading ? (
             <div className="p-10 text-center text-muted-foreground">Loading...</div>
          ) : announcements.length === 0 ? (
            <div className="rounded-xl bg-card border border-border p-10 text-center text-muted-foreground italic">You haven't posted any announcements yet.</div>
          ) : (
            announcements.map((a, i) => (
              <motion.div key={a._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl bg-card border border-border shadow-sm p-5 hover:border-accent/40 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Megaphone className="w-4 h-4 text-accent" />
                    <h3 className="font-display font-bold text-sm tracking-tight">{a.title}</h3>
                    {a.tags?.map((tag: string) => (
                      <Badge key={tag} variant={typeColor(tag) as any} className="text-[10px] h-4">{tag}</Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(a._id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <p className="text-sm text-foreground/80 mb-3 whitespace-pre-wrap">{a.content}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
                  <span className="flex items-center gap-1"><Bell className="w-3 h-3" />Your posting</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
                    {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default StaffAnnouncements;
