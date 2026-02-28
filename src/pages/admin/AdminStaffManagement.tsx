import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Trash2, Edit, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const initialStaff = [
  { id: 1, name: "Meron Tadesse", email: "meron.t@astu.edu.et", department: "Dormitory", role: "Staff", resolved: 23, pending: 2 },
  { id: 2, name: "Yonas Girma", email: "yonas.g@astu.edu.et", department: "Cafeteria", role: "Staff", resolved: 18, pending: 4 },
  { id: 3, name: "Hanna Lemma", email: "hanna.l@astu.edu.et", department: "Academic", role: "Staff", resolved: 15, pending: 1 },
  { id: 4, name: "Biniam Kebede", email: "biniam.k@astu.edu.et", department: "Library", role: "Staff", resolved: 12, pending: 3 },
  { id: 5, name: "Selam Desta", email: "selam.d@astu.edu.et", department: "Sports", role: "Staff", resolved: 8, pending: 2 },
];

const departments = ["Dormitory", "Cafeteria", "Academic", "Library", "Sports", "Other"];

const AdminStaffManagement = () => {
  const [staff, setStaff] = useState(initialStaff);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDept, setNewDept] = useState("");
  const { toast } = useToast();

  const handleAdd = () => {
    if (!newName || !newEmail || !newDept) {
      toast({ title: "Error", description: "Fill all fields", variant: "destructive" });
      return;
    }
    setStaff([...staff, { id: Date.now(), name: newName, email: newEmail, department: newDept, role: "Staff", resolved: 0, pending: 0 }]);
    setNewName(""); setNewEmail(""); setNewDept("");
    toast({ title: "Staff Added", description: `${newName} has been added to ${newDept}` });
  };

  const handleDelete = (id: number) => {
    setStaff(staff.filter((s) => s.id !== id));
    toast({ title: "Staff Removed" });
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
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Department</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Resolved</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Pending</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="p-4 text-muted-foreground">{s.email}</td>
                  <td className="p-4"><Badge variant="outline">{s.department}</Badge></td>
                  <td className="p-4 text-success font-medium">{s.resolved}</td>
                  <td className="p-4 text-warning font-medium">{s.pending}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminStaffManagement;
