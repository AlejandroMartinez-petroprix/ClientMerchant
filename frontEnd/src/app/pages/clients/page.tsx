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
    clients = await (!token
      ? Promise.resolve([])
      : searchParams.id
        ? (async () => {
            const response = await clientsUseCases.getClientById(signal, searchParams.id, false, token);
            return response ? [response] : [];
          })()
        : searchParams.name
          ? clientsUseCases.searchClientsByName(signal, searchParams.name, token)
          : searchParams.email
            ? (async () => {
                const response = await clientsUseCases.findByEmail(signal, searchParams.email, token);
                return response ? [response] : [];
              })()
            : clientsUseCases.getAllClients(signal, token)
    );
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    clients = [];
  }

  return <ClientComponent searchParams={searchParams} initialClients={clients} />;
}
