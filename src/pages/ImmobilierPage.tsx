import React, { useState } from 'react';
import { Building, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PropertyForm from '@/components/immobilier/PropertyForm';
import PropertyTable from '@/components/immobilier/PropertyTable';
import { Property } from '@/types/immobilier';
import { toast } from 'sonner';

const ImmobilierPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>(undefined);

  const handleAddProperty = (newProperty: Omit<Property, 'id'>) => {
    if (editingProperty) {
      setProperties(properties.map(p => p.id === editingProperty.id ? { ...newProperty, id: p.id } : p));
      setEditingProperty(undefined);
    } else {
      setProperties([...properties, { ...newProperty, id: uuidv4() }]);
    }
    setIsFormOpen(false);
  };

  const handleEditProperty = (propertyToEdit: Property) => {
    setEditingProperty(propertyToEdit);
    setIsFormOpen(true);
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
    toast.success("Bien immobilier supprimé avec succès !");
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-4xl font-bold text-primary-erp mb-6">Module Gestion Immobilière</h1>

      <Card className="bg-white shadow-lg rounded-lg p-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-primary-erp flex items-center">
            <Building className="mr-2 h-6 w-6" /> Liste des Biens Immobiliers
          </CardTitle>
          <Button onClick={() => { setIsFormOpen(true); setEditingProperty(undefined); }} className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground">
            <Plus className="mr-2 h-4 w-4" /> Ajouter Bien
          </Button>
        </CardHeader>
        <CardContent className="mt-4">
          <PropertyTable
            properties={properties}
            onEdit={handleEditProperty}
            onDelete={handleDeleteProperty}
          />
        </CardContent>
      </Card>

      {/* Property Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-3xl bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>{editingProperty ? "Modifier le bien immobilier" : "Ajouter un nouveau bien immobilier"}</DialogTitle>
          </DialogHeader>
          <PropertyForm
            onSubmit={handleAddProperty}
            initialData={editingProperty}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingProperty(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImmobilierPage;