import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Trash2, Users, Edit, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Club {
  id: number;
  name: string;
  description: string;
  coordinator: string;
  members: number;
  status: "Active" | "Inactive";
}

const initialClubs: Club[] = [
  { id: 1, name: "ASTU Robotics Club", description: "Building robots and competing in national competitions", coordinator: "Dr. Tadesse M.", members: 45, status: "Active" },
  { id: 2, name: "Coding Community", description: "Weekly coding challenges, hackathons, and peer programming", coordinator: "Hanna L.", members: 120, status: "Active" },
  { id: 3, name: "Entrepreneurship Club", description: "Fostering startup culture and business ideas among students", coordinator: "Yonas G.", members: 78, status: "Active" },
  { id: 4, name: "Environmental Club", description: "Campus green initiatives and environmental awareness", coordinator: "Sara B.", members: 34, status: "Active" },
  { id: 5, name: "Sports & Fitness Club", description: "Organizing inter-department sports tournaments", coordinator: "Dawit A.", members: 95, status: "Active" },
  { id: 6, name: "Literary & Debate Society", description: "Debates, poetry, and creative writing events", coordinator: "Meron T.", members: 52, status: "Inactive" },
];

const AdminClubs = () => {
  const [clubs, setClubs] = useState(initialClubs);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coordinator, setCoordinator] = useState("");
  const { toast } = useToast();

  const handleAdd = () => {
    if (!name || !description || !coordinator) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    setClubs([{ id: Date.now(), name, description, coordinator, members: 0, status: "Active" }, ...clubs]);
    setName(""); setDescription(""); setCoordinator("");
    toast({ title: "Club Created", description: `${name} has been added successfully.` });
  };

  const handleDelete = (id: number) => {
    setClubs(clubs.filter((c) => c.id !== id));
    toast({ title: "Club Removed" });
  };

  const toggleStatus = (id: number) => {
    setClubs(clubs.map((c) => c.id === id ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } : c));
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Clubs & Communities</h1>
            <p className="text-sm text-muted-foreground">Manage campus clubs and communities</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Club</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">Create New Club</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div><Label>Club Name</Label><Input placeholder="e.g. ASTU Chess Club" value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div><Label>Description</Label><Textarea placeholder="What is this club about?" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
                <div><Label>Coordinator</Label><Input placeholder="Staff/Faculty name" value={coordinator} onChange={(e) => setCoordinator(e.target.value)} /></div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <DialogClose asChild><Button onClick={handleAdd}>Create Club</Button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs.map((club, i) => (
            <motion.div key={club.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-card border border-border shadow-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm">{club.name}</h3>
                    <Badge variant={club.status === "Active" ? "default" : "secondary"} className="text-[10px] mt-0.5">{club.status}</Badge>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{club.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span>Coordinator: {club.coordinator}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{club.members} members</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toggleStatus(club.id)}>
                  {club.status === "Active" ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(club.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminClubs;
