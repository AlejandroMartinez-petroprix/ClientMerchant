"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Button, Tabs, Card } from "antd";
import  MerchantForm  from "@/common/components/MerchantComponent/Delivery/components/MerchantForm";
import  SearchMerchantForm  from "@/common/components/MerchantComponent/Delivery/components/SearchMerchantForm";
import TableComponent from "@/common/components/TableComponent/Delivery/components/TableComponent";
import { Merchant } from "@/common/components/MerchantComponent/Delivery/interface";
import merchantsUseCases from "@/service/src/application/queries/lib/merchants";

export default function MerchantManagement() {
  const [isMerchantFormOpen, setMerchantFormOpen] = useState(false);
  const [merchantToEdit, setMerchantToEdit] = useState<Merchant | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [searchResults, setSearchResults] = useState<Merchant[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (activeTab === "all") {
      fetchMerchants();
    }
  }, [activeTab]);

  const fetchMerchants = async () => {
    try {
      const signal = new AbortController().signal;
      const response = await merchantsUseCases.getAllMerchants(signal);
      if (Array.isArray(response)) {
        setMerchants(response);
      }
    } catch (error) {
      console.error("Error al obtener merchants:", error);
    }
  };

  const handleOpenMerchantForm = (merchant?: Merchant) => {
    setMerchantToEdit(merchant || null);
    setMerchantFormOpen(true);
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

  const merchantColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Dirección", dataIndex: "address", key: "address" },
    { title: "Tipo", dataIndex: "merchantType", key: "merchantType" },
    { title: "Cliente Asociado", dataIndex: "clientId", key: "clientId" },
  ];
  
  const tabItems = [
    {
      key: "all",
      label: "Todos los Merchants",
      children: (
        <TableComponent
          data={merchants}
          columns={merchantColumns}
          onEdit={handleOpenMerchantForm}
        />
      ),
    },
    {
      key: "search",
      label: "Buscar",
      children: (
        <Card>
          <SearchMerchantForm setMerchants={setSearchResults} updateSearchParams={updateSearchParams} />
          {searchResults.length > 0 ? (
            <TableComponent
              data={searchResults}
              columns={merchantColumns}
              onEdit={handleOpenMerchantForm}
            />
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
        <h1 className="text-3xl font-bold">Gestión de Merchants</h1>
        <Button type="primary" onClick={() => handleOpenMerchantForm()}>
          Nuevo Merchant
        </Button>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {/* Formulario de creación/edición de merchant */}
      <MerchantForm
        isOpen={isMerchantFormOpen}
        onClose={() => setMerchantFormOpen(false)}
        merchantData={merchantToEdit || undefined}
      />
    </div>
  );
}
