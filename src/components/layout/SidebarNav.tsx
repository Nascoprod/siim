import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, DollarSign, Users, Package, Building, Car, FileText, Settings, LogOut, School } from "lucide-react"; // Import School icon
import { toast } from "sonner";

const SidebarNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Placeholder for logout logic
    toast.info("Déconnexion réussie.");
    navigate("/login");
  };

  return (
    <nav className="flex flex-col h-full p-4 space-y-2 bg-primary-erp text-primary-erp-foreground shadow-lg">
      <div className="text-2xl font-bold text-center mb-6 text-secondary-erp">GESTION BKS</div>
      <Link to="/dashboard" className="w-full">
        <Button variant="ghost" className="w-full justify-start text-lg text-primary-erp-foreground hover:bg-secondary-erp hover:text-white">
          <Home className="mr-3 h-5 w-5" />
          Tableau de bord
        </Button>
      </Link>
      <Link to="/dashboard/school" className="w-full"> {/* New link for School module */}
        <Button variant="ghost" className="w-full justify-start text-lg text-primary-erp-foreground hover:bg-secondary-erp hover:text-white">
          <School className="mr-3 h-5 w-5" />
          École
        </Button>
      </Link>
      <Link to="/dashboard/finance" className="w-full">
        <Button variant="ghost" className="w-full justify-start text-lg text-primary-erp-foreground hover:bg-secondary-erp hover:text-white">
          <DollarSign className="mr-3 h-5 w-5" />
          Finance
        </Button>
      </Link>
      <Link to="/dashboard/personnel" className="w-full">
        <Button variant="ghost" className="w-full justify-start text-lg text-primary-erp-foreground hover:bg-secondary-erp hover:text-white">
          <Users className="mr-3 h-5 w-5" />
          Personnel
        </Button>
      </Link>
      <Link to="/dashboard/stock" className="w-full">
        <Button variant="ghost" className="w-full justify-start text-lg text-primary-erp-foreground hover:bg-secondary-erp hover:text-white">
          <Package className="mr-3 h-5 w-5" />
          Stock
        </Button>
      </Link>
      <Link to="/dashboard/immobilier" className="w-full">
        <Button variant="ghost" className="w-full justify-start text-lg text-primary-erp-foreground hover:bg-secondary-erp hover:text-white">
          <Building className="mr-3 h-5 w-5" />
          Immobilier
        </Button>
      </Link>
      <Link to="/dashboard/parc-auto" className="w-full">
        <Button variant="ghost" className="w-full justify-start text-lg text-primary-erp-foreground hover:bg-secondary-erp hover:text-white">
          <Car className="mr-3 h-5 w-5" />
          Parc Automobile
        </Button>
      </Link>
      <Link to="/dashboard/devis-factures" className="w-full">
        <Button variant="ghost" className="w-full justify-start text-lg text-primary-erp-foreground hover:bg-secondary-erp hover:text-white">
          <FileText className="mr-3 h-5 w-5" />
          Devis & Factures
        </Button>
      </Link>
      <Link to="/dashboard/configuration" className="w-full">
        <Button variant="ghost" className="w-full justify-start text-lg text-primary-erp-foreground hover:bg-secondary-erp hover:text-white">
          <Settings className="mr-3 h-5 w-5" />
          Configuration
        </Button>
      </Link>
      <div className="mt-auto pt-4">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-lg text-primary-erp-foreground hover:bg-secondary-erp hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </Button>
      </div>
    </nav>
  );
};

export default SidebarNav;