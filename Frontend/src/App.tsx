import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import StaffLogin from "./pages/StaffLogin";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import StudentComplaints from "./pages/student/StudentComplaints";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";
import StudentProfile from "./pages/student/StudentProfile";
import StaffDashboard from "./pages/StaffDashboard";
import StaffTickets from "./pages/staff/StaffTickets";
import StaffEvents from "./pages/staff/StaffEvents";
import StaffAnnouncements from "./pages/staff/StaffAnnouncements";
import StaffProfile from "./pages/staff/StaffProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminStaffManagement from "./pages/admin/AdminStaffManagement";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminClubs from "./pages/admin/AdminClubs";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminDepartments from "./pages/admin/AdminDepartments";
import StudentAnnouncementBoard from "./pages/student/StudentAnnouncementBoard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student */}
          <Route path="/student" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/complaints" element={<ProtectedRoute requiredRole="student"><StudentComplaints /></ProtectedRoute>} />
          <Route path="/student/announcements" element={<ProtectedRoute requiredRole="student"><StudentAnnouncements /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute requiredRole="student"><StudentProfile /></ProtectedRoute>} />
          <Route path="/student/board" element={<ProtectedRoute requiredRole="student"><StudentAnnouncementBoard /></ProtectedRoute>} />
          
          {/* Staff */}
          <Route path="/staff" element={<ProtectedRoute requiredRole="staff"><StaffDashboard /></ProtectedRoute>} />
          <Route path="/staff/tickets" element={<ProtectedRoute requiredRole="staff"><StaffTickets /></ProtectedRoute>} />
          <Route path="/staff/events" element={<ProtectedRoute requiredRole="staff"><StaffEvents /></ProtectedRoute>} />
          <Route path="/staff/announcements" element={<ProtectedRoute requiredRole="staff"><StaffAnnouncements /></ProtectedRoute>} />
          <Route path="/staff/profile" element={<ProtectedRoute requiredRole="staff"><StaffProfile /></ProtectedRoute>} />
          
          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/complaints" element={<ProtectedRoute requiredRole="admin"><AdminComplaints /></ProtectedRoute>} />
          <Route path="/admin/staff" element={<ProtectedRoute requiredRole="admin"><AdminStaffManagement /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute requiredRole="admin"><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/admin/announcements" element={<ProtectedRoute requiredRole="admin"><AdminAnnouncements /></ProtectedRoute>} />
          <Route path="/admin/clubs" element={<ProtectedRoute requiredRole="admin"><AdminClubs /></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute requiredRole="admin"><AdminDepartments /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettings /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
