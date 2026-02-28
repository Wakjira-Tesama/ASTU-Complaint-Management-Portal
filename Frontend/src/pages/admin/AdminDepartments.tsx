import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { departmentCategories, serviceCategories } from "@/lib/departments";
import { ChevronDown, ChevronRight, Building2, Layers, BookOpen, MessageCircle, X, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminDepartments = () => {
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [expandedDepts, setExpandedDepts] = useState<string[]>([]);
  
  // Chat state
  const [activeChatDept, setActiveChatDept] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleCat = (name: string) =>
    setExpandedCats((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
  const toggleDept = (name: string) =>
    setExpandedDepts((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);

  useEffect(() => {
    if (activeChatDept) {
      fetchMessages();
      // Optional: Polling could go here
    }
  }, [activeChatDept]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatMessages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin-messages/${encodeURIComponent(activeChatDept!)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        setChatMessages(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChatDept) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin-messages/${encodeURIComponent(activeChatDept)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ text: newMessage })
      });
      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    }
  };

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
                <div className="flex items-center justify-between border-b border-border/50">
                  <button onClick={() => toggleCat(cat.name)} className="flex-1 flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-display font-bold text-sm">{cat.name}</span>
                      <Badge variant="secondary" className="text-[10px]">{cat.departments.length} depts</Badge>
                    </div>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  <Button variant="ghost" size="icon" className="mr-4 text-muted-foreground hover:text-primary" onClick={() => setActiveChatDept(cat.name)}>
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
                {isOpen && (
                  <div className="border-t border-border">
                    {cat.departments.map((dept) => {
                      const hasSubs = dept.subs && dept.subs.length > 0;
                      const isDeptOpen = expandedDepts.includes(dept.name);
                      return (
                        <div key={dept.name}>
                          <div className={`flex items-center justify-between hover:bg-muted/20 transition-colors ${!hasSubs ? "cursor-default" : ""}`}>
                            <button
                              onClick={() => hasSubs && toggleDept(dept.name)}
                              className="flex-1 flex items-center gap-3 px-6 py-3 text-sm text-left"
                            >
                              {hasSubs ? (
                                isDeptOpen ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />
                              ) : (
                                <Layers className="w-3 h-3 text-muted-foreground" />
                              )}
                              <span className="font-medium">{dept.name}</span>
                              {hasSubs && <Badge variant="outline" className="text-[10px]">{dept.subs!.length} specs</Badge>}
                            </button>
                            <Button variant="ghost" size="icon" className="mr-4 text-muted-foreground hover:text-primary h-8 w-8" onClick={() => setActiveChatDept(dept.name)}>
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          </div>
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
            <div key={cat} className="rounded-xl bg-card border border-border shadow-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-accent" />
                </div>
                <span className="font-medium text-sm">{cat}</span>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent" onClick={() => setActiveChatDept(cat)}>
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>


        {/* Chat Overlay */}
        {activeChatDept && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-background/50 backdrop-blur-sm p-4 sm:p-6" onClick={() => setActiveChatDept(null)}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full max-w-sm h-full max-h-[600px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col p-4 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg">Staff Chat</h3>
                  <Button variant="ghost" size="icon" onClick={() => setActiveChatDept(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{activeChatDept}</p>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
                {chatMessages.length === 0 && (
                  <p className="text-center text-xs text-muted-foreground my-10">No messages yet. Start the conversation!</p>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.senderRole === "admin" ? "items-end" : "items-start"}`}>
                    <div className="flex items-end gap-2 mb-1">
                      {msg.senderRole === "staff" && <span className="text-[10px] text-muted-foreground">{msg.senderName}</span>}
                    </div>
                    <div className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] ${
                      msg.senderRole === "admin" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-border bg-card flex items-center gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="rounded-full border-muted-foreground/20 focus-visible:ring-primary/50"
                  autoFocus
                />
                <Button size="icon" className="rounded-full shrink-0 h-10 w-10" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDepartments;
