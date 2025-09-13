import Link from "next/link";

const NavList = (props: {
  collections: { id: number; name: string; slug: string }[]; 
}) => {
   
  return (
    <div className="h-16 md:flex justify-center items-center text-base text-[#5c5c5c] font-normal leading-3 hidden">
      <nav>
        <ul className="flex flex-wrap justify-center gap-x-16 gap-y-4">
          {props.collections.map((label) => (
            <li
              key={label.id}
              className="group relative cursor-pointer hover:text-[#7D9396] "
            >
              <Link
                href={`/collections/${(label.slug)}`}
                className="group relative cursor-pointer hover:text-[#7D9396]"
              >
                {label.name}
                <span className="absolute left-1/2 -bottom-full w-0 h-[1px] bg-[#7D9396] transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default NavList;
