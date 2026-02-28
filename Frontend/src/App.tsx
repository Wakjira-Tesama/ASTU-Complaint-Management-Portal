import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/complaints" element={<StudentComplaints />} />
          <Route path="/student/announcements" element={<StudentAnnouncements />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/board" element={<StudentAnnouncementBoard />} />
          {/* Staff */}
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/tickets" element={<StaffTickets />} />
          <Route path="/staff/events" element={<StaffEvents />} />
          <Route path="/staff/profile" element={<StaffProfile />} />
          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/complaints" element={<AdminComplaints />} />
          <Route path="/admin/staff" element={<AdminStaffManagement />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/clubs" element={<AdminClubs />} />
          <Route path="/admin/departments" element={<AdminDepartments />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
