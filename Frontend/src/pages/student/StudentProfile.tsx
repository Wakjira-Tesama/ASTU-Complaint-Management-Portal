import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, Mail, Hash, Building, Home, GraduationCap, Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const StudentProfile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "Abebe Kebede",
    email: "abebe.kebede@astu.edu.et",
    universityId: "ASTU/2023/0456",
    department: "Computer Science",
    dormNumber: "Block 5, Room 312",
    yearOfStudy: "3rd Year",
    verified: true,
  });

  const handleSave = () => {
    toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
  };

  return (
    <DashboardLayout role="student">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">My Profile</h1>
          <p className="text-sm text-muted-foreground">View and manage your account information</p>
        </div>

        <div className="max-w-2xl">
          {/* Avatar & verification */}
          <div className="rounded-xl bg-card border border-border shadow-card p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <span className="text-2xl font-display font-bold text-primary-foreground">AK</span>
              </div>
              <div>
                <h2 className="font-display font-bold text-lg">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">{profile.universityId}</p>
                <Badge variant={profile.verified ? "default" : "destructive"} className="mt-1">
                  <Shield className="w-3 h-3 mr-1" />
                  {profile.verified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-xl bg-card border border-border shadow-card p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="flex items-center gap-2 mb-2"><User className="w-3.5 h-3.5" />Full Name</Label>
                <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-2"><Mail className="w-3.5 h-3.5" />Email</Label>
                <Input value={profile.email} disabled className="bg-muted" />
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-2"><Hash className="w-3.5 h-3.5" />University ID</Label>
                <Input value={profile.universityId} disabled className="bg-muted" />
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-2"><Building className="w-3.5 h-3.5" />Department</Label>
                <Input value={profile.department} disabled className="bg-muted" />
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-2"><Home className="w-3.5 h-3.5" />Dorm Number</Label>
                <Input value={profile.dormNumber} onChange={(e) => setProfile({ ...profile, dormNumber: e.target.value })} />
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-2"><GraduationCap className="w-3.5 h-3.5" />Year of Study</Label>
                <Input value={profile.yearOfStudy} disabled className="bg-muted" />
              </div>
            </div>
            <div className="pt-2">
              <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default StudentProfile;
