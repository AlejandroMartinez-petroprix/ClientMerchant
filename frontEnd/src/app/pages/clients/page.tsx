import ClientComponent from "@/common/components/ClientComponent/Delivery";

export default function ClientManagement({ searchParams }: { searchParams: { name?: string; email?: string; id?: string; page?: string } }) {
  return <ClientComponent searchParams={searchParams} />;
}
