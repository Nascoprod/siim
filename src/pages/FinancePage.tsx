import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import FinanceCard from '@/components/finance/FinanceCard';
import IncomeForm from '@/components/finance/IncomeForm';
import IncomeTable from '@/components/finance/IncomeTable';
import ExpenseForm from '@/components/finance/ExpenseForm';
import ExpenseTable from '@/components/finance/ExpenseTable';
import PointSummary from '@/components/finance/PointSummary';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types/finance';
import { toast } from 'sonner';

const FinancePage = () => {
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [isIncomeFormOpen, setIsIncomeFormOpen] = useState(false);
  const [isIncomeTableOpen, setIsIncomeTableOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isExpenseTableOpen, setIsExpenseTableOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Transaction | undefined>(undefined);
  const [editingExpense, setEditingExpense] = useState<Transaction | undefined>(undefined);

  const totalIncomes = useMemo(() => incomes.reduce((sum, t) => sum + t.prixTotal, 0), [incomes]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, t) => sum + t.prixTotal, 0), [expenses]);
  const totalCash = useMemo(() => totalIncomes - totalExpenses, [totalIncomes, totalExpenses]);

  const handleAddIncome = (newIncome: Omit<Transaction, 'id' | 'type'>) => {
    if (editingIncome) {
      setIncomes(incomes.map(inc => inc.id === editingIncome.id ? { ...newIncome, id: inc.id, type: 'income' } : inc));
      setEditingIncome(undefined);
    } else {
      setIncomes([...incomes, { ...newIncome, id: uuidv4(), type: 'income' }]);
    }
    setIsIncomeFormOpen(false);
  };

  const handleEditIncome = (incomeToEdit: Transaction) => {
    setEditingIncome(incomeToEdit);
    setIsIncomeFormOpen(true);
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes(incomes.filter(income => income.id !== id));
    toast.success("Revenu supprimé avec succès !");
  };

  const handleAddExpense = (newExpense: Omit<Transaction, 'id' | 'type'>) => {
    if (editingExpense) {
      setExpenses(expenses.map(exp => exp.id === editingExpense.id ? { ...newExpense, id: exp.id, type: 'expense' } : exp));
      setEditingExpense(undefined);
    } else {
      setExpenses([...expenses, { ...newExpense, id: uuidv4(), type: 'expense' }]);
    }
    setIsExpenseFormOpen(false);
  };

  const handleEditExpense = (expenseToEdit: Transaction) => {
    setEditingExpense(expenseToEdit);
    setIsExpenseFormOpen(true);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast.success("Dépense supprimée avec succès !");
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-4xl font-bold text-primary-erp mb-6">Module Finance</h1>

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
          onView={() => toast.info("Le 'Point Caisse' est affiché ci-dessous.")} // Point summary is always visible
          onAdd={() => toast.info("Le 'Point Caisse' est un résumé, pas une entrée directe.")}
          className="bg-white shadow-md"
        />
      </div>

      <PointSummary totalIncomes={totalIncomes} totalExpenses={totalExpenses} totalCash={totalCash} />

      {/* Income Form Dialog */}
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

      {/* Income Table Dialog */}
      <Dialog open={isIncomeTableOpen} onOpenChange={setIsIncomeTableOpen}>
        <DialogContent className="sm:max-w-4xl bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>Liste des Entrées</DialogTitle>
          </DialogHeader>
          <IncomeTable incomes={incomes} onEdit={handleEditIncome} onDelete={handleDeleteIncome} />
        </DialogContent>
      </Dialog>

      {/* Expense Form Dialog */}
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

      {/* Expense Table Dialog */}
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