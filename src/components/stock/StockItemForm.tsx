import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { StockItem } from '@/types/stock';
import { toast } from 'sonner';

const stockItemFormSchema = z.object({
  nom: z.string().min(1, { message: "Le nom de l'article est requis." }),
  description: z.string().optional(),
  quantiteActuelle: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0, { message: "La quantité doit être un nombre entier positif ou nul." })
  ),
  prixAchatUnitaire: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Le prix d'achat unitaire doit être positif ou nul." })
  ),
  prixVenteUnitaire: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Le prix de vente unitaire doit être positif ou nul." })
  ),
});

type StockItemFormValues = z.infer<typeof stockItemFormSchema>;

interface StockItemFormProps {
  onSubmit: (item: Omit<StockItem, 'id'>) => void;
  initialData?: StockItem;
  onCancel?: () => void;
}

const StockItemForm: React.FC<StockItemFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const form = useForm<StockItemFormValues>({
    resolver: zodResolver(stockItemFormSchema),
    defaultValues: {
      nom: initialData?.nom || '',
      description: initialData?.description || '',
      quantiteActuelle: initialData?.quantiteActuelle || 0,
      prixAchatUnitaire: initialData?.prixAchatUnitaire || 0,
      prixVenteUnitaire: initialData?.prixVenteUnitaire || 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        nom: initialData.nom,
        description: initialData.description,
        quantiteActuelle: initialData.quantiteActuelle,
        prixAchatUnitaire: initialData.prixAchatUnitaire,
        prixVenteUnitaire: initialData.prixVenteUnitaire,
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: StockItemFormValues) => {
    onSubmit(values as Omit<StockItem, 'id'>);
    form.reset();
    toast.success(initialData ? "Article modifié avec succès !" : "Article ajouté avec succès !");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l'article</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Ordinateur portable" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description de l'article" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantiteActuelle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantité Actuelle</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="prixAchatUnitaire"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix d'Achat Unitaire (FCFA)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prixVenteUnitaire"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix de Vente Unitaire (FCFA)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
              Annuler
            </Button>
          )}
          <Button type="submit" className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground">
            {initialData ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StockItemForm;