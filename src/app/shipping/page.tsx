import Image from "next/image";

export default function ShippingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-16 mt-12 mb-24 text-[#171717]">
      <h1 className="text-4xl font-bold mb-8">Shipping Information</h1>

      <section className="mb-16">
        <p className="text-gray-700 text-lg mb-4">
          We offer fast and reliable shipping to ensure you receive your orders on time. Below you’ll find all the details regarding our delivery services.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow hover:shadow-md transition">
            <Image src="/delivery.png" alt="Local Delivery" width={50} height={50} />
            <h3 className="mt-4 font-semibold text-lg">Free Delivery in Baku</h3>
            <p className="text-gray-600 mt-2">We offer free door-to-door delivery within Baku city.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow hover:shadow-md transition">
            <Image src="/box.png" alt="Regional Shipping" width={50} height={50} />
            <h3 className="mt-4 font-semibold text-lg">Nationwide Shipping</h3>
            <p className="text-gray-600 mt-2">We ship to other cities in Azerbaijan via official postal services.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow hover:shadow-md transition">
            <Image src="/clock.png" alt="Delivery Time" width={50} height={50} />
            <h3 className="mt-4 font-semibold text-lg">Delivery Time</h3>
            <p className="text-gray-600 mt-2">Local deliveries within 1–2 business days. Regional within 3–5 days.</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 rounded-2xl p-6 md:p-12">
        <h2 className="text-2xl font-semibold mb-4">Important Notes</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-3">
          <li>Please ensure your contact number is correct during checkout.</li>
          <li>All orders are packed securely to prevent damage.</li>
          
        </ul>
      </section>
    </div>
  );
}
