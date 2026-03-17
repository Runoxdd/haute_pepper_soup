import type { Metadata } from "next";
import { getAdminOrders } from "@/lib/data";
import { OrderTable } from "@/components/admin/OrderTable";

export const metadata: Metadata = {
  title: "Order Management",
};

export default async function AdminOrdersPage() {
  const data = await getAdminOrders({ page: 1, limit: 20 });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-text-primary">
          Orders
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {data.total} total orders
        </p>
      </div>

      <OrderTable
        initialData={JSON.parse(JSON.stringify(data))}
      />
    </div>
  );
}
