import React, { useState } from 'react';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StockItemForm from '@/components/stock/StockItemForm';
import StockMovementForm from '@/components/stock/StockMovementForm';
import StockTable from '@/components/stock/StockTable';
import { StockItem, StockMovement } from '@/types/stock';
import { toast } from 'sonner';

// ✅ Générateur d'identifiants uniques natif (remplace uuid)
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
};

const StockPage: React.FC = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | undefined>(undefined);
  const [selectedItemIdForMovement, setSelectedItemIdForMovement] = useState<string | undefined>(undefined);

  // ✅ Gestion des articles
  const handleAddItem = (newItem: Omit<StockItem, 'id'>) => {
    if (editingItem) {
      setStockItems((prev) =>
        prev.map((item) => item.id === editingItem.id ? { ...newItem, id: item.id } : item)
      );
      setEditingItem(undefined);
      toast.success("Article modifié avec succès !");
    } else {
      setStockItems((prev) => [...prev, { ...newItem, id: generateId() }]);
      toast.success("Article ajouté avec succès !");
    }
    setIsItemFormOpen(false);
  };

  const handleEditItem = (itemToEdit: StockItem) => {
    setEditingItem(itemToEdit);
    setIsItemFormOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setStockItems(stockItems.filter(item => item.id !== id));
    toast.success("Article supprimé avec succès !");
  };

  // ✅ Gestion des mouvements
  const handleAddMovement = (movement: Omit<StockMovement, 'id' | 'itemId'>) => {
    if (!selectedItemIdForMovement) {
      toast.error("Aucun article sélectionné pour le mouvement.");
      return;
    }

    const newMovement: StockMovement = { ...movement, id: generateId(), itemId: selectedItemIdForMovement };
    setStockMovements([...stockMovements, newMovement]);

    setStockItems(prevItems =>
      prevItems.map(item => {
        if (item.id === selectedItemIdForMovement) {
          let newQuantity = item.quantiteActuelle;
          if (newMovement.type === 'entree') newQuantity += newMovement.quantite;
          else newQuantity -= newMovement.quantite;

          if (newQuantity < 0) {
            toast.error("La quantité en stock ne peut pas être négative.");
            return item; // Prevent negative stock
          }
          return { ...item, quantiteActuelle: newQuantity };
        }
        return item;
      })
    );

    setIsMovementFormOpen(false);
    setSelectedItemIdForMovement(undefined);
  };

  const openMovementFormForItem = (itemId: string) => {
    setSelectedItemIdForMovement(itemId);
    setIsMovementFormOpen(true);
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-4xl font-bold text-primary-erp mb-6">Module Gestion de Stock</h1>

      <Card className="bg-white shadow-lg rounded-lg p-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-primary-erp flex items-center">
            <Package className="mr-2 h-6 w-6" /> Articles en Stock
          </CardTitle>
          <Button
            onClick={() => { setIsItemFormOpen(true); setEditingItem(undefined); }}
            className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground"
          >
            <Plus className="mr-2 h-4 w-4" /> Ajouter Article
          </Button>
        </CardHeader>
        <CardContent className="mt-4">
          <StockTable
            stockItems={stockItems}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onAddMovement={openMovementFormForItem}
          />
        </CardContent>
      </Card>

      {/* Stock Item Form Dialog */}
      <Dialog open={isItemFormOpen} onOpenChange={setIsItemFormOpen}>
        <DialogContent className="sm:max-w-2xl bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Modifier l'article" : "Ajouter un nouvel article"}</DialogTitle>
          </DialogHeader>
          <StockItemForm
            onSubmit={handleAddItem}
            initialData={editingItem}
            onCancel={() => {
              setIsItemFormOpen(false);
              setEditingItem(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Stock Movement Form Dialog */}
      <Dialog open={isMovementFormOpen} onOpenChange={setIsMovementFormOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>Enregistrer un mouvement de stock</DialogTitle>
          </DialogHeader>
          <StockMovementForm
            onSubmit={handleAddMovement}
            onCancel={() => {
              setIsMovementFormOpen(false);
              setSelectedItemIdForMovement(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockPage;
