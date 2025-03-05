"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import clientsUseCases from "@/service/src/application/queries/lib/clients";
import { Client } from "../interface";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDebouncedCallback } from "use-debounce";

interface SearchClientFormProps {
  setClients: (clients: Client[]) => void;
  updateSearchParams: (key: string, value: string) => void;
}

const SearchClientForm: React.FC<SearchClientFormProps> = ({ setClients }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState({
    name: searchParams.get("name") || "",
    email: searchParams.get("email") || "",
    id: searchParams.get("id") || "",
  });

  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false); // ✅ Para controlar si ya se ha hecho una búsqueda

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams();

    if (key === "name" && value) {
      params.set("name", value);
    } else if (key === "email" && value) {
      params.set("email", value);
    } else if (key === "id" && value) {
      params.set("id", value);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const debouncedSearch = useDebouncedCallback(async () => {
    setError(null);

    const name = searchParams.get("name") || "";
    const email = searchParams.get("email") || "";
    const id = searchParams.get("id") || "";

    if (!name && !email && !id) {
      setClients([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);

    try {
      const signal = new AbortController().signal;
      let response: Client | Client[] | null = null;
      let clientData: Client[] | null = null;

      if (name) {
        response = await clientsUseCases.searchClientsByName(signal, name);
      } else if (email) {
        response = await clientsUseCases.findByEmail(signal, email);
      } else if (id) {
        response = await clientsUseCases.getClientById(signal, id);
      }

      clientData = Array.isArray(response) ? response : response ? [response] : null;

      if (!clientData || clientData.length === 0) {
        throw new Error("No se encontraron clientes.");
      }

      setClients(clientData);
    } catch {
      setError("Cliente no encontrado.");
      setClients([]);
    }
  }, 200); // Debounce de 200ms

  useEffect(() => {
    debouncedSearch();
  }, [searchParams, debouncedSearch]);

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Buscar Cliente</h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block font-medium">Buscar por Nombre</label>
          <div className="flex gap-2">
            <Input
              placeholder="Nombre del cliente"
              value={search.name}
              onChange={(e) => {
                setSearch({ name: e.target.value, email: "", id: "" });
                updateSearchParams("name", e.target.value);
              }}
              prefix={<SearchOutlined />}
            />
          </div>
        </div>
        <div>
          <label className="block font-medium">Buscar por Email</label>
          <div className="flex gap-2">
            <Input
              placeholder="Email del cliente"
              type="email"
              value={search.email}
              onChange={(e) => {
                setSearch({ name: "", email: e.target.value, id: "" });
                updateSearchParams("email", e.target.value);
              }}
              prefix={<SearchOutlined />}
            />
          </div>
        </div>
        <div>
          <label className="block font-medium">Buscar por ID</label>
          <div className="flex gap-2">
            <Input
              placeholder="ID del cliente"
              value={search.id}
              onChange={(e) => {
                setSearch({ name: "", email: "", id: e.target.value });
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

export default SearchClientForm;
