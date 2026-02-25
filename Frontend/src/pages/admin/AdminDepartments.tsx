import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { departmentCategories, serviceCategories } from "@/lib/departments";
import { ChevronDown, ChevronRight, Building2, Layers, BookOpen } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const AdminDepartments = () => {
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [expandedDepts, setExpandedDepts] = useState<string[]>([]);

  const toggleCat = (name: string) =>
    setExpandedCats((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
  const toggleDept = (name: string) =>
    setExpandedDepts((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">Departments & Categories</h1>
          <p className="text-sm text-muted-foreground">University academic structure and service categories</p>
        </div>

        {/* Academic Departments */}
        <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent" /> Academic Departments
        </h2>
        <div className="space-y-3 mb-10">
          {departmentCategories.map((cat) => {
            const isOpen = expandedCats.includes(cat.name);
            return (
              <div key={cat.name} className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
                <button onClick={() => toggleCat(cat.name)} className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-display font-bold text-sm">{cat.name}</span>
                    <Badge variant="secondary" className="text-[10px]">{cat.departments.length} depts</Badge>
                  </div>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </button>
                {isOpen && (
                  <div className="border-t border-border">
                    {cat.departments.map((dept) => {
                      const hasSubs = dept.subs && dept.subs.length > 0;
                      const isDeptOpen = expandedDepts.includes(dept.name);
                      return (
                        <div key={dept.name}>
                          <button
                            onClick={() => hasSubs && toggleDept(dept.name)}
                            className={`w-full flex items-center gap-3 px-6 py-3 text-sm hover:bg-muted/20 transition-colors text-left ${!hasSubs ? "cursor-default" : ""}`}
                          >
                            {hasSubs ? (
                              isDeptOpen ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />
                            ) : (
                              <Layers className="w-3 h-3 text-muted-foreground" />
                            )}
                            <span className="font-medium">{dept.name}</span>
                            {hasSubs && <Badge variant="outline" className="text-[10px]">{dept.subs!.length} specs</Badge>}
                          </button>
                          {hasSubs && isDeptOpen && (
                            <div className="pl-14 pb-2 space-y-1">
                              {dept.subs!.map((sub) => (
                                <div key={sub} className="text-xs text-muted-foreground py-1 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                  {sub}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Service Categories */}
        <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-accent" /> Service Categories
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {serviceCategories.map((cat) => (
            <div key={cat} className="rounded-xl bg-card border border-border shadow-card p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-accent" />
              </div>
              <span className="font-medium text-sm">{cat}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDepartments;
