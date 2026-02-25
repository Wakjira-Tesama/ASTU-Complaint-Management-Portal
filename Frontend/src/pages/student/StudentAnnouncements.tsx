import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Bell, Calendar, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const announcements = [
  { id: 1, title: "Water Maintenance Scheduled", department: "Dormitory", date: "Feb 26, 2026", description: "Water supply will be interrupted on Sunday from 8:00 AM to 12:00 PM for maintenance in Blocks 3-5.", type: "Maintenance" },
  { id: 2, title: "Mid-term Exam Schedule Published", department: "Academic", date: "Feb 24, 2026", description: "The mid-term examination schedule for Spring 2026 has been published. Please check the academic portal.", type: "Academic" },
  { id: 3, title: "Cafeteria Menu Update", department: "Cafeteria", date: "Feb 22, 2026", description: "New healthy menu options are now available in the main cafeteria. Vegetarian options expanded.", type: "Update" },
  { id: 4, title: "Library Extended Hours During Exams", department: "Library", date: "Feb 20, 2026", description: "The library will be open from 6:00 AM to midnight during the exam period (March 1-15).", type: "Service" },
  { id: 5, title: "Sports Tournament Registration Open", department: "Sports", date: "Feb 18, 2026", description: "Registration for the inter-department sports tournament is now open. Deadline: March 5.", type: "Event" },
  { id: 6, title: "Dormitory Room Inspection", department: "Dormitory", date: "Feb 15, 2026", description: "Room inspections will be conducted from March 1-3. Please ensure rooms are clean and orderly.", type: "Notice" },
];

const typeColor = (type: string) => {
  switch (type) {
    case "Maintenance": return "destructive";
    case "Academic": return "default";
    case "Event": return "secondary";
    default: return "outline";
  }
};

const StudentAnnouncements = () => (
  <DashboardLayout role="student">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold">Announcements</h1>
        <p className="text-sm text-muted-foreground">Stay updated with the latest from your departments</p>
      </div>

      <div className="space-y-4">
        {announcements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-card border border-border shadow-card p-5 hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-accent" />
                <h3 className="font-display font-bold text-sm">{a.title}</h3>
              </div>
              <Badge variant={typeColor(a.type) as any}>{a.type}</Badge>
            </div>
            <p className="text-sm text-foreground mb-2">{a.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Bell className="w-3 h-3" />{a.department}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{a.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </DashboardLayout>
);

export default StudentAnnouncements;
