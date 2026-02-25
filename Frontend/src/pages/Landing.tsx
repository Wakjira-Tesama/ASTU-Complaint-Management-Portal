import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Zap, MessageSquare, BarChart3, ArrowRight, CheckCircle2, Megaphone, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-campus.jpg";

const features = [
  {
    icon: Shield,
    title: "AI-Powered Verification",
    description: "OCR-based student ID validation ensures only legitimate students access the system.",
  },
  {
    icon: Zap,
    title: "Smart Routing",
    description: "Complaints are automatically routed to the correct department for faster resolution.",
  },
  {
    icon: MessageSquare,
    title: "Structured Communication",
    description: "Threaded conversations between students and staff with full audit trails.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Real-time dashboards track resolution rates, response times, and staff performance.",
  },
];

const steps = [
  "Register & verify your university ID",
  "Submit a complaint with category selection",
  "System auto-routes to the right department",
  "Staff reviews, responds & resolves",
  "Admin monitors performance & quality",
];

const universityAnnouncements = [
  {
    id: 1,
    title: "Second Semester Registration Opens January 15",
    content: "All students must complete registration before January 20. Late registration will incur additional fees.",
    date: "2026-01-10",
    category: "Academic",
    author: "Office of the Registrar",
  },
  {
    id: 2,
    title: "University-Wide Internet Maintenance",
    content: "Campus Wi-Fi will be unavailable on Saturday, Feb 1st from 2:00 AM to 6:00 AM for scheduled maintenance.",
    date: "2026-01-28",
    category: "IT Services",
    author: "ICT Department",
  },
  {
    id: 3,
    title: "Annual Science & Innovation Fair 2026",
    content: "Submit your projects by February 20. Open to all departments. Cash prizes for top 3 entries.",
    date: "2026-02-05",
    category: "Events",
    author: "Research & Innovation Office",
  },
  {
    id: 4,
    title: "Library Extended Hours During Exam Period",
    content: "The main library will remain open until midnight from Feb 15 to March 5 to support exam preparation.",
    date: "2026-02-10",
    category: "General",
    author: "University Administration",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-sm">A</span>
            </div>
            <span className="font-display font-bold text-lg">ASTU Complaints</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative container py-24 md:py-36 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider uppercase rounded-full bg-accent/20 text-accent">
              Adama Science & Technology University
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground leading-tight max-w-4xl mx-auto">
              Smart Complaint Management,{" "}
              <span className="text-gradient-gold">Powered by AI</span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/70 max-w-2xl mx-auto font-body">
              Submit, track, and resolve university complaints transparently. AI-verified identities, smart routing, and real-time analytics.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold font-semibold">
                  Register as Student
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Student Login
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Why This System?</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              A modern, transparent approach to university service coordination.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="p-6 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-shadow border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold">How It Works</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border shadow-card"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <p className="text-foreground font-medium pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Built for Everyone</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                role: "Students",
                perks: ["Submit complaints", "Track status", "Chat with staff", "View announcements"],
                link: "/register",
                cta: "Register Now",
              },
              {
                role: "Staff",
                perks: ["Manage tickets", "Respond to students", "Post events", "Department isolation"],
                link: "#",
                cta: "Contact Admin",
              },
              {
                role: "Admin",
                perks: ["Full oversight", "Manage staff", "Analytics dashboard", "Performance metrics"],
                link: "#",
                cta: "Internal Access",
              },
            ].map((r, i) => (
              <motion.div
                key={r.role}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="p-6 rounded-xl bg-card border border-border shadow-card text-center"
              >
                <h3 className="font-display font-bold text-xl mb-4">{r.role}</h3>
                <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                  {r.perks.map((p) => (
                    <li key={p} className="flex items-center gap-2 justify-center">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link to={r.link}>
                  <Button variant="outline" size="sm" className="w-full">
                    {r.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* University Announcements */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-accent/15">
              <Megaphone className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold tracking-wider uppercase text-accent">Latest Updates</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold">University Announcements</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Stay informed with the latest news and updates from the university administration.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {universityAnnouncements.map((a, i) => (
              <motion.div
                key={a.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {a.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg mb-2 leading-snug">{a.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{a.content}</p>
                <p className="text-xs text-muted-foreground/70">— {a.author}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/login">
              <Button variant="outline">
                View All Announcements
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Adama Science and Technology University. Smart Complaint Management System.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
