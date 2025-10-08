import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuoteForm from '@/components/devisfactures/QuoteForm';
import QuoteTable from '@/components/devisfactures/QuoteTable';
import InvoiceForm from '@/components/devisfactures/InvoiceForm';
import InvoiceTable from '@/components/devisfactures/InvoiceTable';
import { Quote, Invoice } from '@/types/devisfactures';
import { toast } from 'sonner';

const DevisFacturesPage = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | undefined>(undefined);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>(undefined);
  const [quoteToInvoice, setQuoteToInvoice] = useState<Quote | undefined>(undefined);

  // Quote Handlers
  const handleAddQuote = (newQuote: Omit<Quote, 'id'>) => {
    if (editingQuote) {
      setQuotes(quotes.map(q => q.id === editingQuote.id ? { ...newQuote, id: q.id } : q));
      setEditingQuote(undefined);
    } else {
      setQuotes([...quotes, { ...newQuote, id: uuidv4() }]);
    }
    setIsQuoteFormOpen(false);
  };

  const handleEditQuote = (quoteToEdit: Quote) => {
    setEditingQuote(quoteToEdit);
    setIsQuoteFormOpen(true);
  };

  const handleDeleteQuote = (id: string) => {
    setQuotes(quotes.filter(q => q.id !== id));
    toast.success("Devis supprimé avec succès !");
  };

  const handleConvertToInvoice = (quote: Quote) => {
    setQuoteToInvoice(quote);
    setIsInvoiceFormOpen(true);
    // Optionally, update quote status to 'facturé' immediately or after invoice creation
    setQuotes(quotes.map(q => q.id === quote.id ? { ...q, statut: 'facturé' } : q));
  };

  // Invoice Handlers
  const handleAddInvoice = (newInvoice: Omit<Invoice, 'id'>) => {
    if (editingInvoice) {
      setInvoices(invoices.map(inv => inv.id === editingInvoice.id ? { ...newInvoice, id: inv.id } : inv));
      setEditingInvoice(undefined);
    } else {
      setInvoices([...invoices, { ...newInvoice, id: uuidv4() }]);
    }
    setIsInvoiceFormOpen(false);
    setQuoteToInvoice(undefined); // Clear quote data after invoice creation
  };

  const handleEditInvoice = (invoiceToEdit: Invoice) => {
    setEditingInvoice(invoiceToEdit);
    setIsInvoiceFormOpen(true);
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
    toast.success("Facture supprimée avec succès !");
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-4xl font-bold text-primary-erp mb-6">Module Devis & Factures</h1>

      <Tabs defaultValue="quotes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-primary-erp/10 text-primary-erp">
          <TabsTrigger value="quotes" className="data-[state=active]:bg-primary-erp data-[state=active]:text-primary-erp-foreground">Devis</TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-primary-erp data-[state=active]:text-primary-erp-foreground">Factures</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes">
          <Card className="bg-white shadow-lg rounded-lg p-6 mt-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold text-primary-erp flex items-center">
                <FileText className="mr-2 h-6 w-6" /> Liste des Devis
              </CardTitle>
              <Button onClick={() => { setIsQuoteFormOpen(true); setEditingQuote(undefined); }} className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground">
                <Plus className="mr-2 h-4 w-4" /> Créer Devis
              </Button>
            </CardHeader>
            <CardContent className="mt-4">
              <QuoteTable
                quotes={quotes}
                onEdit={handleEditQuote}
                onDelete={handleDeleteQuote}
                onConvertToInvoice={handleConvertToInvoice}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card className="bg-white shadow-lg rounded-lg p-6 mt-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold text-primary-erp flex items-center">
                <FileText className="mr-2 h-6 w-6" /> Liste des Factures
              </CardTitle>
              <Button onClick={() => { setIsInvoiceFormOpen(true); setEditingInvoice(undefined); setQuoteToInvoice(undefined); }} className="bg-primary-erp hover:bg-primary-erp/90 text-primary-erp-foreground">
                <Plus className="mr-2 h-4 w-4" /> Créer Facture
              </Button>
            </CardHeader>
            <CardContent className="mt-4">
              <InvoiceTable
                invoices={invoices}
                onEdit={handleEditInvoice}
                onDelete={handleDeleteInvoice}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quote Form Dialog */}
      <Dialog open={isQuoteFormOpen} onOpenChange={setIsQuoteFormOpen}>
        <DialogContent className="sm:max-w-4xl bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>{editingQuote ? "Modifier le devis" : "Créer un nouveau devis"}</DialogTitle>
          </DialogHeader>
          <QuoteForm
            onSubmit={handleAddQuote}
            initialData={editingQuote}
            onCancel={() => {
              setIsQuoteFormOpen(false);
              setEditingQuote(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Invoice Form Dialog */}
      <Dialog open={isInvoiceFormOpen} onOpenChange={setIsInvoiceFormOpen}>
        <DialogContent className="sm:max-w-4xl bg-white text-primary-erp">
          <DialogHeader>
            <DialogTitle>{editingInvoice ? "Modifier la facture" : (quoteToInvoice ? `Créer une facture à partir du devis ${quoteToInvoice.clientName}` : "Créer une nouvelle facture")}</DialogTitle>
          </DialogHeader>
          <InvoiceForm
            onSubmit={handleAddInvoice}
            initialData={editingInvoice}
            quoteData={quoteToInvoice}
            onCancel={() => {
              setIsInvoiceFormOpen(false);
              setEditingInvoice(undefined);
              setQuoteToInvoice(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DevisFacturesPage;