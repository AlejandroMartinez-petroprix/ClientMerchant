"use client";

import { useState, useEffect } from "react";
import { Tabs, Card, Button } from "antd";
import TableComponent from "@/common/components/TableComponent";
import SearchForm from "@/common/components/SearchFormComponent";
import GenericForm from "../../CreateNUpdateFormComponent";
import { Merchant } from "../Delivery/interface";
import { getMerchants,createMerchant, updateMerchant } from "../Infrastructure/merchants";


interface Props {
  searchParams: { name?: string; clientId?: string; id?: string };
}

export default function MerchantComponent({ searchParams }: Props) {
  const [isMerchantFormOpen, setMerchantFormOpen] = useState(false);
  const [merchantToEdit, setMerchantToEdit] = useState<Merchant | null>(null);
  const [initialMerchants, setInitialMerchants] = useState<Merchant[]>([]);
  const [searchResults, setSearchResults] = useState<Merchant[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [simpleOutput, setSimpleOutput] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loadMerchants = async () => {
      setIsLoading(true);
      try {
        const fetchedMerchants = await getMerchants({});
        setInitialMerchants(fetchedMerchants);
      } finally {
        setIsLoading(false);
      }
    };

    loadMerchants();
  }, []);

  const handleOpenMerchantForm = (merchant?: Merchant) => {
    setMerchantToEdit(merchant || null);
    setMerchantFormOpen(true);
  };

  const handleUpdateMerchant = (updatedMerchant: Merchant) => {
    setInitialMerchants((prevMerchants) =>
      prevMerchants.map((merchant) =>
        merchant.id === updatedMerchant.id ? updatedMerchant : merchant
      )
    );
  };

  const handleSearch = async (filters: { name?: string; clientId?: string; id?: string }, simpleOutputValue: boolean) => {
    if (!filters.name && !filters.clientId && !filters.id) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    try {
      const results: Merchant[] = await getMerchants(filters, simpleOutputValue);
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

  const merchantColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Dirección", dataIndex: "address", key: "address" },
    { title: "Tipo", dataIndex: "merchantType", key: "merchantType" },
    { title: "Cliente Asociado", dataIndex: "clientId", key: "clientId" },
  ];

  if (!isClient) return <p className="text-center text-gray-500 mt-4">Cargando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Merchants</h1>
        <Button type="primary" onClick={() => handleOpenMerchantForm()}>Nuevo Merchant</Button>
      </div>
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={[
        {
          key: "all",
          label: "Todos los Merchants",
          children: isLoading ? (
            <p className="text-center text-gray-500 mt-4">Cargando...</p>
          ) : (
            <TableComponent data={initialMerchants} columns={merchantColumns} onEdit={handleOpenMerchantForm} simpleOutput={simpleOutput} />
          ),
        },
        {
          key: "search",
          label: "Buscar",
          children: (
            <Card>
              <SearchForm
                fields={[
                  { key: "name", label: "Buscar por Nombre", placeholder: "Nombre del merchant" },
                  { key: "clientId", label: "Buscar por Client ID", placeholder: "ID del cliente asociado" },
                  { key: "id", label: "Buscar por Merchant ID", placeholder: "ID del merchant" },
                ]}
                onSearch={handleSearch}
                errorMessage="Merchant no encontrado."
                title="Buscar Merchant"
                simpleOutput={simpleOutput}
              />
              {hasSearched ? (
                searchResults.length > 0 ? (
                  <TableComponent
                    data={searchResults}
                    columns={merchantColumns}
                    onEdit={handleOpenMerchantForm}
                    simpleOutput={searchParams?.id ? simpleOutput : false}
                  />
                ) : (
                  <p className="text-center text-red-500 mt-4">Merchant no encontrado.</p>
                )
              ) : (
                <p className="text-center text-gray-500 mt-4">Aquí aparecerán los resultados de las búsquedas</p>
              )}
            </Card>
          ),
        },
      ]} />
      <GenericForm
  isOpen={isMerchantFormOpen}
  onClose={() => setMerchantFormOpen(false)}
  entityData={merchantToEdit || undefined}
  onUpdateEntity={handleUpdateMerchant}
  onCreateEntity={(newMerchant) => setInitialMerchants([...initialMerchants, newMerchant])}
  entityType="merchant"
  fields={[
    { key: "id", label: "ID", disabled: true },
    { key: "name", label: "Nombre", required: true },
    { key: "address", label: "Dirección", required: true },
    {
      key: "merchantType",
      label: "Tipo de Merchant",
      type: "select",
      required: true,
      options: [
        { value: "MERCHANT_TYPE_PERSONAL_SERVICES", label: "Servicios Personales" },
        { value: "MERCHANT_TYPE_FINANCIAL_SERVICES", label: "Servicios Financieros" },
      ],
    },
    { key: "clientId", label: "ID del Cliente", required: true },
  ]}
  createEntity={(values) => createMerchant(values)}
  updateEntity={(id, values) => updateMerchant(id, values)}
/>

    </div>
  );
}
