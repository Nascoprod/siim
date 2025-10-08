import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Personnel } from '@/types/personnel';
import { toast } from 'sonner';

const personnelFormSchema = z.object({
  nom: z.string().min(1, { message: "Le nom est requis." }),
  prenoms: z.string().min(1, { message: "Les prénoms sont requis." }),
  dateNaissance: z.string().min(1, { message: "La date de naissance est requise." }),
  email: z.string().email({ message: "L'email doit être valide." }),
  contact: z.string().min(1, { message: "Le contact est requis." }),
  dateEmbauche: z.string().min(1, { message: "La date d'embauche est requise." }),
  dateFinContrat: z.string().optional().nullable(),
  salaireDeBase: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Le salaire de base doit être positif." })
  ),
  poste: z.string().min(1, { message: "Le poste est requis." }),
});

type PersonnelFormValues = z.infer<typeof personnelFormSchema>;

interface PersonnelFormProps {
  onSubmit: (personnel: Omit<Personnel, 'id'>) => void;
  initialData?: Personnel;
  onCancel?: () => void;
}

const PersonnelForm: React.FC<PersonnelFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const form = useForm<PersonnelFormValues>({
    resolver: zodResolver(personnelFormSchema),
    defaultValues: {
      nom: initialData?.nom || '',
      prenoms: initialData?.prenoms || '',
      dateNaissance: initialData?.dateNaissance || '',
      email: initialData?.email || '',
      contact: initialData?.contact || '',
      dateEmbauche: initialData?.dateEmbauche || '',
      dateFinContrat: initialData?.dateFinContrat || '',
      salaireDeBase: initialData?.salaireDeBase || 0,
      poste: initialData?.poste || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        nom: initialData.nom,
        prenoms: initialData.prenoms,
        dateNaissance: initialData.dateNaissance,
        email: initialData.email,
        contact: initialData.contact,
        dateEmbauche: initialData.dateEmbauche,
        dateFinContrat: initialData.dateFinContrat || '',
        salaireDeBase: initialData.salaireDeBase,
        poste: initialData.poste,
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: PersonnelFormValues) => {
    onSubmit(values as Omit<Personnel, 'id'>);
    form.reset();
    toast.success(initialData ? "Personnel modifié avec succès !" : "Personnel ajouté avec succès !");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prenoms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénoms</FormLabel>
                <FormControl>
                  <Input placeholder="Prénoms" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dateNaissance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de Naissance</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <Input placeholder="Téléphone" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="poste"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poste</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Développeur" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dateEmbauche"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date d'embauche</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateFinContrat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de fin de contrat (optionnel)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="salaireDeBase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salaire de Base (FCFA)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
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

export default PersonnelForm;