import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const initialComplaints = [
  { id: "T-1042", title: "Water supply issue in Block 5", department: "Dormitory", status: "Pending", date: "Feb 25, 2026", description: "There has been no water supply in Block 5 for the past 2 days." },
  { id: "T-1038", title: "Broken projector in Room 204", department: "Academic", status: "In Progress", date: "Feb 23, 2026", description: "The projector in Room 204 has been broken since last week." },
  { id: "T-1035", title: "Cafeteria food quality concern", department: "Cafeteria", status: "Resolved", date: "Feb 20, 2026", description: "The food served in the cafeteria has been of very poor quality." },
  { id: "T-1029", title: "Library hours extension request", department: "Library", status: "Resolved", date: "Feb 18, 2026", description: "Request to extend library hours during exam period." },
  { id: "T-1025", title: "Broken shower in Block 2", department: "Dormitory", status: "Rejected", date: "Feb 15, 2026", description: "The shower in room 205 Block 2 is leaking badly." },
  { id: "T-1020", title: "No internet in dorm rooms", department: "Dormitory", status: "In Progress", date: "Feb 12, 2026", description: "WiFi has been intermittent for the past week in Block 3." },
];

const categories = [
  "Dormitory", "Cafeteria", "Library", "Sports Office", "Health Center", "IT Services", "Transportation",
  "Electrical Engineering & Computing", "Mechanical, Chemical & Materials Eng.",
  "Civil Engineering and Architecture", "Applied Natural Science",
  "Division of Freshman Program", "Continuing Educations", "Postgraduate Programs", "Other Services",
];

const statusVariant = (status: string) => {
  switch (status) {
    case "Resolved": return "default";
    case "In Progress": return "secondary";
    case "Pending": return "outline";
    case "Rejected": return "destructive";
    default: return "outline";
  }
};

const StudentComplaints = () => {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<typeof initialComplaints[0] | null>(null);
  const { toast } = useToast();

  const filtered = complaints.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSubmit = () => {
    if (!newTitle || !newCategory || !newDescription) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    const newComplaint = {
      id: `T-${1043 + complaints.length}`,
      title: newTitle,
      department: newCategory,
      status: "Pending",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      description: newDescription,
    };
    setComplaints([newComplaint, ...complaints]);
    setNewTitle("");
    setNewCategory("");
    setNewDescription("");
    toast({ title: "Complaint Submitted", description: `Routed to ${newCategory} department` });
  };

  return (
    <DashboardLayout role="student">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">My Complaints</h1>
            <p className="text-sm text-muted-foreground">Submit and track your complaints</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                New Complaint
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display">Submit New Complaint</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Title</Label>
                  <Input placeholder="Brief summary of your issue" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                </div>
                <div>
                  <Label>Department</Label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Describe your issue in detail..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={4} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">Submit</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search complaints..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Complaints list */}
        <div className="rounded-xl bg-card border border-border shadow-card">
          <div className="divide-y divide-border">
            {filtered.map((c) => (
              <div key={c.id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedComplaint(c)}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                    <Badge variant={statusVariant(c.status) as any}>{c.status}</Badge>
                  </div>
                  <p className="font-medium text-sm">{c.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.department} · {c.date}</p>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-10 text-center text-muted-foreground">No complaints found</div>
            )}
          </div>
        </div>

        {/* Detail Dialog */}
        <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{selectedComplaint?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="flex gap-2">
                <Badge variant={statusVariant(selectedComplaint?.status || "") as any}>{selectedComplaint?.status}</Badge>
                <span className="text-xs text-muted-foreground">{selectedComplaint?.id} · {selectedComplaint?.date}</span>
              </div>
              <p className="text-sm text-muted-foreground">Department: {selectedComplaint?.department}</p>
              <p className="text-sm">{selectedComplaint?.description}</p>

              {/* Simple message thread */}
              <div className="mt-4 border-t border-border pt-4">
                <h4 className="font-display font-semibold text-sm mb-3">Conversation</h4>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <span className="font-medium text-xs text-accent">You</span>
                    <p className="mt-1">{selectedComplaint?.description}</p>
                  </div>
                  {selectedComplaint?.status !== "Pending" && (
                    <div className="bg-primary/5 rounded-lg p-3 text-sm">
                      <span className="font-medium text-xs text-primary">Staff</span>
                      <p className="mt-1">Thank you for reporting. We are looking into this issue.</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button size="sm">Send</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
};

export default StudentComplaints;
