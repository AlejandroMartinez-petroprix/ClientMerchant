"use client";

import { useState, useEffect } from "react";
import { Tabs, Card, Button } from "antd";
import TableComponent from "@/common/components/TableComponent/Delivery/components/TableComponent";
import SearchClientForm from "./components/SearchClientForm";
import  ClientForm  from "./components/ClientForm";
import { Client } from "../Delivery/interface";
import { fetchAllClients, searchClients } from "../Infrastructure/clients";
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

  useEffect(() => {
    const loadClients = async () => {
      if (!token) {
        setInitialClients([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedClients = await fetchAllClients(token);
        setInitialClients(fetchedClients); 
      } catch (error) {
        console.error("Error al obtener clientes:", error);
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
      let results: Client[] = [];

      if (filters.name) {
        results = await searchClients({ name: filters.name }, token);
      } else if (filters.email) {
        results = await searchClients({ email: filters.email }, token);
      } else if (filters.id) {
        results = await searchClients({ id: filters.id }, token);
      }

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

  const tabItems = [
    {
      key: "all",
      label: "Todos los Clientes",
      children: isLoading ? (
        <p className="text-center text-gray-500 mt-4">Cargando...</p>
      ) : token ? (
        <TableComponent data={initialClients} columns={clientColumns} onEdit={handleOpenClientForm} simpleOutput={false} />
      ) : (
        <p className="text-center text-red-500 mt-4">Debes iniciar sesión para ver los clientes.</p>
      ),
    },
    {
      key: "search",
      label: "Buscar",
      children: (
        <Card>
          <SearchClientForm onSearch={handleSearch} />
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
      <ClientForm isOpen={isClientFormOpen} onClose={() => setClientFormOpen(false)} clientData={clientToEdit || undefined} onUpdateClient={handleUpdateClient} onCreateClient={(newClient) => setInitialClients([...initialClients, newClient])} token={token}
 />
    </div>
  );
}
