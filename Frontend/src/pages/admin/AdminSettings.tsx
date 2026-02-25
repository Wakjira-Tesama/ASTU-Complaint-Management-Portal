import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Save, Bell, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  const [emailNotif, setEmailNotif] = useState(true);
  const [autoAssign, setAutoAssign] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">System configuration and preferences</p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* General */}
          <div className="rounded-xl bg-card border border-border shadow-card p-6">
            <h3 className="font-display font-bold mb-4 flex items-center gap-2"><Shield className="w-4 h-4" /> General Settings</h3>
            <div className="space-y-4">
              <div><Label>University Name</Label><Input value="Adama Science and Technology University" /></div>
              <div><Label>Admin Email</Label><Input value="admin@astu.edu.et" /></div>
              <div><Label>System Title</Label><Input value="Smart Complaint Management System" /></div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl bg-card border border-border shadow-card p-6">
            <h3 className="font-display font-bold mb-4 flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><Label>Email Notifications</Label><p className="text-xs text-muted-foreground">Send email when new complaint is submitted</p></div>
                <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Auto-assign Tickets</Label><p className="text-xs text-muted-foreground">Automatically assign tickets to available staff</p></div>
                <Switch checked={autoAssign} onCheckedChange={setAutoAssign} />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="rounded-xl bg-card border border-border shadow-card p-6">
            <h3 className="font-display font-bold mb-4 flex items-center gap-2"><Palette className="w-4 h-4" /> Appearance</h3>
            <div className="flex items-center justify-between">
              <div><Label>Dark Mode</Label><p className="text-xs text-muted-foreground">Switch between light and dark themes</p></div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </div>

          <Button onClick={() => toast({ title: "Settings Saved" })} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Save className="w-4 h-4 mr-2" />Save Settings
          </Button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminSettings;
