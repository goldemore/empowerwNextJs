import Image from "next/image";
import Link from "next/link";
import NavIcons from "./NavIcons";
import NavList from "./NavList";
import Menu from "./Menu";
import SearchLabel from "./SearchLabel";
import type { Collection } from "@/app/layout";

type Props = {
  collections: Collection[];
};

const Navbar = async ({ collections }: Props) => {
  
  return (
    <header>
      <div className="h-full">
        {/* top navbar */}
        <div className="h-16 flex justify-between items-center border-b border-[#dfe3e8]">
          <div className="h-full w-full px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-36 flex justify-between items-center">
            {/* MOBILE */}
            <div className="flex gap-2 items-center cursor-pointer md:hidden">
              <Menu collections={collections} />
              <Image src="/search.png" alt="" width={20} height={20} />
            </div>
            {/* DESKTOP */}
            <div className="hidden md:flex gap-2 items-center cursor-pointer">
              <Image src="/search.png" alt="" width={20} height={20} />
              <SearchLabel />
            </div>

            {/* logo */}
            <div>
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo-emp.png" alt="" width={50} height={50} priority />
                <Image src="/empw.png" alt="" width={120} height={80} priority />
              </Link>
            </div>

            <NavIcons />
          </div>
        </div>

        {/* bottom navbar */}
        <NavList collections={collections} />
      </div>
    </header>
  );
};

export default Navbar;
