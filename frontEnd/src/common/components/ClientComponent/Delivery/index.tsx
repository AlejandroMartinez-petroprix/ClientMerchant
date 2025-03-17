"use client";

import { useState } from "react";
import { Tabs, Card, Button, Alert } from "antd";
import TableComponent from "@/common/components/TableComponent";
import SearchForm from "@/common/components/SearchFormComponent";
import GenericForm from "@/common/components/CreateNUpdateFormComponent";
import { Client } from "../Delivery/interface";
import { createClient, updateClient } from "../Infrastructure/clients";
import { useAuth } from "@/common/context/AuthContext";

interface Props {
  searchParams: { name?: string; email?: string; id?: string };
  initialClients: Client[];
}

export default function ClientComponent({ searchParams, initialClients }: Props) {
  const { token } = useAuth();
  const [isClientFormOpen, setClientFormOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [searchResults, setSearchResults] = useState<Client[]>(initialClients);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [hasSearched, setHasSearched] = useState(false);
  const [simpleOutput, setSimpleOutput] = useState(false);

  const handleOpenClientForm = (client?: Client) => {
    setClientToEdit(client || null);
    setClientFormOpen(true);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setSearchResults((prevClients) =>
      prevClients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === "all") {
      setSearchResults(initialClients);
      setHasSearched(false);
    }
  };

  const handleSearch = async (
    filters: { name?: string; email?: string; id?: string },
    simpleOutputValue: boolean
  ): Promise<void> => {
    return new Promise((resolve) => {
      if (!token) {
        resolve();
        return;
      }

      if (!filters.name && !filters.email && !filters.id) {
        setSearchResults([]);
        setHasSearched(false);
        resolve();
        return;
      }

      const filteredResults = initialClients.filter((client) => {
        return (
          (filters.name && client.name.includes(filters.name)) ||
          (filters.email && client.email.includes(filters.email)) ||
          (filters.id && client.id === filters.id)
        );
      });

      setSimpleOutput(simpleOutputValue);
      setSearchResults(filteredResults);
      setHasSearched(true);
      resolve();
    });
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
        <TableComponent
          data={searchResults}
          columns={clientColumns}
          onEdit={handleOpenClientForm}
          simpleOutput={false}
        />
      ) : (
        <div className="flex justify-center items-center mt-6">
          <Alert
            message="Acceso restringido"
            description="Debes iniciar sesión para ver los clientes."
            type="warning"
            showIcon
            className="max-w-md mx-auto text-center"
          />
        </div>
      ),
    },
    {
      key: "search",
      label: "Buscar",
      children: token ? (
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
      ) : (
        <div className="flex justify-center items-center mt-6">
          <Alert
            message="Acceso restringido"
            description="Debes iniciar sesión para buscar clientes."
            type="warning"
            showIcon
            className="max-w-md mx-auto text-center"
          />
        </div>
      ),
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
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />

      <GenericForm
        isOpen={isClientFormOpen}
        onClose={() => setClientFormOpen(false)}
        entityData={clientToEdit || undefined}
        onUpdateEntity={handleUpdateClient}
        onCreateEntity={(newClient) => setSearchResults([...searchResults, newClient])}
        entityType="client"
        fields={[
          ...(clientToEdit ? [{ key: "id" as keyof Client, label: "ID", disabled: true }] : []),
          { key: "cifNifNie" as keyof Client, label: "CIF/NIF/NIE", required: true, disabled: !!clientToEdit },
          { key: "name" as keyof Client, label: "Nombre", required: true },
          { key: "surname" as keyof Client, label: "Apellido" },
          { key: "phone" as keyof Client, label: "Teléfono", required: true },
          { key: "email" as keyof Client, label: "Correo", type: "email", required: true },
        ]}
        createEntity={(values) => createClient(values, token)}
        updateEntity={(id, values) => updateClient(id, values, token)}
      />
    </div>
  );
}
