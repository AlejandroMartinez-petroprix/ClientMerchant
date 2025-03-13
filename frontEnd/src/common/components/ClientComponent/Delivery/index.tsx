"use client";

import { useState, useEffect } from "react";
import { Tabs, Card, Button } from "antd";
import TableComponent from "@/common/components/TableComponent";
import SearchForm from "@/common/components/SearchFormComponent";
import GenericForm from "@/common/components/FormComponent"; 
import { Client } from "../Delivery/interface";
import { getClients, createClient, updateClient } from "../Infrastructure/clients"; 
import { useAuth } from "@/context/AuthContext";

interface Props {
  searchParams: { name?: string; email?: string; id?: string };
}

export default function ClientComponent({ searchParams }: Props) {
  const { token } = useAuth();
  const [isClientFormOpen, setClientFormOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [initialClients, setInitialClients] = useState<Client[]>([]);
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [simpleOutput, setSimpleOutput] = useState(false);
  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    setIsClient(true);
    const loadClients = async () => {
      if (!token) {
        setInitialClients([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedClients = await getClients({}, token);
        setInitialClients(fetchedClients);
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, [token]);

  const handleOpenClientForm = (client?: Client) => {
    setClientToEdit(client || null);
    setClientFormOpen(true);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setInitialClients((prevClients) =>
      prevClients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  const handleSearch = async (filters: { name?: string; email?: string; id?: string }, simpleOutputValue: boolean) => {
    if (!token) return;
    if (!filters.name && !filters.email && !filters.id) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    try {
      const results: Client[] = await getClients(filters, token, simpleOutputValue);
      setSimpleOutput(simpleOutputValue);
      setSearchResults(results);
      setHasSearched(true);
      
    } catch {
      setSearchResults([]);
      setHasSearched(true);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === "all") {
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  const clientColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Teléfono", dataIndex: "phone", key: "phone" },
  ];
  
  if (!isClient) return <p className="text-center text-gray-500 mt-4">Cargando...</p>;


  const tabItems = [
    {
      key: "all",
      label: "Todos los Clientes",
      children: isLoading ? (
        <p className="text-center text-gray-500 mt-4">Cargando...</p>
      ) : token ? (
        <TableComponent
          data={initialClients}
          columns={clientColumns}
          onEdit={handleOpenClientForm}
          simpleOutput={false}
        />
      ) : (
        <p className="text-center text-red-500 mt-4">Debes iniciar sesión para ver los clientes.</p>
      ),
    },
    {
      key: "search",
      label: "Buscar",
      children: (
        <Card>
          <SearchForm
            fields={[
              { key: "name", label: "Buscar por Nombre", placeholder: "Nombre del cliente" },
              { key: "email", label: "Buscar por Email", placeholder: "Email del cliente", type: "email" },
              { key: "id", label: "Buscar por ID", placeholder: "ID del cliente" },
            ]}
            onSearch={handleSearch}
            errorMessage="Cliente no encontrado."
            title="Buscar Cliente"
            simpleOutput={simpleOutput}
          />
          {hasSearched ? (
            searchResults.length > 0 ? (
              <TableComponent
                data={searchResults}
                columns={clientColumns}
                onEdit={handleOpenClientForm}
                simpleOutput={searchParams?.id ? simpleOutput : false}
              />
            ) : (
              <p className="text-center text-red-500 mt-4">Cliente no encontrado.</p>
            )
          ) : (
            <p className="text-center text-gray-500 mt-4">Aquí aparecerán los resultados de las búsquedas</p>
          )}
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
        {token && <Button type="primary" onClick={() => handleOpenClientForm()}>Nuevo Cliente</Button>}
      </div>
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
      
      <GenericForm
        isOpen={isClientFormOpen}
        onClose={() => setClientFormOpen(false)}
        entityData={clientToEdit || undefined}
        onUpdateEntity={handleUpdateClient}
        onCreateEntity={(newClient) => setInitialClients([...initialClients, newClient])}
        entityType="client"
        fields={[
          { key: "id", label: "ID", disabled: true },
          { key: "cifNifNie", label: "CIF/NIF/NIE", required: true, disabled: !!clientToEdit },
          { key: "name", label: "Nombre", required: true },
          { key: "surname", label: "Apellido" },
          { key: "phone", label: "Teléfono", required: true },
          { key: "email", label: "Correo", type: "email", required: true },
        ]}
        createEntity={(values) => createClient(values, token)}
        updateEntity={(id, values) => updateClient(id, values, token)}
      />
    </div>
  );
}
