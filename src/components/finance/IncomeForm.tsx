import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Transaction } from '@/types/finance';
import { toast } from 'sonner';

const incomeFormSchema = z.object({
  date: z.string().min(1, { message: "La date est requise." }),
  designation: z.string().min(1, { message: "La désignation est requise." }),
  prixUnitaire: z.preprocess(
    (val) => Number(val),
    z.number().min(0.01, { message: "Le prix unitaire doit être positif." })
  ),
  nombre: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, { message: "Le nombre doit être au moins 1." })
  ),
});

type IncomeFormValues = z.infer<typeof incomeFormSchema>;

interface IncomeFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id' | 'type'>) => void;
  initialData?: Transaction;
  onCancel?: () => void;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      date: initialData?.date || new Date().toISOString().split('T')[0],
      designation: initialData?.designation || '',
      prixUnitaire: initialData?.prixUnitaire || 0,
      nombre: initialData?.nombre || 1,
    },
  });

  const { watch, setValue } = form;
  const prixUnitaire = watch('prixUnitaire');
  const nombre = watch('nombre');

  useEffect(() => {
    if (initialData) {
      setValue('date', initialData.date);
      setValue('designation', initialData.designation);
      setValue('prixUnitaire', initialData.prixUnitaire);
      setValue('nombre', initialData.nombre);
    }
  }, [initialData, setValue]);

  const handleFormSubmit = (values: IncomeFormValues) => {
    const prixTotal = values.prixUnitaire * values.nombre;
    onSubmit({ ...values, prixTotal });
    form.reset({
      date: new Date().toISOString().split('T')[0],
      designation: '',
      prixUnitaire: 0,
      nombre: 1,
    });
    toast.success(initialData ? "Revenu modifié avec succès !" : "Revenu ajouté avec succès !");
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
          name="designation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Désignation</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Vente de services" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
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
              <FormLabel>Prix Unitaire</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Label>Prix Total</Label>
          <Input
            type="text"
            value={(prixUnitaire * nombre).toFixed(2)}
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

export default IncomeForm;