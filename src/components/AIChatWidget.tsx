import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = { role: "user" | "assistant"; content: string };

const quickReplies = [
  "How do I submit a complaint?",
  "What's the status of my ticket?",
  "How long does resolution take?",
  "Who handles dormitory issues?",
];

const getAIResponse = (msg: string): string => {
  const lower = msg.toLowerCase();
  if (lower.includes("submit") || lower.includes("complaint") || lower.includes("new"))
    return "To submit a complaint:\n1. Go to **My Complaints** from the sidebar\n2. Click **New Complaint**\n3. Select the department category\n4. Describe your issue in detail\n5. Click Submit\n\nYour complaint will be automatically routed to the right department!";
  if (lower.includes("status") || lower.includes("track"))
    return "You can track your complaints in **My Complaints** page. Each ticket shows its current status:\n- **Pending**: Awaiting staff review\n- **In Progress**: Being addressed\n- **Resolved**: Issue fixed\n- **Rejected**: Cannot be addressed";
  if (lower.includes("long") || lower.includes("time") || lower.includes("resolution"))
    return "Average resolution time is **2.3 days**. Urgent issues like water or electricity are typically resolved within **24 hours**. Academic complaints may take **3-5 days** depending on complexity.";
  if (lower.includes("dormitory") || lower.includes("dorm"))
    return "Dormitory issues (water, electricity, room repairs) are handled by **Dormitory Staff**. They receive your complaint automatically when you select 'Dormitory' as the category. Current dormitory staff: Meron Tadesse.";
  if (lower.includes("cafeteria") || lower.includes("food"))
    return "Cafeteria complaints are managed by **Cafeteria Staff**. Common issues include food quality, hygiene, and menu variety. Select 'Cafeteria' when submitting your complaint.";
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey"))
    return "Hello! 👋 I'm your ASTU AI assistant. I can help you with:\n- Submitting complaints\n- Tracking ticket status\n- Understanding the complaint process\n- General university service questions\n\nHow can I help you today?";
  return "I can help you with complaint submission, tracking, and university services. Try asking about:\n- How to submit a complaint\n- Tracking your ticket status\n- Resolution timelines\n- Department-specific questions";
};

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! 👋 I'm your ASTU AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(msg);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-gold flex items-center justify-center hover:bg-accent/90 transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Bot className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-primary-foreground">ASTU AI Assistant</p>
                  <p className="text-[10px] text-primary-foreground/60">Always here to help</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-accent" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-xl px-3 py-2 text-sm whitespace-pre-line ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {m.content}
                  </div>
                  {m.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3 h-3 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-accent" />
                  </div>
                  <div className="bg-muted rounded-xl px-3 py-2 text-sm">
                    <span className="animate-pulse">Typing...</span>
                  </div>
                </div>
              )}

              {/* Quick replies if only 1 message */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickReplies.map((q) => (
                    <button key={q} onClick={() => handleSend(q)} className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground">
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 text-sm"
                />
                <Button type="submit" size="sm" disabled={!input.trim() || isTyping} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;
