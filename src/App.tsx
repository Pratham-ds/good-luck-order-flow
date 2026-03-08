
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import AuthPage from "./components/auth/AuthPage";
import CustomerDashboard from "./components/dashboard/CustomerDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          user ? (isAdmin ? <AdminDashboard /> : <CustomerDashboard />) : <Index />
        } />
        <Route path="/booking" element={<Booking />} />
        <Route path="/auth" element={
          user ? (isAdmin ? <AdminDashboard /> : <CustomerDashboard />) : <AuthPage />
        } />
        <Route path="/dashboard" element={
          user ? (isAdmin ? <AdminDashboard /> : <CustomerDashboard />) : <AuthPage />
        } />
        <Route path="/admin" element={
          user && isAdmin ? <AdminDashboard /> : <AuthPage />
        } />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
