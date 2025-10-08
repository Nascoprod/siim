import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LineItem } from '@/types/devisfactures';
import { toast } from 'sonner';

const lineItemFormSchema = z.object({
  description: z.string().min(1, { message: "La description est requise." }),
  quantite: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, { message: "La quantité doit être au moins 1." })
  ),
  prixUnitaire: z.preprocess(
    (val) => Number(val),
    z.number().min(0.01, { message: "Le prix unitaire doit être positif." })
  ),
});

type LineItemFormValues = z.infer<typeof lineItemFormSchema>;

interface LineItemFormProps {
  onSubmit: (item: Omit<LineItem, 'id'>) => void;
  initialData?: LineItem;
  onCancel?: () => void;
}

const LineItemForm: React.FC<LineItemFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const form = useForm<LineItemFormValues>({
    resolver: zodResolver(lineItemFormSchema),
    defaultValues: {
      description: initialData?.description || '',
      quantite: initialData?.quantite || 1,
      prixUnitaire: initialData?.prixUnitaire || 0,
    },
  });

  const { watch, setValue } = form;
  const quantite = watch('quantite');
  const prixUnitaire = watch('prixUnitaire');

  useEffect(() => {
    if (initialData) {
      setValue('description', initialData.description);
      setValue('quantite', initialData.quantite);
      setValue('prixUnitaire', initialData.prixUnitaire);
    }
  }, [initialData, setValue]);

  const handleFormSubmit = (values: LineItemFormValues) => {
    const prixTotal = values.quantite * values.prixUnitaire;
    onSubmit({ ...values, prixTotal });
    form.reset({
      description: '',
      quantite: 1,
      prixUnitaire: 0,
    });
    toast.success(initialData ? "Article modifié avec succès !" : "Article ajouté avec succès !");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Service de consultation" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantité</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prixUnitaire"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix Unitaire (FCFA)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormLabel>Prix Total</FormLabel>
          <Input
            type="text"
            value={(quantite * prixUnitaire).toFixed(2) + " FCFA"}
            readOnly
            className="mt-1 bg-gray-100 border-primary-erp focus:ring-primary-erp focus:border-primary-erp"
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

export default LineItemForm;