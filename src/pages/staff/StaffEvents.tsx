import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Calendar, Megaphone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const initialEvents = [
  { id: 1, title: "Water Maintenance Schedule", description: "Water supply will be interrupted on Sunday 8:00 AM - 12:00 PM for maintenance in Blocks 3-5.", date: "Feb 26, 2026", type: "Maintenance" },
  { id: 2, title: "Dormitory Room Inspection", description: "Room inspections will be conducted March 1-3. Please ensure rooms are clean and orderly.", date: "Feb 20, 2026", type: "Notice" },
  { id: 3, title: "New Laundry Facility Hours", description: "The laundry facility will now operate from 6:00 AM to 10:00 PM daily.", date: "Feb 15, 2026", type: "Update" },
];

const StaffEvents = () => {
  const [events, setEvents] = useState(initialEvents);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handlePost = () => {
    if (!title || !description) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    setEvents([
      { id: Date.now(), title, description, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), type: "Announcement" },
      ...events,
    ]);
    setTitle("");
    setDescription("");
    toast({ title: "Event Posted", description: "Students in your department will see this announcement." });
  };

  const handleDelete = (id: number) => {
    setEvents(events.filter((e) => e.id !== id));
    toast({ title: "Event Deleted" });
  };

  return (
    <DashboardLayout role="staff">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Events & Announcements</h1>
            <p className="text-sm text-muted-foreground">Post announcements for students in your department</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Post Announcement</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">New Announcement</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div><Label>Title</Label><Input placeholder="Announcement title" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                <div><Label>Description</Label><Textarea placeholder="Details..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} /></div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <DialogClose asChild><Button onClick={handlePost}>Publish</Button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {events.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl bg-card border border-border shadow-card p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-accent" />
                  <h3 className="font-display font-bold text-sm">{e.title}</h3>
                  <Badge variant="outline">{e.type}</Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(e.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
              <p className="text-sm text-foreground mb-2">{e.description}</p>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{e.date}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default StaffEvents;
