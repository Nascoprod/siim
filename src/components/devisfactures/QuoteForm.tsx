import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, X } from 'lucide-react';
import { Quote, LineItem } from '@/types/devisfactures';
import { toast } from 'sonner';
import LineItemForm from './LineItemForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const quoteFormSchema = z.object({
  clientName: z.string().min(1, { message: "Le nom du client est requis." }),
  dateEmission: z.string().min(1, { message: "La date d'émission est requise." }),
  dateValidite: z.string().min(1, { message: "La date de validité est requise." }),
  tvaRate: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Le taux de TVA doit être positif ou nul." }).max(1, { message: "Le taux de TVA ne peut pas dépasser 100%." })
  ),
  notes: z.string().optional(),
  statut: z.enum(['brouillon', 'envoyé', 'accepté', 'refusé', 'facturé'], { message: "Le statut est requis." }),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

interface QuoteFormProps {
  onSubmit: (quote: Omit<Quote, 'id' | 'sousTotal' | 'montantTVA' | 'montantTotal'> & { items: LineItem[] }) => void;
  initialData?: Quote;
  onCancel?: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [items, setItems] = useState<LineItem[]>(initialData?.items || []);
  const [isLineItemFormOpen, setIsLineItemFormOpen] = useState(false);
  const [editingLineItem, setEditingLineItem] = useState<LineItem | undefined>(undefined);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      clientName: initialData?.clientName || '',
      dateEmission: initialData?.dateEmission || new Date().toISOString().split('T')[0],
      dateValidite: initialData?.dateValidite || '',
      tvaRate: initialData?.tvaRate || 0.18, // Default 18%
      notes: initialData?.notes || '',
      statut: initialData?.statut || 'brouillon',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        clientName: initialData.clientName,
        dateEmission: initialData.dateEmission,
        dateValidite: initialData.dateValidite,
        tvaRate: initialData.tvaRate,
        notes: initialData.notes,
        statut: initialData.statut,
      });
      setItems(initialData.items || []);
    }
  }, [initialData, form]);

  const sousTotal = useMemo(() => items.reduce((sum, item) => sum + item.prixTotal, 0), [items]);
  const tvaRate = form.watch('tvaRate');
  const montantTVA = useMemo(() => sousTotal * tvaRate, [sousTotal, tvaRate]);
  const montantTotal = useMemo(() => sousTotal + montantTVA, [sousTotal, montantTVA]);

  const handleAddLineItem = (newItem: Omit<LineItem, 'id'>) => {
    if (editingLineItem) {
      setItems(items.map(item => item.id === editingLineItem.id ? { ...newItem, id: item.id } : item));
      setEditingLineItem(undefined);
    } else {
      setItems([...items, { ...newItem, id: crypto.randomUUID() }]);
    }
    setIsLineItemFormOpen(false);
  };

  const handleEditLineItem = (itemToEdit: LineItem) => {
    setEditingLineItem(itemToEdit);
    setIsLineItemFormOpen(true);
  };

  const handleDeleteLineItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.success("Article supprimé du devis.");
  };

  const handleFormSubmit = (values: QuoteFormValues) => {
    if (items.length === 0) {
      toast.error("Veuillez ajouter au moins un article au devis.");
      return;
    }
    onSubmit({ ...values, items, sousTotal, montantTVA, montantTotal });
    form.reset();
    setItems([]);
    toast.success(initialData ? "Devis modifié avec succès !" : "Devis ajouté avec succès !");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du Client</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du client" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateEmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date d'émission</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dateValidite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de validité</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tvaRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taux de TVA (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Ex: 0.18 pour 18%" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Line Items Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-primary-erp">Articles du Devis</h3>
            <Button type="button" onClick={() => { setIsLineItemFormOpen(true); setEditingLineItem(undefined); }} className="bg-secondary-erp hover:bg-secondary-erp/90 text-secondary-erp-foreground">
              <Plus className="mr-2 h-4 w-4" /> Ajouter Article
            </Button>
          </div>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Description</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix Unitaire</TableHead>
                  <TableHead>Prix Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      Aucun article ajouté.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantite}</TableCell>
                      <TableCell>{item.prixUnitaire.toFixed(2)} FCFA</TableCell>
                      <TableCell>{item.prixTotal.toFixed(2)} FCFA</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditLineItem(item)} className="text-primary-erp hover:bg-primary-erp/10">
                          Modifier
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteLineItem(item.id)} className="text-destructive hover:bg-destructive/10">
                          Supprimer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Totals Summary */}
        <div className="flex justify-end">
          <div className="w-full md:w-1/2 space-y-2">
            <div className="flex justify-between font-medium">
              <span>Sous-total:</span>
              <span>{sousTotal.toFixed(2)} FCFA</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>TVA ({tvaRate * 100}%):</span>
              <span>{montantTVA.toFixed(2)} FCFA</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-primary-erp border-t pt-2">
              <span>Montant Total:</span>
              <span>{montantTotal.toFixed(2)} FCFA</span>
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optionnel)</FormLabel>
              <FormControl>
                <Textarea placeholder="Notes supplémentaires pour le devis" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="statut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut du Devis</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="brouillon">Brouillon</SelectItem>
                  <SelectItem value="envoyé">Envoyé</SelectItem>
                  <SelectItem value="accepté">Accepté</SelectItem>
                  <SelectItem value="refusé">Refusé</SelectItem>
                  <SelectItem value="facturé">Facturé</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
              Annuler
            </Button>
          )}
          <Button type="submit" className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground">
            {initialData ? "Modifier Devis" : "Créer Devis"}
          </Button>
        </div>
      </form>

      {/* Line Item Form Dialog */}
      <Dialog open={isLineItemFormOpen} onOpenChange={setIsLineItemFormOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>{editingLineItem ? "Modifier l'article" : "Ajouter un article"}</DialogTitle>
          </DialogHeader>
          <LineItemForm
            onSubmit={handleAddLineItem}
            initialData={editingLineItem}
            onCancel={() => {
              setIsLineItemFormOpen(false);
              setEditingLineItem(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default QuoteForm;