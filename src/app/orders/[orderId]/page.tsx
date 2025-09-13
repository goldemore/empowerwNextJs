"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosAuth.get(`${baseURL}tailor/orderitem-list/`);
        const filtered = res.data.filter(
          (i: OrderItem) => String(i.order.id) === String(orderId)
        );
        setItems(filtered);
      } catch (e) {
        console.error("❌ Ошибка загрузки деталей заказа:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  if (!items.length) {
    return <p className="text-center mt-10 text-gray-500">Order not found.</p>;
  }

  const order = items[0].order;
  const total = items.reduce(
    (sum, it) =>
      sum + (it.product.sale_price ?? it.product.price) * 1.015 * it.quantity,
    0
  );

  // Дата заказа — берём updated_at первой позиции
  const orderDate = new Date(items[0].updated_at);
  // Дата доставки — пока фиктивно +5 дней
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:underline"
      >
        ← Geri
      </button>

      {/* Заголовок с датами и статусом */}
      <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Order #{order.id}</h2>
          <div className="text-sm text-gray-500">
            Order date: {orderDate.toLocaleDateString()} <br />
            Delivery date: {deliveryDate.toLocaleDateString()}
          </div>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            order.status === "C"
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {order.status === "C" ? "Çatdırılıb" : "Çatdırılmayıb"}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        {/* Адрес */}
        <div className="rounded-lg border p-4 bg-white">
          <h3 className="font-semibold mb-3">Saved Address</h3>
          <div className="text-sm space-y-1">
            <div>
              <span className="text-gray-500">Name:</span>{" "}
              {order.first_name} {order.last_name}
            </div>
            <div>
              <span className="text-gray-500">Email:</span> {order.email}
            </div>
            <div>
              <span className="text-gray-500">Phone:</span>{" "}
              {order.phone_number}
            </div>
            <div>
              <span className="text-gray-500">Address:</span>{" "}
              {order.address}
            </div>
            {order.note && (
              <div>
                <span className="text-gray-500">Note:</span> {order.note}
              </div>
            )}
          </div>
        </div>

        {/* Товары */}
        <div className="lg:col-span-2 rounded-lg border p-4 bg-white">
          <h3 className="font-semibold mb-3">Your Order</h3>
          <div className="divide-y">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex gap-4 py-4 items-center"
              >
                <img
                  src={it.product.product_images[0]?.image}
                  alt={it.product.title}
                  className="w-16 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">{it.product.title}</div>
                  <div className="text-sm text-gray-500">
                    Size: {it.size || "-"} • Color: {it.color || "-"} • Qty:{" "}
                    {it.quantity}
                  </div>
                </div>
                <div className="text-right font-medium">
                  {(
                    (it.product.sale_price ?? it.product.price) * 1.015 *
                    it.quantity
                  ).toFixed(2)}{" "}
                  AZN
                </div>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span>{total.toFixed(2)} AZN</span>
          </div>
        </div>
      </div>
    </div>
  );
}
