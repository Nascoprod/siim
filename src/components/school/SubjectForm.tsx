import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Subject } from '@/types/school';
import { toast } from 'sonner';

const subjectFormSchema = z.object({
  name: z.string().min(1, { message: "Le nom de la matière est requis." }),
  coefficient: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, { message: "Le coefficient doit être un entier positif." })
  ),
});

type SubjectFormValues = z.infer<typeof subjectFormSchema>;

interface SubjectFormProps {
  onSubmit: (subject: Omit<Subject, 'id'>) => void;
  initialData?: Subject;
  onCancel?: () => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      coefficient: initialData?.coefficient || 1,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        coefficient: initialData.coefficient,
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: SubjectFormValues) => {
    onSubmit(values);
    form.reset();
    toast.success(initialData ? "Matière modifiée avec succès !" : "Matière ajoutée avec succès !");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la matière</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Mathématiques" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coefficient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coefficient</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
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

export default SubjectForm;