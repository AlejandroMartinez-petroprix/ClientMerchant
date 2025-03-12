import clientsUseCases from "@/service/src/application/queries/lib/clients";
import { Client } from "@/common/components/ClientComponent/Delivery/interface";

export async function fetchAllClients(token: string | null): Promise<Client[]> {
  if (!token) return [];
  try {
    const response = await clientsUseCases.getAllClients(new AbortController().signal, token);
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

export async function updateClient(clientId: string, clientData: Partial<Client>, token: string | null): Promise<Client | null> {
  if (!token) return null;

  try {
    const signal = new AbortController().signal;
    const updatedClient = await clientsUseCases.updateClient(signal, clientId, clientData, token);
    return updatedClient;
  } catch (error) {
    console.error("Error updating client:", error);
    return null;
  }
}

export async function createClient(values: Partial<Client>, token: string | null): Promise<Client | null> {
  if (!token) return null;

  try {
    const response = await clientsUseCases.createClient(new AbortController().signal, values, token);
    return response || null;
  } catch (error) {
    console.error("Error creating client:", error);
    return null;
  }
}

export async function searchClients(
  { name, email, id }: { name?: string; email?: string; id?: string },
  token: string | null
): Promise<Client[]> {
  if (!token) return [];

  try {
    const signal = new AbortController().signal;
    let response: Client | Client[] | null = null;

    if (name) {
      response = await clientsUseCases.searchClientsByName(signal, name, token);
    } else if (email) {
      response = await clientsUseCases.findByEmail(signal, email, token);
    } else if (id) {
      response = await clientsUseCases.getClientById(signal, id, false, token);
    }

    return Array.isArray(response) ? response : response ? [response] : [];
  } catch (error) {
    console.error("Error searching clients:", error);
    return [];
  }
}
