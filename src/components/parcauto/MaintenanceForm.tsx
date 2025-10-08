import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Maintenance } from '@/types/parcauto';
import { toast } from 'sonner';

const maintenanceFormSchema = z.object({
  date: z.string().min(1, { message: "La date est requise." }),
  typeMaintenance: z.string().min(1, { message: "Le type de maintenance est requis." }),
  cout: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Le coût doit être positif ou nul." })
  ),
  description: z.string().optional(),
});

type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

interface MaintenanceFormProps {
  onSubmit: (maintenance: Omit<Maintenance, 'id' | 'vehicleId'>) => void;
  onCancel?: () => void;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      typeMaintenance: '',
      cout: 0,
      description: '',
    },
  });

  const handleFormSubmit = (values: MaintenanceFormValues) => {
    onSubmit(values);
    form.reset({
      date: new Date().toISOString().split('T')[0],
      typeMaintenance: '',
      cout: 0,
      description: '',
    });
    toast.success("Maintenance enregistrée avec succès !");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de maintenance</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="typeMaintenance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de maintenance</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Vidange, Réparation moteur" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cout"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coût (FCFA)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
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
              <FormLabel>Description (optionnel)</FormLabel>
              <FormControl>
                <Textarea placeholder="Détails de la maintenance effectuée" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
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
            Enregistrer Maintenance
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MaintenanceForm;