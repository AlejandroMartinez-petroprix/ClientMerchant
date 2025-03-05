"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Button, Tabs, Card } from "antd";
import { ClientForm } from "@/common/components/ClientComponent/Delivery/components/ClientForm";
import SearchClientForm from "@/common/components/ClientComponent/Delivery/components/SearchClientForm";
import ClientTable from "@/common/components/TableComponent/Delivery/components/ClientTable";
import { Client } from "@/common/components/ClientComponent/Delivery/interface";
import clientsUseCases from "@/service/src/application/queries/lib/clients";

export default function ClientManagement() {
  const [isClientFormOpen, setClientFormOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (activeTab === "all") {
      fetchClients();
    }
  }, [activeTab]);

  const fetchClients = async () => {
    try {
      const signal = new AbortController().signal;
      const response = await clientsUseCases.getAllClients(signal);
      if (Array.isArray(response)) {
        setClients(response);
      }
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const handleOpenClientForm = (client?: Client) => {
    setClientToEdit(client || null);
    setClientFormOpen(true);
  };

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const tabItems = [
    {
      key: "all",
      label: "Todos los Clientes",
      children: <ClientTable clients={clients} onEdit={handleOpenClientForm} onDelete={() => {}} />,
    },
    {
      key: "search",
      label: "Buscar",
      children: (
        <Card>
          <SearchClientForm setClients={setSearchResults} updateSearchParams={updateSearchParams} />
          {searchResults.length > 0 && (
            <ClientTable clients={searchResults} onEdit={handleOpenClientForm} onDelete={() => {}} />
          )}
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
        <Button type="primary" onClick={() => handleOpenClientForm()}>
          Nuevo Cliente
        </Button>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {/* Formulario de creación/edición de cliente */}
      <ClientForm
        isOpen={isClientFormOpen}
        onClose={() => setClientFormOpen(false)}
        clientData={clientToEdit || undefined}
      />
    </div>
  );
}
