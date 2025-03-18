import MerchantComponent from "@/common/components/MerchantComponent/Delivery";
import merchantsUseCases from "@/service/src/application/queries/lib/merchants";
import { Merchant } from "@/common/components/MerchantComponent/Delivery/interface";

export default async function MerchantManagement({
  searchParams,
}: {
  searchParams: { name?: string; clientId?: string; id?: string; page?: string };
}) {
  let merchants: Merchant[] = [];

  try {
    const { name, id, clientId } = searchParams;

    if (name) {
      merchants = await merchantsUseCases.searchMerchantsByName(undefined, name);
    } else if (id) {
      const merchant = await merchantsUseCases.getMerchantById(undefined, id);
      merchants = merchant ? [merchant] : [];
    } else if (clientId) {
      merchants = await merchantsUseCases.getMerchantsByClientId(undefined, clientId);
    } else {
      merchants = await merchantsUseCases.getAllMerchants(undefined);
    }
  } catch (error) {
    console.error("Error fetching merchants:", error);
    merchants = [];
  }

  return <MerchantComponent searchParams={searchParams} initialMerchants={merchants} />;
}
