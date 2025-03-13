"use client";

import { useState, useEffect } from "react";
import { Tabs, Card, Button } from "antd";
import TableComponent from "@/common/components/TableComponent";
import SearchMerchantForm from "./components/SearchMerchantForm";
import MerchantForm from "./components/MerchantForm";
import { Merchant } from "../Delivery/interface";
import { getMerchants } from "../Infrastructure/merchants";

interface Props {
  searchParams: { name?: string; address?: string; id?: string };
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
    } catch  {
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
            <TableComponent data={initialMerchants} columns={merchantColumns} onEdit={handleOpenMerchantForm} simpleOutput={false} />
          ),
        },
        {
          key: "search",
          label: "Buscar",
          children: (
            <Card>
              <SearchMerchantForm onSearch={handleSearch} />
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
      <MerchantForm
        isOpen={isMerchantFormOpen}
        onClose={() => setMerchantFormOpen(false)}
        merchantData={merchantToEdit || undefined}
        onUpdateMerchant={handleUpdateMerchant}
        onCreateMerchant={(newMerchant) => setInitialMerchants([...initialMerchants, newMerchant])}
      />
    </div>
  );
}
