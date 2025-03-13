import clientsUseCases from "@/service/src/application/queries/lib/clients";
import { Client } from "@/common/components/ClientComponent/Delivery/interface";

export async function updateClient(clientId: string, clientData: Partial<Client>, token: string | null): Promise<Client | null> {
  if (!token) return null;

  const signal = new AbortController().signal;
  const updatedClient = await clientsUseCases.updateClient(signal, clientId, clientData, token);
  return updatedClient;

}

export async function createClient(values: Partial<Client>, token: string | null): Promise<Client | null> {
  if (!token) return null;

  const response = await clientsUseCases.createClient(new AbortController().signal, values, token);
  return response || null;

}

export async function getClients(
  filters: { name?: string; email?: string; id?: string } = {},
  token: string | null,
  simpleOutput: boolean = false
): Promise<Client[]> {
  if (!token) return [];

  const signal = new AbortController().signal;
  
  if (Object.keys(filters).length === 0) {
    return await clientsUseCases.getAllClients(signal, token);
  }

  let response: Client | Client[] | null = null;

  if (filters.id) {
    response = await clientsUseCases.getClientById(signal, filters.id, simpleOutput, token);
  } else if (filters.name) {
    response = await clientsUseCases.searchClientsByName(signal, filters.name, token);
  } else if (filters.email) {
    response = await clientsUseCases.findByEmail(signal, filters.email, token);
  }

  return response ? (Array.isArray(response) ? response : [response]) : [];
  
}



