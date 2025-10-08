import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SystemSettings } from '@/types/configuration';
import { toast } from 'sonner';

const systemSettingsFormSchema = z.object({
  companyName: z.string().min(1, { message: "Le nom de l'entreprise est requis." }),
  companyAddress: z.string().min(1, { message: "L'adresse de l'entreprise est requise." }),
  companyPhone: z.string().min(1, { message: "Le numéro de téléphone est requis." }),
  companyEmail: z.string().email({ message: "L'adresse email doit être valide." }).min(1, { message: "L'adresse email est requise." }),
  defaultTvaRate: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Le taux de TVA doit être positif ou nul." }).max(1, { message: "Le taux de TVA ne peut pas dépasser 100%." })
  ),
  currencySymbol: z.string().min(1, { message: "Le symbole monétaire est requis." }),
});

type SystemSettingsFormValues = z.infer<typeof systemSettingsFormSchema>;

interface SystemSettingsFormProps {
  onSubmit: (settings: Omit<SystemSettings, 'id'>) => void;
  initialData?: SystemSettings;
  onCancel?: () => void;
}

const SystemSettingsForm: React.FC<SystemSettingsFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const form = useForm<SystemSettingsFormValues>({
    resolver: zodResolver(systemSettingsFormSchema),
    defaultValues: {
      companyName: initialData?.companyName || '',
      companyAddress: initialData?.companyAddress || '',
      companyPhone: initialData?.companyPhone || '',
      companyEmail: initialData?.companyEmail || '',
      defaultTvaRate: initialData?.defaultTvaRate || 0.18, // Default 18%
      currencySymbol: initialData?.currencySymbol || 'FCFA',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        companyName: initialData.companyName,
        companyAddress: initialData.companyAddress,
        companyPhone: initialData.companyPhone,
        companyEmail: initialData.companyEmail,
        defaultTvaRate: initialData.defaultTvaRate,
        currencySymbol: initialData.currencySymbol,
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: SystemSettingsFormValues) => {
    onSubmit(values);
    toast.success("Paramètres du système mis à jour avec succès !");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <h3 className="text-xl font-semibold text-primary-erp mb-4">Informations sur l'entreprise</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l'entreprise</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de votre entreprise" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: +225 07 00 00 00 00" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="companyAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Textarea placeholder="Adresse complète de l'entreprise" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contact@entreprise.com" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="text-xl font-semibold text-primary-erp mt-8 mb-4">Paramètres financiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="defaultTvaRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taux de TVA par défaut (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Ex: 0.18 pour 18%" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currencySymbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Symbole Monétaire</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: FCFA, €" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 mt-8">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
              Annuler
            </Button>
          )}
          <Button type="submit" className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground">
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SystemSettingsForm;