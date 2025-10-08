import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Property } from '@/types/immobilier';
import { toast } from 'sonner';

const propertyFormSchema = z.object({
  adresse: z.string().min(1, { message: "L'adresse est requise." }),
  ville: z.string().min(1, { message: "La ville est requise." }),
  codePostal: z.string().min(1, { message: "Le code postal est requis." }),
  typeBien: z.enum(['appartement', 'maison', 'bureau', 'terrain', 'local commercial', 'autre'], { message: "Le type de bien est requis." }),
  nombrePieces: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0, { message: "Le nombre de pièces doit être un entier positif ou nul." })
  ),
  surface: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "La surface doit être positive ou nulle." })
  ),
  prixAchat: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Le prix d'achat doit être positif ou nul." })
  ),
  prixLocationMensuel: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(0, { message: "Le prix de location doit être positif ou nul." }).optional().nullable()
  ),
  statut: z.enum(['disponible', 'loué', 'vendu', 'en maintenance'], { message: "Le statut est requis." }),
  description: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
  onSubmit: (property: Omit<Property, 'id'>) => void;
  initialData?: Property;
  onCancel?: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      adresse: initialData?.adresse || '',
      ville: initialData?.ville || '',
      codePostal: initialData?.codePostal || '',
      typeBien: initialData?.typeBien || 'appartement',
      nombrePieces: initialData?.nombrePieces || 0,
      surface: initialData?.surface || 0,
      prixAchat: initialData?.prixAchat || 0,
      prixLocationMensuel: initialData?.prixLocationMensuel || undefined,
      statut: initialData?.statut || 'disponible',
      description: initialData?.description || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        adresse: initialData.adresse,
        ville: initialData.ville,
        codePostal: initialData.codePostal,
        typeBien: initialData.typeBien,
        nombrePieces: initialData.nombrePieces,
        surface: initialData.surface,
        prixAchat: initialData.prixAchat,
        prixLocationMensuel: initialData.prixLocationMensuel,
        statut: initialData.statut,
        description: initialData.description,
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: PropertyFormValues) => {
    onSubmit(values as Omit<Property, 'id'>);
    form.reset();
    toast.success(initialData ? "Bien immobilier modifié avec succès !" : "Bien immobilier ajouté avec succès !");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="adresse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 123 Rue Principale" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ville"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Abidjan" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="codePostal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code Postal</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 00225" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="typeBien"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de Bien</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="appartement">Appartement</SelectItem>
                    <SelectItem value="maison">Maison</SelectItem>
                    <SelectItem value="bureau">Bureau</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                    <SelectItem value="local commercial">Local Commercial</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nombrePieces"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de Pièces</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="surface"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surface (m²)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="prixAchat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix d'Achat (FCFA)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prixLocationMensuel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix Location Mensuel (FCFA) (optionnel)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="loué">Loué</SelectItem>
                  <SelectItem value="vendu">Vendu</SelectItem>
                  <SelectItem value="en maintenance">En maintenance</SelectItem>
                </SelectContent>
              </Select>
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
                <Textarea placeholder="Description du bien immobilier" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
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

export default PropertyForm;