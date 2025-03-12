"use client";

import { useState } from "react";
import { Input, Checkbox } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface SearchClientFormProps {
  onSearch: (filters: { name?: string; email?: string; id?: string }, simpleOutput: boolean) => Promise<void>;
}

const SearchClientForm: React.FC<SearchClientFormProps> = ({ onSearch }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState({
    name: searchParams.get("name") || "",
    email: searchParams.get("email") || "",
    id: searchParams.get("id") || "",
  });

  const [simpleOutput, setSimpleOutput] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Actualizar la URL dinámicamente
  const updateSearchParams = (newSearch: typeof search) => {
    const params = new URLSearchParams();
  
    if (newSearch.name) params.set("name", newSearch.name);
    if (newSearch.email) params.set("email", newSearch.email);
    if (newSearch.id) params.set("id", newSearch.id);
  
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  

  // Ejecutar búsqueda con debounce
  const debouncedSearch = useDebouncedCallback(async () => {
    setError(null);
    setHasSearched(true);

    const filters = {
      name: search.name.trim() || undefined,
      email: search.email.trim() || undefined,
      id: search.id.trim() || undefined,
    };

    try {
      await onSearch(filters, simpleOutput);
    } catch {
      setError("Cliente no encontrado.");
    }
  }, 500);

  // Manejar cambios en los inputs y actualizar los parámetros de búsqueda
  const handleChange = (key: keyof typeof search, value: string) => {
    const newSearch = { name: "", email: "", id: "" }; 
    newSearch[key] = value;
  
    setSearch(newSearch);
    updateSearchParams(newSearch);
    debouncedSearch();
  };
  

  const handleSimpleOutputChange = (checked: boolean) => {
    setSimpleOutput(checked);
    debouncedSearch(); 
  };

  return (
    <div className="p-4 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Buscar Cliente</h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block font-medium">Buscar por Nombre</label>
          <Input
            placeholder="Nombre del cliente"
            value={search.name}
            onChange={(e) => handleChange("name", e.target.value)}
            prefix={<SearchOutlined />}
          />
        </div>
        <div>
          <label className="block font-medium">Buscar por Email</label>
          <Input
            placeholder="Email del cliente"
            type="email"
            value={search.email}
            onChange={(e) => handleChange("email", e.target.value)}
            prefix={<SearchOutlined />}
          />
        </div>
        <div>
          <label className="block font-medium">Buscar por ID</label>
          <Input
            placeholder="ID del cliente"
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

export default SearchClientForm;
