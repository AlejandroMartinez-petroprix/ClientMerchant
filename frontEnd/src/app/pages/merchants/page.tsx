import MerchantComponent from "@/common/components/MerchantComponent/Delivery";

export default function MerchantManagement({ searchParams }: { searchParams: { name?: string; clientId?: string; id?: string; page?: string } }) {
  return <MerchantComponent searchParams={searchParams} />;
}
