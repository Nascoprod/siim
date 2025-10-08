import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SystemSettingsForm from '@/components/configuration/SystemSettingsForm';
import { SystemSettings } from '@/types/configuration';
import { toast } from 'sonner';

const ConfigurationPage = () => {
  // In a real application, this would be fetched from a backend API
  const [settings, setSettings] = useState<SystemSettings>({
    id: 'default-settings', // Assuming a single settings object
    companyName: 'BKS Solutions',
    companyAddress: '123 Rue de l\'Innovation, Abidjan, Côte d\'Ivoire',
    companyPhone: '+225 07 00 00 00 00',
    companyEmail: 'contact@bkssolutions.com',
    defaultTvaRate: 0.18, // 18%
    currencySymbol: 'FCFA',
  });

  const handleSaveSettings = (updatedSettings: Omit<SystemSettings, 'id'>) => {
    setSettings({ ...updatedSettings, id: 'default-settings' });
    // In a real application, you would send this to your backend
    toast.success("Paramètres du système enregistrés avec succès !");
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-4xl font-bold text-primary-erp mb-6">Module Configuration</h1>

      <Card className="bg-white shadow-lg rounded-lg p-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-primary-erp flex items-center">
            <Settings className="mr-2 h-6 w-6" /> Paramètres du Système
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <SystemSettingsForm
            initialData={settings}
            onSubmit={handleSaveSettings}
            // No cancel button needed for a single settings page, changes are saved directly
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigurationPage;