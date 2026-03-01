import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Plus, Trash2, Users, Edit, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

interface Club {
  _id: string;
  name: string;
  description: string;
  coordinator: string;
  members_count: number;
  status: "Active" | "Inactive";
}

const AdminClubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coordinator, setCoordinator] = useState("");
  const { toast } = useToast();

  const fetchClubs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/clubs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) setClubs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleAdd = async () => {
    if (!name || !description || !coordinator) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/clubs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ name, description, coordinator, status: "Active" })
      });
      if (res.ok) {
        toast({ title: "Club Created", description: `${name} has been added successfully.` });
        fetchClubs();
        setName(""); setDescription(""); setCoordinator("");
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to create club", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/clubs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        toast({ title: "Club Removed" });
        fetchClubs();
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to remove club", variant: "destructive" });
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      const res = await fetch(`${API_BASE_URL}/api/clubs/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchClubs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <DashboardLayout role="admin"><div className="p-10 text-center">Loading clubs...</div></DashboardLayout>;

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
            <motion.div key={club._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
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
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{club.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span>Coordinator: {club.coordinator}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{club.members_count} members</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toggleStatus(club._id, club.status)}>
                  {club.status === "Active" ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(club._id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </motion.div>
          ))}
          {clubs.length === 0 && <div className="col-span-full p-10 text-center text-muted-foreground">No clubs registered in the system</div>}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminClubs;
