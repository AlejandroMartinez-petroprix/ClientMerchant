import merchantsUseCases from "@/service/src/application/queries/lib/merchants";
import { Merchant } from "@/common/components/MerchantComponent/Delivery/interface";

export async function updateMerchant(merchantId: string, merchantData: Partial<Merchant>): Promise<Merchant | null> {
  const signal = new AbortController().signal;
  return await merchantsUseCases.updateMerchant(signal, merchantId, merchantData);
}

export async function createMerchant(values: Partial<Merchant>): Promise<Merchant | null> {
  const signal = new AbortController().signal;
  return await merchantsUseCases.createMerchant(signal, values);
}

export async function getMerchants(
    filters: { name?: string; clientId?: string; id?: string } = {},
    simpleOutput: boolean = false
  ): Promise<Merchant[]> {
    const signal = new AbortController().signal;
  
    if (Object.keys(filters).length === 0) {
      return await merchantsUseCases.getAllMerchants(signal);
    }

    let response: Merchant | Merchant[] | null = null;

    if (filters.id) {
      response = await merchantsUseCases.getMerchantById(signal, filters.id, simpleOutput);
    } else if (filters.name) {
      response = await merchantsUseCases.searchMerchantsByName(signal, filters.name);
    } else if (filters.clientId) {
      response = await merchantsUseCases.getMerchantsByClientId(signal, filters.clientId);
    }


    return response ? (Array.isArray(response) ? response : [response]) : [];
  }

  
