import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vehicle } from '@/types/parcauto';
import { toast } from 'sonner';

const vehicleFormSchema = z.object({
  marque: z.string().min(1, { message: "La marque est requise." }),
  modele: z.string().min(1, { message: "Le modèle est requis." }),
  annee: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1900, { message: "L'année doit être valide." }).max(new Date().getFullYear() + 1, { message: "L'année ne peut pas être dans le futur." })
  ),
  immatriculation: z.string().min(1, { message: "L'immatriculation est requise." }),
  kilometrage: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Le kilométrage doit être positif ou nul." })
  ),
  statut: z.enum(['actif', 'en maintenance', 'hors service'], { message: "Le statut est requis." }),
  dateAcquisition: z.string().min(1, { message: "La date d'acquisition est requise." }),
  description: z.string().optional(),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
  onSubmit: (vehicle: Omit<Vehicle, 'id'>) => void;
  initialData?: Vehicle;
  onCancel?: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      marque: initialData?.marque || '',
      modele: initialData?.modele || '',
      annee: initialData?.annee || new Date().getFullYear(),
      immatriculation: initialData?.immatriculation || '',
      kilometrage: initialData?.kilometrage || 0,
      statut: initialData?.statut || 'actif',
      dateAcquisition: initialData?.dateAcquisition || new Date().toISOString().split('T')[0],
      description: initialData?.description || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        marque: initialData.marque,
        modele: initialData.modele,
        annee: initialData.annee,
        immatriculation: initialData.immatriculation,
        kilometrage: initialData.kilometrage,
        statut: initialData.statut,
        dateAcquisition: initialData.dateAcquisition,
        description: initialData.description,
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: VehicleFormValues) => {
    onSubmit(values as Omit<Vehicle, 'id'>);
    form.reset();
    toast.success(initialData ? "Véhicule modifié avec succès !" : "Véhicule ajouté avec succès !");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="marque"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marque</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Toyota" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="modele"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modèle</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Corolla" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="annee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Année</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="immatriculation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Immatriculation</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: AB-123-CD" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="kilometrage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kilométrage</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
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
                <FormLabel>Statut</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="en maintenance">En maintenance</SelectItem>
                    <SelectItem value="hors service">Hors service</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="dateAcquisition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'acquisition</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
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
                <Textarea placeholder="Informations supplémentaires sur le véhicule" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
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
            {initialData ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VehicleForm;