import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const departments = [
  "Dormitory", "Cafeteria", "Library", "Sports Office", "Health Center", "IT Services", "Transportation",
  "Electrical Engineering & Computing", "Mechanical, Chemical & Materials Eng.",
  "Civil Engineering and Architecture", "Applied Natural Science",
  "Division of Freshman Program", "Continuing Educations", "Postgraduate Programs", "Other Services",
];

const AdminStaffManagement = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("Admin@1234");
  const [newDept, setNewDept] = useState("");
  const { toast } = useToast();

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/users/staff", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setStaff(data);
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to fetch staff", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAdd = async () => {
    if (!newName || !newEmail || !newDept) {
      toast({ title: "Error", description: "Fill all fields", variant: "destructive" });
      return;
    }
    
    try {
      const res = await fetch("/api/users/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          department: newDept
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Staff Added", description: `${newName} has been added to ${newDept}` });
        fetchStaff();
        setNewName(""); setNewEmail(""); setNewDept("");
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to add staff", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (res.ok) {
        toast({ title: "Staff Removed" });
        fetchStaff();
      } else {
        const data = await res.json();
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to remove staff", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Staff Management</h1>
            <p className="text-sm text-muted-foreground">Add, remove, and manage staff accounts</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Staff</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">Add New Staff</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div><Label>Full Name</Label><Input placeholder="Staff name" value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
                <div><Label>Email</Label><Input placeholder="email@astu.edu.et" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} /></div>
                <div><Label>Temporary Password</Label><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
                <div>
                  <Label>Department</Label>
                  <Select value={newDept} onValueChange={setNewDept}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <DialogClose asChild><Button onClick={handleAdd}>Add Staff</Button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-muted-foreground">Loading staff data...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Department</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-center">Resolved</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-center">Pending</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {staff.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium">{s.name}</td>
                    <td className="p-4 text-muted-foreground">{s.email}</td>
                    <td className="p-4"><Badge variant="outline">{s.department}</Badge></td>
                    <td className="p-4 text-success font-medium text-center">{s.resolved}</td>
                    <td className="p-4 text-warning font-medium text-center">{s.pending}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {staff.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-muted-foreground">No staff members found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminStaffManagement;
