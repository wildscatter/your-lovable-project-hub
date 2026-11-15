import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatbotProvider } from "@/hooks/use-chatbot";
import { AuthProvider } from "@/contexts/AuthContext";
import SEOHead from "@/components/SEOHead";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Support from "./pages/Support";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Auth from "./pages/Auth";
import SpinWheelPage from "./pages/SpinWheelPage";
import ResetPassword from "./pages/ResetPassword";
import EmailSent from "./pages/EmailSent";
import ResponsibleGamblingPage from "./pages/ResponsibleGambling";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export const AppContent = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ChatbotProvider>
          <Toaster />
          <Sonner />

            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<><SEOHead title="Sign in | WildScatter" description="Sign in on WildScatter." noindex /><Auth /></>} />
              <Route path="/spin" element={<><SEOHead title="Spin Wheel | WildScatter" description="Spin Wheel on WildScatter." noindex /><SpinWheelPage /></>} />
              <Route path="/reset-password" element={<><SEOHead title="Reset Password | WildScatter" description="Reset Password on WildScatter." noindex /><ResetPassword /></>} />
              <Route path="/email-sent" element={<><SEOHead title="Check Your Email | WildScatter" description="Check Your Email on WildScatter." noindex /><EmailSent /></>} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/support" element={<Support />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/responsible-gambling" element={<ResponsibleGamblingPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>

        </ChatbotProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const App = () => <BrowserRouter><AppContent /></BrowserRouter>;

export default App;
