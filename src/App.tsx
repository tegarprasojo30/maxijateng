import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import Dashboard from "./pages/Dashboard.tsx";
import DataLPSE from "./pages/Index.tsx";
import ProgressSKTH from "./pages/ProgressSKTH.tsx";
import ProgressSKTR from "./pages/ProgressSKTR.tsx";
import AnomaliSKTR from "./pages/AnomaliSKTR.tsx";
import AnomaliSKTH from "./pages/AnomaliSKTH.tsx";
import Pedoman from "./pages/Pedoman.tsx";
import Fenomena from "./pages/Fenomena.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 flex items-center justify-between border-b bg-card px-2">
          <SidebarTrigger className="ml-1" />
          <ThemeToggle />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  </SidebarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/data-lpse" element={<DataLPSE />} />
            <Route path="/skth-2025/progres" element={<ProgressSKTH />} />
            <Route path="/skth-2025/anomali-data" element={<AnomaliSKTH />} />
            <Route path="/sktr-2026/progres" element={<ProgressSKTR />} />
            <Route path="/sktr-2026/anomali-data" element={<AnomaliSKTR />} />
            <Route path="/fenomena" element={<Fenomena />} />
            <Route path="/pedoman" element={<Pedoman />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
