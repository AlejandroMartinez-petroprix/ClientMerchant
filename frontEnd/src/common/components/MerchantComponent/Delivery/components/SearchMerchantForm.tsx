"use client";

import { useState, useEffect } from "react";
import { useSearchParams} from "next/navigation";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDebouncedCallback } from "use-debounce";
import merchantsUseCases from "@/service/src/application/queries/lib/merchants";
import { Merchant } from "../../../MerchantComponent/Delivery/interface";

interface SearchMerchantFormProps {
  setMerchants: (merchants: Merchant[]) => void;
  updateSearchParams: (key: string, value: string) => void;
}

const SearchMerchantForm: React.FC<SearchMerchantFormProps> = ({ setMerchants, updateSearchParams }) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState({
    name: searchParams.get("name") || "",
    clientId: searchParams.get("clientId") || "",
    id: searchParams.get("id") || "",
  });

  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedSearch = useDebouncedCallback(async () => {
    setError(null);  // Limpiamos error previo
    setHasSearched(false);

    const signal = new AbortController().signal;

    if (!search.name && !search.clientId && !search.id) {
      setMerchants([]);
      return;
    }

    setHasSearched(true);

    try {
      let response: Merchant[] = [];

      if (search.name) {
        response = await merchantsUseCases.searchMerchantsByName(signal, search.name);
      } else if (search.clientId) {
        response = await merchantsUseCases.getMerchantsByClientId(signal, search.clientId);
      } else if (search.id) {
        const merchant = await merchantsUseCases.getMerchantById(signal, search.id);
        response = merchant ? [merchant] : [];
      }

      if (!response || response.length === 0) {
        throw new Error("No se encontraron merchants.");
      }

      setMerchants(response);
    } catch {
      setError("Merchant no encontrado.");
      setMerchants([]);
    }
  }, 500);


  useEffect(() => {
    debouncedSearch();
  }, [search, debouncedSearch]);

  return (
    <div className="p-4 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Buscar Merchant</h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block font-medium">Buscar por Nombre</label>
          <div className="flex gap-2">
            <Input
              placeholder="Nombre del merchant"
              value={search.name}
              onChange={(e) => {
                setSearch({ name: e.target.value, clientId: "", id: "" });
                updateSearchParams("name", e.target.value);
              }}
              prefix={<SearchOutlined />}
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Buscar por Client ID</label>
          <div className="flex gap-2">
            <Input
              placeholder="ID del cliente asociado"
              value={search.clientId}
              onChange={(e) => {
                setSearch({ name: "", clientId: e.target.value, id: "" });
                updateSearchParams("clientId", e.target.value);
              }}
              prefix={<SearchOutlined />}
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Buscar por Merchant ID</label>
          <div className="flex gap-2">
            <Input
              placeholder="ID del merchant"
              value={search.id}
              onChange={(e) => {
                setSearch({ name: "", clientId: "", id: e.target.value });
                updateSearchParams("id", e.target.value);
              }}
              prefix={<SearchOutlined />}
            />
          </div>
        </div>
      </div>

      {hasSearched && error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SearchMerchantForm;
