import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StockMovement } from '@/types/stock';
import { toast } from 'sonner';

const stockMovementFormSchema = z.object({
  date: z.string().min(1, { message: "La date est requise." }),
  type: z.enum(['entree', 'sortie'], { message: "Le type de mouvement est requis." }),
  quantite: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, { message: "La quantité doit être au moins 1." })
  ),
  raison: z.string().min(1, { message: "La raison du mouvement est requise." }),
});

type StockMovementFormValues = z.infer<typeof stockMovementFormSchema>;

interface StockMovementFormProps {
  onSubmit: (movement: Omit<StockMovement, 'id' | 'itemId'>) => void;
  onCancel?: () => void;
}

const StockMovementForm: React.FC<StockMovementFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm<StockMovementFormValues>({
    resolver: zodResolver(stockMovementFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      type: 'entree',
      quantite: 1,
      raison: '',
    },
  });

  const handleFormSubmit = (values: StockMovementFormValues) => {
    onSubmit(values);
    form.reset({
      date: new Date().toISOString().split('T')[0],
      type: 'entree',
      quantite: 1,
      raison: '',
    });
    toast.success("Mouvement de stock enregistré avec succès !");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de mouvement</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="entree">Entrée</SelectItem>
                  <SelectItem value="sortie">Sortie</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="raison"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Raison</FormLabel>
              <FormControl>
                <Textarea placeholder="Raison du mouvement (ex: Achat, Vente, Perte)" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
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
            Enregistrer Mouvement
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StockMovementForm;