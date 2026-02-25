import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Filter, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const initialTickets = [
  { id: "T-1042", student: "Abebe K.", studentId: "ASTU/2023/0456", title: "Water supply issue in Block 5", status: "Pending", date: "Feb 25, 2026", dorm: "Block 5, Room 312", description: "There has been no water supply in Block 5 for the past 2 days." },
  { id: "T-1040", student: "Tigist M.", studentId: "ASTU/2022/0321", title: "Broken door lock in Room 108", status: "In Progress", date: "Feb 24, 2026", dorm: "Block 1, Room 108", description: "The door lock has been broken and cannot be secured." },
  { id: "T-1037", student: "Dawit A.", studentId: "ASTU/2024/0789", title: "No hot water in Block 3", status: "Pending", date: "Feb 22, 2026", dorm: "Block 3, Room 205", description: "Hot water has not been available for the past week." },
  { id: "T-1030", student: "Sara B.", studentId: "ASTU/2023/0654", title: "Electrical socket not working", status: "Resolved", date: "Feb 19, 2026", dorm: "Block 2, Room 401", description: "The electrical socket near the bed is not working." },
  { id: "T-1027", student: "Yonas G.", studentId: "ASTU/2022/0112", title: "Window glass broken", status: "Rejected", date: "Feb 17, 2026", dorm: "Block 4, Room 102", description: "Window glass is cracked and needs replacement." },
];

const statusColor = (s: string) => {
  if (s === "Resolved") return "default";
  if (s === "In Progress") return "secondary";
  if (s === "Pending") return "outline";
  return "destructive";
};

const StaffTickets = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<typeof initialTickets[0] | null>(null);
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const filtered = tickets.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.student.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, newStatus: string) => {
    setTickets(tickets.map((t) => t.id === id ? { ...t, status: newStatus } : t));
    toast({ title: "Status Updated", description: `Ticket ${id} marked as ${newStatus}` });
    setSelectedTicket(null);
  };

  return (
    <DashboardLayout role="staff">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">Assigned Tickets</h1>
          <p className="text-sm text-muted-foreground">Manage complaints assigned to your department</p>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search tickets..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
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

        <div className="rounded-xl bg-card border border-border shadow-card">
          <div className="divide-y divide-border">
            {filtered.map((t) => (
              <div key={t.id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedTicket(t)}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{t.id}</span>
                    <Badge variant={statusColor(t.status) as any}>{t.status}</Badge>
                  </div>
                  <p className="font-medium text-sm">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">By {t.student} · {t.dorm} · {t.date}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedTicket(t); }}>Respond</Button>
                  {t.status !== "Resolved" && (
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); updateStatus(t.id, "Resolved"); }}>Resolve</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket detail dialog */}
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">{selectedTicket?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="flex gap-2 items-center">
                <Badge variant={statusColor(selectedTicket?.status || "") as any}>{selectedTicket?.status}</Badge>
                <span className="text-xs text-muted-foreground">{selectedTicket?.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="text-muted-foreground">Student:</span> {selectedTicket?.student}</p>
                <p><span className="text-muted-foreground">ID:</span> {selectedTicket?.studentId}</p>
                <p><span className="text-muted-foreground">Dorm:</span> {selectedTicket?.dorm}</p>
                <p><span className="text-muted-foreground">Date:</span> {selectedTicket?.date}</p>
              </div>
              <p className="text-sm border-t border-border pt-3">{selectedTicket?.description}</p>

              {/* Conversation */}
              <div className="border-t border-border pt-3">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> Conversation</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  <div className="bg-muted/50 rounded-lg p-2.5 text-sm">
                    <span className="text-xs font-medium text-accent">Student</span>
                    <p className="mt-0.5 text-xs">{selectedTicket?.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Textarea placeholder="Type your response..." value={response} onChange={(e) => setResponse(e.target.value)} rows={2} className="flex-1" />
                </div>
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => selectedTicket && updateStatus(selectedTicket.id, "Rejected")}>Reject</Button>
              <Button variant="outline" size="sm" onClick={() => selectedTicket && updateStatus(selectedTicket.id, "In Progress")}>Mark In Progress</Button>
              <Button size="sm" onClick={() => {
                if (selectedTicket) updateStatus(selectedTicket.id, "Resolved");
                setResponse("");
              }}>Resolve</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
};

export default StaffTickets;
