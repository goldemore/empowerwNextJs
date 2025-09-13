"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import axiosAuth from "@/auth/axiosAuth";
import { baseURL } from "@/baseURL";

interface ProductImage {
  id: number;
  image: string;
  product: number;
}
interface Product {
  id: number;
  title: string;
  price: number;
  sale_price: number | null;
  product_images: ProductImage[];
}
interface Order {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  note: string | null;
  status: "C" | "CM";
}
interface OrderItem {
  id: number;
  order: Order;
  product: Product;
  quantity: number;
  size: string | null;
  color: string | null;
  updated_at: string;
}

export default function OrdersPage() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosAuth.get(`${baseURL}tailor/orderitem-list/`);
        setItems(res.data);
      } catch (e) {
        console.error("❌ Ошибка загрузки заказов:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<number, OrderItem[]>();
    for (const it of items) {
      if (!map.has(it.order.id)) map.set(it.order.id, []);
      map.get(it.order.id)!.push(it);
    }
    return Array.from(map.entries());
  }, [items]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading orders...</p>;
  }

  if (!items.length) {
    return <p className="text-center mt-10 text-gray-500">No orders found.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Sifarişlərim</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {grouped.map(([orderId, arr]) => {
          const total = arr.reduce(
            (sum, it) =>
              sum +
              (it.product.sale_price ?? it.product.price) * 1.015 * it.quantity,
            0
          );
          const date = new Date(
            arr.reduce((a, b) => (a.updated_at > b.updated_at ? a : b)).updated_at
          );
          const thumbs = arr
            .slice(0, 3)
            .map((it) => it.product.product_images[0]?.image)
            .filter(Boolean) as string[];

          return (
            <button
              key={orderId}
              onClick={() => router.push(`/orders/${orderId}`)}
              className="rounded-lg border p-4 bg-white hover:shadow"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">
                  Order #{orderId}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    arr[0].order.status === "C"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {arr[0].order.status === "C"
                    ? "Çatdırılıb"
                    : "Çatdırılmayıb"}
                </span>
              </div>

              <div className="flex -space-x-2 mb-3">
                {thumbs.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-12 h-16 object-cover rounded"
                  />
                ))}
              </div>

              <div className="text-sm text-gray-600">
                {date.toLocaleDateString()} • {arr.length} məhsul
              </div>
              <div className="font-semibold">{total.toFixed(2)} AZN</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
