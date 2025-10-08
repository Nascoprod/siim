import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grade, Subject } from '@/types/school';
import { toast } from 'sonner';

const gradeFormSchema = z.object({
  subjectId: z.string().min(1, { message: "La matière est requise." }),
  compositionName: z.string().min(1, { message: "Le nom de la composition est requis." }),
  score: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "La note doit être positive ou nulle." }).max(20, { message: "La note ne peut pas dépasser 20." })
  ),
  date: z.string().min(1, { message: "La date est requise." }),
});

type GradeFormValues = z.infer<typeof gradeFormSchema>;

interface GradeFormProps {
  onSubmit: (grade: Omit<Grade, 'id' | 'studentId'>) => void;
  initialData?: Grade;
  subjects: Subject[]; // Pass available subjects to the form
  onCancel?: () => void;
}

const GradeForm: React.FC<GradeFormProps> = ({ onSubmit, initialData, subjects, onCancel }) => {
  const form = useForm<GradeFormValues>({
    resolver: zodResolver(gradeFormSchema),
    defaultValues: {
      subjectId: initialData?.subjectId || '',
      compositionName: initialData?.compositionName || '',
      score: initialData?.score || 0,
      date: initialData?.date || new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        subjectId: initialData.subjectId,
        compositionName: initialData.compositionName,
        score: initialData.score,
        date: initialData.date,
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: GradeFormValues) => {
    onSubmit(values);
    form.reset();
    toast.success(initialData ? "Note modifiée avec succès !" : "Note ajoutée avec succès !");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matière</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp">
                    <SelectValue placeholder="Sélectionner une matière" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="compositionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la composition</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Composition N°1" {...field} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (sur 20)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="border-primary-erp focus:ring-primary-erp focus:border-primary-erp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

export default GradeForm;