import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import StickmanMascot from "./components/StickmanMascot";
import MusicToggle from "./components/MusicToggle";
import WhatsAppButton from "./components/WhatsAppButton";
import FloatingGame from "./components/FloatingGame";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminPages from "./pages/admin/AdminPages";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminBlogEditor from "./pages/admin/AdminBlogEditor";
import AdminBrandRules from "./pages/admin/AdminBrandRules";
import AdminTheme from "./pages/admin/AdminTheme";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminSEO from "./pages/admin/AdminSEO";
import { usePageTracking } from "./hooks/usePageTracking";
import ThemeInjector from "./components/ThemeInjector";

const queryClient = new QueryClient();

const AppShell = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  usePageTracking();

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/pages" element={<AdminPages />} />
        <Route path="/admin/blogs" element={<AdminBlogs />} />
        <Route path="/admin/blogs/new" element={<AdminBlogEditor />} />
        <Route path="/admin/blogs/:id" element={<AdminBlogEditor />} />
        <Route path="/admin/brand-rules" element={<AdminBrandRules />} />
        <Route path="/admin/theme" element={<AdminTheme />} />
        <Route path="/admin/media" element={<AdminMedia />} />
        <Route path="/admin/seo" element={<AdminSEO />} />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Global Components — hide on admin */}
      {!isAdminRoute && (
        <>
          <StickmanMascot />
          <MusicToggle />
          <WhatsAppButton />
          <FloatingGame />
        </>
      )}
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ThemeInjector />
          <AppShell />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
