"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


const Menu = (props: {collections: {id:number; slug:string;name:string}[]}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      <Image
        src="/menu.png"
        alt=""
        width={28}
        height={28}
        className="cursor-pointer"
        onClick={() => setOpen((prev) => !prev)} 
      />
      {/* Плавное появление с лева */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 p-4 bg-white shadow-lg transform transition-transform duration-300 z-40 
            ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav>
          <ul className="flex flex-col gap-8">
            <li className="border-b border-[#dfe3e8] h-7 flex justify-end items-center py-6">
              <Image
                src="/cross.png"
                alt=""
                width={20}
                height={20}
                onClick={() => setOpen((prev) => !prev)}
              />
            </li>
            {props.collections.map((item) => (
              <li
                key={item.id}
                className="group relative cursor-pointer hover:text-[#7D9396] "
              >
                <Link 
                 href={`/collections/${(item.slug)}`}
                 onClick={() => setOpen(false)}
                >
                  <span className="irelative">
                    {item.name}
                    <span className="absolute left-1/2  -bottom-full w-0 h-[1px] bg-[#7D9396] transition-all duration-300 group-hover:w-full group-hover:left-0" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* Затемнение заднего фона */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setOpen((prev) => !prev)}
        />
      )}
    </div>
  );
};

export default Menu;
