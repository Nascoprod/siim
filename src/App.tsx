import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import FinancePage from "./pages/FinancePage";
import PersonnelPage from "./pages/PersonnelPage";
import StockPage from "./pages/StockPage";
import ImmobilierPage from "./pages/ImmobilierPage";
import ParcAutoPage from "./pages/ParcAutoPage";
import DevisFacturesPage from "./pages/DevisFacturesPage";
import ConfigurationPage from "./pages/ConfigurationPage"; // Import the new ConfigurationPage
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="personnel" element={<PersonnelPage />} />
            <Route path="stock" element={<StockPage />} />
            <Route path="immobilier" element={<ImmobilierPage />} />
            <Route path="parc-auto" element={<ParcAutoPage />} />
            <Route path="devis-factures" element={<DevisFacturesPage />} />
            <Route path="configuration" element={<ConfigurationPage />} /> {/* Add route for ConfigurationPage */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;