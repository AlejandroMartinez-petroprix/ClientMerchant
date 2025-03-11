"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Button, Tabs, Card, message } from "antd";
import { ClientForm } from "@/common/components/ClientComponent/Delivery/components/ClientForm";
import SearchClientForm from "@/common/components/ClientComponent/Delivery/components/SearchClientForm";
import TableComponent from "@/common/components/TableComponent/Delivery/components/TableComponent";
import { Client } from "@/common/components/ClientComponent/Delivery/interface";
import clientsUseCases from "@/service/src/application/queries/lib/clients";
import ChecksForm from "@/common/components/ClientComponent/Delivery/components/ChecksForm";
import { useAuth } from "@/context/AuthContext"; 


export default function ClientManagement() {
  const { token } = useAuth();
  const [isClientFormOpen, setClientFormOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchClients = async () => {
      if (!token) {
        setIsLoading(false);
        setClients([]);
        return;
      }
    
      setIsLoading(true);
      try {
        const signal = new AbortController().signal;
        const response = await clientsUseCases.getAllClients(signal, token);
      
        if (Array.isArray(response)) {
          setClients(response);
        }
      } catch (error: any) {
        console.error("Error al obtener clientes:", error);
      
        const status = error?.status || error?.response?.status;
      
        if (status === 403) {
          setClients([]);
      
          let errorMessage = "Acceso denegado. Usuario menor de edad.";
          try {
            const errorData = error?.body ? JSON.parse(error.body) : error?.response?.data;
            if (errorData?.error) {
              errorMessage = errorData.error;
            }
          } catch (parseError) {
            console.error("Error al parsear el mensaje de error:", parseError);
          }
      
          message.error(errorMessage);
        } else {
          message.error("Error al obtener clientes. Verifica tu token.");
        }
      } finally {
        setIsLoading(false);
      }
      
    };
    

    if (activeTab === "all") {
      fetchClients();
    }
  }, [activeTab, token]);

  if (isLoading) {
    return <p className="text-center text-gray-500 mt-4">Cargando...</p>;
  }

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
      children: token ? (
        <TableComponent data={clients} columns={clientColumns} onEdit={handleOpenClientForm} />
      ) : (
        <p className="text-center text-red-500 mt-4">
          Debes iniciar sesión para ver los clientes.
        </p>
      ),
    },
    {
      key: "search",
      label: "Buscar",
      children: token ? (
        <Card>
          <SearchClientForm setClients={setSearchResults} updateSearchParams={updateSearchParams} />
          {searchResults.length > 0 ? (
            <TableComponent data={searchResults} columns={clientColumns} onEdit={handleOpenClientForm} />
          ) : (
            <p className="text-center text-gray-500 mt-4">Aquí aparecerán los resultados de las búsquedas</p>
          )}
        </Card>
      ) : (
        <p className="text-center text-red-500 mt-4">Debes iniciar sesión para buscar clientes.</p>
      ),
    },
    {
      key: "checks",
      label: "Comprobaciones",
      children: token ? <ChecksForm /> : <p className="text-center text-red-500 mt-4">Debes iniciar sesión para acceder.</p>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
        {token && (
          <Button type="primary" onClick={() => handleOpenClientForm()}>
            Nuevo Cliente
          </Button>
        )}
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      <ClientForm isOpen={isClientFormOpen} onClose={() => setClientFormOpen(false)} clientData={clientToEdit || undefined} />
    </div>
  );
}
