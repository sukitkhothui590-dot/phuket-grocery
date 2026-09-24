import { StaffOrderDetail } from "@/components/staff/staff-order-detail";

export default async function StaffOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StaffOrderDetail orderId={id} />;
}
