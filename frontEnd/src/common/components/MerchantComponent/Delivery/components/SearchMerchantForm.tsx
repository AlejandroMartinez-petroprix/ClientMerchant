"use client";

import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input, Checkbox } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDebouncedCallback } from "use-debounce";

interface SearchMerchantFormProps {
  onSearch: (filters: { name?: string; clientId?: string; id?: string }, simpleOutput: boolean) => Promise<void>;
}

const SearchMerchantForm: React.FC<SearchMerchantFormProps> = ({ onSearch }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState({
    name: searchParams.get("name") || "",
    clientId: searchParams.get("clientId") || "",
    id: searchParams.get("id") || "",
  });

  const [simpleOutput, setSimpleOutput] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSearchParams = (newSearch: typeof search) => {
    const params = new URLSearchParams();

    if (newSearch.name) params.set("name", newSearch.name);
    if (newSearch.clientId) params.set("clientId", newSearch.clientId);
    if (newSearch.id) params.set("id", newSearch.id);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const debouncedSearch = useDebouncedCallback(async () => {
    setError(null);
    setHasSearched(true);

    const filters = {
      name: search.name.trim() || undefined,
      clientId: search.clientId.trim() || undefined,
      id: search.id.trim() || undefined,
    };

    try {
      await onSearch(filters, simpleOutput);
    } catch {
      setError("Merchant no encontrado.");
    }
  }, 500);

  const handleChange = (key: keyof typeof search, value: string) => {
    setSearch((prevSearch) => ({ ...prevSearch, [key]: value }));
    updateSearchParams({ ...search, [key]: value });
    debouncedSearch();
  };

  const handleSimpleOutputChange = (checked: boolean) => {
    setSimpleOutput(checked);
    debouncedSearch();
  };

  return (
    <div className="p-4 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Buscar Merchant</h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block font-medium">Buscar por Nombre</label>
          <Input
            placeholder="Nombre del merchant"
            value={search.name}
            onChange={(e) => handleChange("name", e.target.value)}
            prefix={<SearchOutlined />}
          />
        </div>

        <div>
          <label className="block font-medium">Buscar por Client ID</label>
          <Input
            placeholder="ID del cliente asociado"
            value={search.clientId}
            onChange={(e) => handleChange("clientId", e.target.value)}
            prefix={<SearchOutlined />}
          />
        </div>

        <div>
          <label className="block font-medium">Buscar por Merchant ID</label>
          <Input
            placeholder="ID del merchant"
            value={search.id}
            onChange={(e) => handleChange("id", e.target.value)}
            prefix={<SearchOutlined />}
          />
        <Checkbox checked={simpleOutput} onChange={(e) => handleSimpleOutputChange(e.target.checked)}>
        Activar Simple Output
          </Checkbox>
        </div>
      </div>

      {hasSearched && error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SearchMerchantForm;
