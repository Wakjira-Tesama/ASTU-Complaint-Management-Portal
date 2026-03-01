import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, Filter, MessageSquare, Send, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { API_BASE_URL } from "../../lib/api";

const StaffTickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setTickets(data);
        if (selectedTicket) {
          const fresh = data.find((t: any) => t._id === selectedTicket._id);
          if (fresh) setSelectedTicket(fresh);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filtered = tickets.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                      (t.student?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || (t.status.toLowerCase() === filterStatus.toLowerCase().replace(" ", "_"));
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast({ title: "Status Updated", description: `Marked as ${newStatus.replace("_", " ")}` });
        fetchTickets();
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleSendMessage = async () => {
    if (!response.trim() || !selectedTicket) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints/${selectedTicket._id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ text: response })
      });

      if (res.ok) {
        // Automatically set to In Progress if it was pending
        if (selectedTicket.status === "pending") {
           await handleUpdateStatus(selectedTicket._id, "in_progress");
        }
        setResponse("");
        fetchTickets();
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    }
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

  return (
    <DashboardLayout role="staff">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">Assigned Tickets</h1>
          <p className="text-sm text-muted-foreground">Manage and respond to student complaints</p>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search tickets or students..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
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
            {filtered.map((t) => (
              <div key={t._id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedTicket(t)}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">{t._id.slice(-6)}</span>
                    <Badge variant={statusColor(t.status) as any}>{t.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="font-medium text-sm">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">By {t.student?.name || "Anonymous"} · {new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Respond</Button>
                  {t.status !== "resolved" && (
                     <Button size="sm" onClick={(e) => { e.stopPropagation(); handleUpdateStatus(t._id, "resolved"); }}>Resolve</Button>
                  )}
                </div>
              </div>
            ))}
            {loading && <div className="p-10 text-center text-muted-foreground">Fetching tickets...</div>}
            {!loading && filtered.length === 0 && <div className="p-10 text-center text-muted-foreground">No tickets assigned to your department</div>}
          </div>
        </div>

        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">{selectedTicket?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={statusColor(selectedTicket?.status || "") as any}>{selectedTicket?.status.replace("_", " ")}</Badge>
                  <span className="text-xs text-muted-foreground">{selectedTicket?._id}</span>
                </div>
                <div className="flex gap-1">
                   <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={() => handleUpdateStatus(selectedTicket._id, "pending")}>Pending</Button>
                   <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={() => handleUpdateStatus(selectedTicket._id, "in_progress")}>In Progress</Button>
                   <Button variant="ghost" size="sm" className="h-7 text-[10px] text-destructive" onClick={() => handleUpdateStatus(selectedTicket._id, "rejected")}>Reject</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border">
                <div>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase">Student</p>
                   <p className="text-sm font-medium">{selectedTicket?.student?.name || "Anonymous"}</p>
                   <p className="text-xs text-muted-foreground">{selectedTicket?.student?.email}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase">Submitted</p>
                   <p className="text-sm font-medium">{selectedTicket && new Date(selectedTicket.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4">
                 <Label className="text-xs text-muted-foreground uppercase font-bold mb-2 block">Problem Description</Label>
                 <p className="text-sm leading-relaxed">{selectedTicket?.description}</p>
              </div>

              <div className="mt-6">
                <h4 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" /> Conversation History
                </h4>
                
                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
                   {selectedTicket?.messages?.length === 0 && (
                      <div className="text-center py-6 border-2 border-dashed border-border rounded-xl">
                         <p className="text-xs text-muted-foreground">No messages yet. Send a clarification question to the student.</p>
                      </div>
                   )}
                   {selectedTicket?.messages?.map((msg: any, idx: number) => (
                    <div key={idx} className={`flex ${msg.sender === "staff" ? "justify-end" : "justify-start"}`}>
                      <div className={`rounded-2xl p-3 max-w-[85%] border ${
                        msg.sender === "staff" 
                          ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                          : "bg-muted border-border"
                      }`}>
                         <div className="flex items-center justify-between gap-4 mb-1">
                            <span className="text-[10px] font-bold uppercase">{msg.sender === "staff" ? "You" : (selectedTicket.student?.name || "Student")}</span>
                            <span className="text-[9px] opacity-70">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                         </div>
                         <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-2">
                   <Textarea 
                      placeholder="Ask the student for more details or provide an update..." 
                      className="min-h-[100px] resize-none"
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                   />
                   <div className="flex justify-between items-center">
                      <p className="text-[10px] text-muted-foreground italic">Sending a message will mark ticket as "In Progress"</p>
                      <Button onClick={handleSendMessage} disabled={!response.trim()}>
                        <Send className="w-4 h-4 mr-2" /> Send Response
                      </Button>
                   </div>
                </div>
              </div>
            </div>
            <DialogFooter className="border-t border-border pt-4">
               <Button className="w-full bg-success hover:bg-success/90 text-white" onClick={() => handleUpdateStatus(selectedTicket._id, "resolved")}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Resolve Ticket
               </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
};

export default StaffTickets;
