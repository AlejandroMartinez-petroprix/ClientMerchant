export enum MerchantType {
  PERSONAL_SERVICES = "MERCHANT_TYPE_PERSONAL_SERVICES",
  FINANCIAL_SERVICES = "MERCHANT_TYPE_FINANCIAL_SERVICES",
}

export interface Merchant {
  id: string;
  name: string;
  address: string;
  merchantType?: MerchantType;
  clientId: string; // Relación con un cliente
}
