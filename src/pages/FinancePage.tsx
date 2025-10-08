import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import FinanceCard from '@/components/finance/FinanceCard';
import IncomeForm from '@/components/finance/IncomeForm';
import IncomeTable from '@/components/finance/IncomeTable';
import ExpenseForm from '@/components/finance/ExpenseForm';
import ExpenseTable from '@/components/finance/ExpenseTable';
import PointSummary from '@/components/finance/PointSummary';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Transaction } from '@/types/finance';

// ✅ Générateur d'identifiants universel (compatible navigateur et Node)
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
};

const FinancePage: React.FC = () => {
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [isIncomeFormOpen, setIsIncomeFormOpen] = useState(false);
  const [isIncomeTableOpen, setIsIncomeTableOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isExpenseTableOpen, setIsExpenseTableOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Transaction | undefined>(undefined);
  const [editingExpense, setEditingExpense] = useState<Transaction | undefined>(undefined);

  // ✅ Totaux calculés automatiquement
  const totalIncomes = useMemo(
    () => incomes.reduce((sum, t) => sum + t.prixTotal, 0),
    [incomes]
  );
  const totalExpenses = useMemo(
    () => expenses.reduce((sum, t) => sum + t.prixTotal, 0),
    [expenses]
  );
  const totalCash = useMemo(() => totalIncomes - totalExpenses, [totalIncomes, totalExpenses]);

  // ✅ Gestion des revenus
  const handleAddIncome = (newIncome: Omit<Transaction, 'id' | 'type'>) => {
    if (editingIncome) {
      setIncomes((prev) =>
        prev.map((inc) =>
          inc.id === editingIncome.id
            ? { ...newIncome, id: inc.id, type: 'income' }
            : inc
        )
      );
      setEditingIncome(undefined);
    } else {
      setIncomes((prev) => [...prev, { ...newIncome, id: generateId(), type: 'income' }]);
    }
    setIsIncomeFormOpen(false);
    toast.success(editingIncome ? "Revenu modifié avec succès !" : "Revenu ajouté !");
  };

  const handleEditIncome = (incomeToEdit: Transaction) => {
    setEditingIncome(incomeToEdit);
    setIsIncomeFormOpen(true);
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes((prev) => prev.filter((income) => income.id !== id));
    toast.success("Revenu supprimé avec succès !");
  };

  // ✅ Gestion des dépenses
  const handleAddExpense = (newExpense: Omit<Transaction, 'id' | 'type'>) => {
    if (editingExpense) {
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === editingExpense.id
            ? { ...newExpense, id: exp.id, type: 'expense' }
            : exp
        )
      );
      setEditingExpense(undefined);
    } else {
      setExpenses((prev) => [...prev, { ...newExpense, id: generateId(), type: 'expense' }]);
    }
    setIsExpenseFormOpen(false);
    toast.success(editingExpense ? "Dépense modifiée avec succès !" : "Dépense ajoutée !");
  };

  const handleEditExpense = (expenseToEdit: Transaction) => {
    setEditingExpense(expenseToEdit);
    setIsExpenseFormOpen(true);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    toast.success("Dépense supprimée avec succès !");
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-4xl font-bold text-primary-erp mb-6">Module Finance</h1>

      {/* ✅ Cartes principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FinanceCard
          title="Entrées"
          value={`${totalIncomes.toFixed(2)} €`}
          icon={<TrendingUp className="h-6 w-6 text-green-600" />}
          onView={() => setIsIncomeTableOpen(true)}
          onAdd={() => setIsIncomeFormOpen(true)}
          className="bg-white shadow-md"
        />

        <FinanceCard
          title="Sorties"
          value={`${totalExpenses.toFixed(2)} €`}
          icon={<TrendingDown className="h-6 w-6 text-red-600" />}
          onView={() => setIsExpenseTableOpen(true)}
          onAdd={() => setIsExpenseFormOpen(true)}
          className="bg-white shadow-md"
        />

        <FinanceCard
          title="Point Caisse"
          value={`${totalCash.toFixed(2)} €`}
          icon={<DollarSign className="h-6 w-6 text-blue-600" />}
          onView={() => toast.info("Le 'Point Caisse' est affiché ci-dessous.")}
          onAdd={() => toast.info("Le 'Point Caisse' est un résumé, pas une entrée directe.")}
          className="bg-white shadow-md"
        />
      </div>

      {/* ✅ Résumé global */}
      <PointSummary
        totalIncomes={totalIncomes}
        totalExpenses={totalExpenses}
        totalCash={totalCash}
      />

      {/* ✅ Dialog Revenu */}
      <Dialog open={isIncomeFormOpen} onOpenChange={setIsIncomeFormOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>{editingIncome ? "Modifier un revenu" : "Ajouter un revenu"}</DialogTitle>
          </DialogHeader>
          <IncomeForm
            onSubmit={handleAddIncome}
            initialData={editingIncome}
            onCancel={() => {
              setIsIncomeFormOpen(false);
              setEditingIncome(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* ✅ Table des revenus */}
      <Dialog open={isIncomeTableOpen} onOpenChange={setIsIncomeTableOpen}>
        <DialogContent className="sm:max-w-4xl bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>Liste des Entrées</DialogTitle>
          </DialogHeader>
          <IncomeTable incomes={incomes} onEdit={handleEditIncome} onDelete={handleDeleteIncome} />
        </DialogContent>
      </Dialog>

      {/* ✅ Dialog Dépense */}
      <Dialog open={isExpenseFormOpen} onOpenChange={setIsExpenseFormOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>{editingExpense ? "Modifier une dépense" : "Ajouter une dépense"}</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            onSubmit={handleAddExpense}
            initialData={editingExpense}
            onCancel={() => {
              setIsExpenseFormOpen(false);
              setEditingExpense(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* ✅ Table des dépenses */}
      <Dialog open={isExpenseTableOpen} onOpenChange={setIsExpenseTableOpen}>
        <DialogContent className="sm:max-w-4xl bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>Liste des Sorties</DialogTitle>
          </DialogHeader>
          <ExpenseTable expenses={expenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancePage;
