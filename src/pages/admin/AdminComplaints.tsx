import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const allComplaints = [
  { id: "T-1042", student: "Abebe K.", title: "Water supply issue in Block 5", department: "Dormitory", staff: "Meron T.", status: "Pending", date: "Feb 25, 2026" },
  { id: "T-1040", student: "Tigist M.", title: "Broken door lock in Room 108", department: "Dormitory", staff: "Meron T.", status: "In Progress", date: "Feb 24, 2026" },
  { id: "T-1038", student: "Abebe K.", title: "Broken projector in Room 204", department: "Academic", staff: "Hanna L.", status: "In Progress", date: "Feb 23, 2026" },
  { id: "T-1035", student: "Sara B.", title: "Cafeteria food quality concern", department: "Cafeteria", staff: "Yonas G.", status: "Resolved", date: "Feb 20, 2026" },
  { id: "T-1030", student: "Sara B.", title: "Electrical socket not working", department: "Dormitory", staff: "Meron T.", status: "Resolved", date: "Feb 19, 2026" },
  { id: "T-1029", student: "Dawit A.", title: "Library hours extension request", department: "Library", staff: "Biniam K.", status: "Resolved", date: "Feb 18, 2026" },
  { id: "T-1025", student: "Yonas G.", title: "Broken shower in Block 2", department: "Dormitory", staff: "Meron T.", status: "Rejected", date: "Feb 15, 2026" },
];

const statusColor = (s: string) => {
  if (s === "Resolved") return "default";
  if (s === "In Progress") return "secondary";
  if (s === "Pending") return "outline";
  return "destructive";
};

const AdminComplaints = () => {
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = allComplaints.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.student.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === "all" || c.department === filterDept;
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">All Complaints</h1>
          <p className="text-sm text-muted-foreground">Monitor all complaints across departments</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Dormitory">Dormitory</SelectItem>
              <SelectItem value="Cafeteria">Cafeteria</SelectItem>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="Library">Library</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
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
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">ID</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Student</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Department</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Staff</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-mono text-xs">{c.id}</td>
                  <td className="p-4 font-medium">{c.title}</td>
                  <td className="p-4">{c.student}</td>
                  <td className="p-4">{c.department}</td>
                  <td className="p-4">{c.staff}</td>
                  <td className="p-4"><Badge variant={statusColor(c.status) as any}>{c.status}</Badge></td>
                  <td className="p-4 text-muted-foreground">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminComplaints;
