import { API_BASE_URL } from "../../lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Plus, Search, Filter, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Dormitory", "Cafeteria", "Library", "Sports Office", "Health Center", "IT Services", "Transportation",
  "Electrical Engineering & Computing", "Mechanical, Chemical & Materials Eng.",
  "Civil Engineering and Architecture", "Applied Natural Science",
  "Division of Freshman Program", "Continuing Educations", "Postgraduate Programs", "Other Services",
];

const statusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "resolved": return "default";
    case "in_progress": return "secondary";
    case "pending": return "outline";
    case "rejected": return "destructive";
    default: return "outline";
  }
};

const StudentComplaints = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setComplaints(data);
        // If a complaint is selected, update it with fresh data
        if (selectedComplaint) {
          const fresh = data.find((c: any) => c._id === selectedComplaint._id);
          if (fresh) setSelectedComplaint(fresh);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filtered = complaints.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c._id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || (c.status.toLowerCase() === filterStatus.toLowerCase().replace(" ", "_"));
    return matchSearch && matchStatus;
  });

  const handleSubmit = async () => {
    if (!newTitle || !newCategory || !newDescription) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          title: newTitle,
          department: newCategory,
          description: newDescription
        })
      });

      if (res.ok) {
        toast({ title: "Complaint Submitted", description: `Routed to ${newCategory} department` });
        fetchComplaints();
        setNewTitle("");
        setNewCategory("");
        setNewDescription("");
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to submit complaint", variant: "destructive" });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedComplaint) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints/${selectedComplaint._id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ text: message })
      });

      if (res.ok) {
        setMessage("");
        fetchComplaints(); // Reload to get new messages
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    }
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
              <DialogHeader><DialogTitle className="font-display">Submit New Complaint</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div><Label>Title</Label><Input placeholder="Brief summary of your issue" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} /></div>
                <div>
                  <Label>Department</Label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Description</Label><Textarea placeholder="Describe your issue in detail..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={4} /></div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <DialogClose asChild><Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">Submit</Button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search complaints..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          <div className="divide-y divide-border">
            {filtered.map((c) => (
              <div key={c._id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedComplaint(c)}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">{c._id.slice(-6)}</span>
                    <Badge variant={statusColor(c.status) as any}>{c.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="font-medium text-sm">{c.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.department} · {new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            ))}
            {loading && <div className="p-10 text-center text-muted-foreground">Loading your complaints...</div>}
            {!loading && filtered.length === 0 && <div className="p-10 text-center text-muted-foreground">No complaints found</div>}
          </div>
        </div>

        <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">{selectedComplaint?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2">
                <Badge variant={statusVariant(selectedComplaint?.status || "") as any}>{selectedComplaint?.status.replace("_", " ")}</Badge>
                <span className="text-xs text-muted-foreground">{selectedComplaint?._id} · {selectedComplaint && new Date(selectedComplaint.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-muted-foreground">Department: <span className="text-foreground font-medium">{selectedComplaint?.department}</span></p>
              
              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2 block">Original Description</Label>
                <p className="text-sm leading-relaxed">{selectedComplaint?.description}</p>
              </div>

              <div className="mt-6">
                <h4 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-accent" /> Conversation
                </h4>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                  {/* Initial description as first message if no messages yet */}
                  {(!selectedComplaint?.messages || selectedComplaint.messages.length === 0) && (
                    <div className="flex justify-start">
                      <div className="bg-accent/10 rounded-2xl p-3 max-w-[85%] border border-accent/20">
                         <span className="text-[10px] font-bold text-accent uppercase block mb-1">Case Opened</span>
                         <p className="text-sm text-foreground/90 italic">No messages found. Staff will contact you here if they need clarification.</p>
                      </div>
                    </div>
                  )}

                  {selectedComplaint?.messages?.map((msg: any, idx: number) => (
                    <div key={idx} className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}>
                      <div className={`rounded-2xl p-3 max-w-[85%] border ${
                        msg.sender === "student" 
                          ? "bg-accent text-accent-foreground border-accent" 
                          : "bg-muted border-border"
                      }`}>
                         <div className="flex items-center justify-between gap-4 mb-1">
                            <span className="text-[10px] font-bold uppercase">{msg.senderName || msg.sender}</span>
                            <span className="text-[9px] opacity-70">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         </div>
                         <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-end gap-2 mt-4 pt-4 border-t border-border">
                  <Textarea 
                    placeholder="Type your message..." 
                    className="min-h-[80px] resize-none" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button size="icon" className="h-10 w-10 shrink-0" onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
};

const statusColor = (s: string) => {
  switch (s.toLowerCase()) {
    case "resolved": return "default";
    case "in_progress": return "secondary";
    case "pending": return "outline";
    case "rejected": return "destructive";
    default: return "outline";
  }
};

export default StudentComplaints;
