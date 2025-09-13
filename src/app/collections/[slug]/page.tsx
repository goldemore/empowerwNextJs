// server component
import CollectionsList from "@/components/CollectionsList";

export default async function Page({ params }: { params: { slug: string } }) {
  // передаём slug в клиентский компонент (на клиенте params не всегда надёжны)
  return <CollectionsList slug={params.slug} />;
}
