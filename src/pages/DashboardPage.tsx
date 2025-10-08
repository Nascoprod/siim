import React from "react";

const DashboardPage = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-4 text-primary-erp">Bienvenue sur GESTION BKS</h1>
      <p className="text-xl text-gray-700">
        Votre plateforme ERP complète pour gérer vos finances, votre personnel, vos stocks et bien plus encore.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-primary-erp text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Finance</h2>
          <p>Gérez vos entrées, sorties et rapports financiers.</p>
        </div>
        <div className="bg-secondary-erp text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Personnel</h2>
          <p>Suivez les informations de vos employés et leurs salaires.</p>
        </div>
        <div className="bg-gray-700 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Stock</h2>
          <p>Contrôlez les mouvements de vos produits en stock.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;