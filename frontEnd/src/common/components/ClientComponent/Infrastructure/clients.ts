import clientsUseCases from "@/service/src/application/queries/lib/clients";
import { Client } from "@/common/components/ClientComponent/Delivery/interface";

export async function updateClient(clientId: string, clientData: Partial<Client>, token: string | null): Promise<Client | null> {
  if (!token) return null;
  const signal = new AbortController().signal;
  return await clientsUseCases.updateClient(signal, clientId, clientData, token);
}

export async function createClient(values: Partial<Client>, token: string | null): Promise<Client | null> {
  if (!token) return null;
  return await clientsUseCases.createClient(new AbortController().signal, values, token);
}
