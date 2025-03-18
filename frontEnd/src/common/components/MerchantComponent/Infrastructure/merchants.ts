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

  
