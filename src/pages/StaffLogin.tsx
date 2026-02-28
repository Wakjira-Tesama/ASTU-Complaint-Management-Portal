import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, UserCog } from "lucide-react";

const StaffLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-hero items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <UserCog className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-3xl font-display font-bold text-primary-foreground mb-4">
            Staff Portal
          </h2>
          <p className="text-primary-foreground/60">
            Access your department dashboard to manage tickets, respond to complaints, and post events.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to home
            </Link>
            <h1 className="mt-4 text-2xl font-display font-bold">Staff Sign In</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your staff credentials to access your dashboard.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "/staff";
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Staff Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="staff@astu.edu.et"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Sign In as Staff
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Admin?{" "}
            <Link to="/admin-login" className="text-accent font-medium hover:underline">
              Admin Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StaffLogin;
