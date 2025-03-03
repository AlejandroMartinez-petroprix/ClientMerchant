"use client";
import { useState } from "react";
import Service from "@/service/src";

interface Client {
  id: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  const handleSearch = async () => {
    if (!search.trim()) {
      setError("Error: Ingresa un nombre para buscar.");
      return;
    }
  
    console.log("Buscando clientes con el nombre:", search.trim());

    setLoading(true);
    setError(null);
  
    try {
      const signal = new AbortController().signal;
      const response = await Service.executeUseCase("searchClientsByName", { 
        signal, 
        endPointData: search.trim()
      });
  
      console.log("Respuesta de la API:", response);
  
      if (!response || !Array.isArray(response)) {
        throw new Error("Respuesta inválida del servidor");
      }
  
      setClients(response);
    } catch (err) {
      setError("Error al buscar clientes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <h2>Buscar Clientes por Nombre</h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Escribe un nombre"
      />
      <button onClick={handleSearch} disabled={loading}>
        Buscar
      </button>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.name} {client.surname} - {client.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clients;
