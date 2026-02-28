import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { User, Mail, Building, Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const StaffProfile = () => {
  const { toast } = useToast();

  return (
    <DashboardLayout role="staff">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">My Profile</h1>
          <p className="text-sm text-muted-foreground">Your staff account details</p>
        </div>
        <div className="max-w-2xl">
          <div className="rounded-xl bg-card border border-border shadow-card p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <span className="text-2xl font-display font-bold text-primary-foreground">MT</span>
              </div>
              <div>
                <h2 className="font-display font-bold text-lg">Meron Tadesse</h2>
                <p className="text-sm text-muted-foreground">Dormitory Staff</p>
                <Badge className="mt-1"><Shield className="w-3 h-3 mr-1" />Staff</Badge>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card border border-border shadow-card p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><Label className="flex items-center gap-2 mb-2"><User className="w-3.5 h-3.5" />Full Name</Label><Input value="Meron Tadesse" /></div>
              <div><Label className="flex items-center gap-2 mb-2"><Mail className="w-3.5 h-3.5" />Email</Label><Input value="meron.t@astu.edu.et" disabled className="bg-muted" /></div>
              <div><Label className="flex items-center gap-2 mb-2"><Building className="w-3.5 h-3.5" />Department</Label><Input value="Dormitory" disabled className="bg-muted" /></div>
              <div><Label className="flex items-center gap-2 mb-2"><Shield className="w-3.5 h-3.5" />Role</Label><Input value="Department Staff" disabled className="bg-muted" /></div>
            </div>
            <Button onClick={() => toast({ title: "Profile Updated" })} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Save className="w-4 h-4 mr-2" />Save Changes
            </Button>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default StaffProfile;
