import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, a simple placeholder for login.
    // In a real app, this would involve API calls and authentication logic.
    toast.success("Connexion réussie ! Redirection vers le tableau de bord.");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-erp to-secondary-erp p-4">
      <Card className="w-full max-w-md bg-white text-primary-erp-foreground shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary-erp">GESTION BKS</CardTitle>
          <CardDescription className="text-gray-600">Connectez-vous pour accéder à votre espace ERP</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-primary-erp">Nom d'utilisateur</Label>
              <Input id="username" type="text" placeholder="admin" required className="mt-1 border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
            </div>
            <div>
              <Label htmlFor="password" className="text-primary-erp">Mot de passe</Label>
              <Input id="password" type="password" placeholder="password" required className="mt-1 border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
            </div>
            <Button type="submit" className="w-full bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground font-semibold py-2 rounded-md transition-colors">
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default LoginPage;