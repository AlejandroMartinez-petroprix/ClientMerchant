"use client";

import { useState, useEffect } from "react";
import { Tabs, Card, Button } from "antd";
import TableComponent from "@/common/components/TableComponent";
import SearchForm from "@/common/components/SearchFormComponent";
import GenericForm from "../../CreateNUpdateFormComponent";
import { Merchant } from "../Delivery/interface";
import { createMerchant, updateMerchant } from "../Infrastructure/merchants";
import { useRouter } from "next/navigation";

interface Props {
  searchParams: { name?: string; clientId?: string; id?: string };
  initialMerchants: Merchant[];
}

export default function MerchantComponent({ searchParams, initialMerchants }: Props) {
  const router = useRouter();
  const [isMerchantFormOpen, setMerchantFormOpen] = useState(false);
  const [merchantToEdit, setMerchantToEdit] = useState<Merchant | null>(null);
  const [searchResults, setSearchResults] = useState<Merchant[]>([]); 
  const [simpleOutput,setSimpleOutput] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setSearchResults(initialMerchants); 
    setIsClient(true);
  }, [initialMerchants,searchParams]);


  const handleOpenMerchantForm = (merchant?: Merchant) => {
    setMerchantToEdit(merchant || null);
    setMerchantFormOpen(true);
  };

  const handleUpdateMerchant = (updatedMerchant: Merchant) => {
    setSearchResults((prevMerchants) =>
      prevMerchants.map((merchant) =>
        merchant.id === updatedMerchant.id ? updatedMerchant : merchant
      )
    );
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === "all") {
      router.push("/pages/merchants");
      setSearchResults(initialMerchants);
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
        <Button type="primary" onClick={() => handleOpenMerchantForm()}>
          Nuevo Merchant
        </Button>
      </div>
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={[
        {
          key: "all",
          label: "Todos los Merchants",
          children: (
            <TableComponent
              data={searchResults}
              columns={merchantColumns}
              onEdit={handleOpenMerchantForm}
              simpleOutput={simpleOutput} 
            />
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
                errorMessage="Merchant no encontrado."
                title="Buscar Merchant"
                simpleOutput={simpleOutput}
                onSimpleOutputChange={setSimpleOutput}
              />
              {Object.values(searchParams).some(val => val && val.trim().length > 0) ? (
                searchResults.length > 0 ? (
                  <TableComponent
                    data={searchResults}
                    columns={merchantColumns}
                    onEdit={handleOpenMerchantForm}
                    simpleOutput={simpleOutput}
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
        onCreateEntity={(newMerchant) => setSearchResults([...searchResults, newMerchant])}
        entityType="merchant"
        fields={[
          ...(merchantToEdit ? [{ key: "id" as keyof Merchant, label: "ID", disabled: true }] : []),
          { key: "name" as keyof Merchant, label: "Nombre", required: true },
          { key: "address" as keyof Merchant, label: "Dirección", required: true },
          {
            key: "merchantType" as keyof Merchant,
            label: "Tipo de Merchant",
            type: "select",
            required: true,
            options: [
              { value: "MERCHANT_TYPE_PERSONAL_SERVICES", label: "Servicios Personales" },
              { value: "MERCHANT_TYPE_FINANCIAL_SERVICES", label: "Servicios Financieros" },
            ],
          },
          { key: "clientId" as keyof Merchant, label: "ID del Cliente", required: true },
        ]}
        createEntity={(values) => createMerchant(values)}
        updateEntity={(id, values) => updateMerchant(id, values)}
      />
    </div>
  );
}
