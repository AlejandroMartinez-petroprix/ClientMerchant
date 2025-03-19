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

    merchants = await (
      name
        ? merchantsUseCases.searchMerchantsByName(undefined, name)
        : id
          ? (async () => {
              const merchant = await merchantsUseCases.getMerchantById(undefined, id);
              return merchant ? [merchant] : [];
            })()
          : clientId
            ? merchantsUseCases.getMerchantsByClientId(undefined, clientId)
            : merchantsUseCases.getAllMerchants(undefined)
    );
  } catch (error) {
    console.error("Error fetching merchants:", error);
    merchants = [];
  }

  return <MerchantComponent searchParams={searchParams} initialMerchants={merchants} />;
}
