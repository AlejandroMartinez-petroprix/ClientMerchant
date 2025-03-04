import { useState } from "react";
import clientsUseCases from "@/service/src/application/queries/lib/clients"; 
import { Client } from "../interface";
import ClientTable from "@/common/components/TableComponent/Delivery/ClientTable";
import { Input, Button, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchClientForm = () => {
  const [search, setSearch] = useState({ name: "", email: "", id: "" });
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setClients([]);

    try {
      const signal = new AbortController().signal;
      let response: Client | Client[] | null = null;
      let clientData: Client[] | null = null;

      if (search.name.trim()) {
        response = await clientsUseCases.searchClientsByName(signal, search.name);
      } else if (search.email.trim()) {
        response = await clientsUseCases.findByEmail(signal, search.email);
      } else if (search.id.trim()) {
        response = await clientsUseCases.getClientById(signal, search.id);
      }

      clientData = Array.isArray(response) ? response : response ? [response] : null;

      if (!clientData || clientData.length === 0) {
        throw new Error("No se encontraron clientes.");
      }

      setClients(clientData);
      message.success(`Se encontraron ${clientData.length} cliente(s).`);
    } catch {
      setError("Cliente no encontrado.");
      message.error("Error al buscar cliente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Buscar Cliente</h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        
        {/* Buscar por Nombre */}
        <div>
          <label className="block font-medium">Buscar por Nombre</label>
          <div className="flex gap-2">
            <Input
              placeholder="Nombre del cliente"
              value={search.name}
              onChange={(e) => setSearch({ ...search, name: e.target.value, email: "", id: "" })}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading} />
          </div>
        </div>

        {/* Buscar por Email */}
        <div>
          <label className="block font-medium">Buscar por Email</label>
          <div className="flex gap-2">
            <Input
              placeholder="Email del cliente"
              type="email"
              value={search.email}
              onChange={(e) => setSearch({ ...search, email: e.target.value, name: "", id: "" })}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading} />
          </div>
        </div>

        {/* Buscar por ID */}
        <div>
          <label className="block font-medium">Buscar por ID</label>
          <div className="flex gap-2">
            <Input
              placeholder="ID del cliente"
              value={search.id}
              onChange={(e) => setSearch({ ...search, id: e.target.value, name: "", email: "" })}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading} />
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Tabla con los resultados */}
      {clients.length > 0 && <ClientTable clients={clients} onEdit={() => {}} onDelete={() => {}} />}
    </div>
  );
};

export default SearchClientForm;
