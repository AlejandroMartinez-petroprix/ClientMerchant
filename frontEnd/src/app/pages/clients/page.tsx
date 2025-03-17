import ClientComponent from "@/common/components/ClientComponent/Delivery";
import clientsUseCases from "@/service/src/application/queries/lib/clients";
import { Client } from "@/common/components/ClientComponent/Delivery/interface";
import { cookies } from "next/headers";

export default async function ClientManagement({ searchParams }: { searchParams: { name?: string; email?: string; id?: string; page?: string } }) {
  const signal = new AbortController().signal;
  
  // Obtener el token desde las cookies en el servidor
  const token = cookies().get("auth_token")?.value || null;

  let clients: Client[] = [];

  try {
    if (!token) {
      clients = [];
    } else if (searchParams.id) {
      const response = await clientsUseCases.getClientById(signal, searchParams.id, false, token);
      clients = response ? [response] : [];
    } else if (searchParams.name) {
      clients = await clientsUseCases.searchClientsByName(signal, searchParams.name, token);
    } else if (searchParams.email) {
      const response = await clientsUseCases.findByEmail(signal, searchParams.email, token);
      clients = response ? [response] : [];
    } else {
      clients = await clientsUseCases.getAllClients(signal, token);
    }
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    clients = [];
  }

  return <ClientComponent searchParams={searchParams} initialClients={clients} />;
}
