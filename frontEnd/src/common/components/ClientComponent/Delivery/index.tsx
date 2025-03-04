"use client";

import { useState } from "react";
import { Button } from "antd";
import { ClientForm } from "./components/ClientForm";
import SearchClientForm  from "./components/SearchClientForm";
import { Client } from "./interface";  // 👈 Importamos la interfaz Client

export default function ClientManagement() {
  const [isClientFormOpen, setClientFormOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const handleOpenClientForm = (client?: Client) => {
    setClientToEdit(client || null);
    setClientFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
        <Button type="primary" onClick={() => handleOpenClientForm()}>Nuevo Cliente</Button>
      </div>

      <SearchClientForm />

      <ClientForm
        isOpen={isClientFormOpen}
        onClose={() => setClientFormOpen(false)}
        clientData={clientToEdit || undefined}
      />
    </div>
  );
}
