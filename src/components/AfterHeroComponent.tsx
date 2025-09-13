import { baseURL } from "@/baseURL";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import ShopNewLabel from "./ShopNewLabel";


type AfterHeroItem = {
  image: string;
  slug: string;
  name: string;
};

async function getAfterHeroSectionContent(lang: string): Promise<AfterHeroItem[]> {
  const res = await fetch(`${baseURL}tailor/home-collections/${lang}/`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error(`Failed to load home collections: ${res.status}`);
    return [];
  }

  return res.json();
}

const AfterHeroSection = async () => {
  const lang = cookies().get("selectedLanguage")?.value || "az";
  const afterHero = await getAfterHeroSectionContent(lang);

  if (!afterHero.length) return null;

  return (
    <div className="flex flex-wrap md:flex-nowrap gap-4 mt-4 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-36">
      {afterHero.map((content) => (
        <div className="relative h-[580px] w-full" key={content.slug}>
          <Image
            src={content.image}
            alt={content.name}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover object-top"
          />

          <div className="absolute bottom-0 p-5 w-full flex flex-col gap-5">
            <h2 className="text-white text-4xl font-normal uppercase">
              {content.name}
            </h2>
            <Link
              href={`/collections/${content.slug}`}
              className="inline-flex items-center justify-center bg-black p-2 text-white rounded-md w-[120px] h-10 cursor-pointer hover:bg-[#7D9396]"
            >
              <ShopNewLabel />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AfterHeroSection;
