import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SplashScreen from "./components/SplashScreen";
import OnboardingCarousel from "./components/OnboardingCarousel";
import AuthPage from "./components/AuthPage";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreateTeam from "./pages/CreateTeam";
import MyTeams from "./pages/MyTeams";
import TeamDetails from "./pages/TeamDetails";
import TeamChat from "./pages/TeamChat";
import Search from "./pages/Search";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding" element={<OnboardingCarousel />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="home" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="teams/create" element={<CreateTeam />} />
            <Route path="teams/:id" element={<TeamDetails />} />
            <Route path="my-teams" element={<MyTeams />} />
            <Route path="search" element={<Search />} />
          </Route>
          <Route path="/chat/:teamId" element={<ProtectedRoute><TeamChat /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
