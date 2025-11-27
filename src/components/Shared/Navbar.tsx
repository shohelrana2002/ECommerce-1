"use client";
import { motion } from "motion/react";
import { IUser } from "@/models/user.model";
import {
  LogOut,
  Package,
  SearchIcon,
  ShoppingCartIcon,
  User,
  X,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

export default function Navbar({ user }: { user: IUser }) {
  const menuRef = useRef<HTMLDivElement>(null);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  return (
    // left side
    <div
      className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2  bg-linear-to-r from-green-500 to-primary 
    rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4 md:px-8 z-50"
    >
      <Link
        className="text-white font-extrabold text-2xl  tracking-wide hover:scale-105 transition-transform"
        href={"/"}
      >
        ShopVerse BD
      </Link>
      {/* center */}
      <form className="hidden md:flex items-center bg-white rounded-full  px-4 py-2 w-1/2 max-w-lg shadow-md">
        <SearchIcon className="text-secondary w-5 h-5 mr-2" />
        <input
          type="text"
          placeholder="Search Grocery...."
          className="w-full outline-none text-secondary placeholder-gray-400"
        />
      </form>

      {/* Right side */}
      <div className="flex items-center gap-3 md:gap-6 relative">
        {/* small size to show search bar */}
        <div
          onClick={() => setSearchOpen(!searchOpen)}
          className=" bg-white  md:hidden rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition"
        >
          <SearchIcon className="text-primary w-6 h6" />
        </div>

        {/* Cart */}
        <Link
          href={"/"}
          className="relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition"
        >
          <ShoppingCartIcon className="w-6 h-6 text-primary" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            0
          </span>
        </Link>

        {/* User Avatar + Dropdown */}
        <div className="relative" ref={menuRef}>
          {user?.image ? (
            <Image
              src={user?.image}
              width={40}
              height={40}
              alt="user"
              className="rounded-full  cursor-pointer border-2 border-white shadow"
              onClick={() => setOpenDropdown(!openDropdown)}
            />
          ) : (
            <User
              className="w-10 h-10 text-white border-2 border-white rounded-full cursor-pointer"
              onClick={() => setOpenDropdown(!openDropdown)}
            />
          )}

          {/* Dropdown Menu */}
          <AnimatePresence>
            {openDropdown && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.2,
                  delay: 0.3,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.95,
                }}
                className="absolute right-0 mt-3 w-40 bg-white rounded-xl shadow-lg 
              border border-gray-200 p-2 z-50 animate-in fade-in duration-150"
              >
                <div
                  onClick={() => setOpenDropdown(false)}
                  className="flex gap-x-1 cursor-pointer  text-gray-700 hover:bg-primary hover:text-white rounded-lg justify-center items-center "
                >
                  <div>
                    {user?.image ? (
                      <Image
                        src={user?.image}
                        width={40}
                        height={40}
                        alt="user"
                        className="rounded-full cursor-pointer border-2 border-white shadow"
                        onClick={() => setOpenDropdown(!openDropdown)}
                      />
                    ) : (
                      <User
                        className="w-9 h-9  text-orange-400  cursor-pointer"
                        onClick={() => setOpenDropdown(!openDropdown)}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-xs  font-bold">{user?.name}</p>
                    <p className="text-xs">{user?.role}</p>
                  </div>
                </div>
                <Link
                  onClick={() => setOpenDropdown(false)}
                  href="/"
                  className="inline-flex gap-x-2 px-4 py-2   text-gray-700 hover:bg-primary hover:text-white rounded-lg"
                >
                  <Package /> My Orders
                </Link>

                <button
                  className="w-full text-left cursor-pointer inline-flex gap-x-2  px-4 py-2 text-gray-700  hover:bg-primary hover:text-white rounded-lg"
                  onClick={() => signOut()}
                >
                  <LogOut className="text-red-500" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] bg-white
               rounded-full shadow-lg z-4 flex items-center px-4 py-7
               "
                initial={{
                  opacity: 0,
                  y: -10,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.2,
                  delay: 0.3,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.95,
                }}
              >
                <SearchIcon className="text-secondary w-5 h-5 mr-2" />
                <form className="grow">
                  <input
                    type="text"
                    placeholder="Search Grocery...."
                    className="w-full outline-none text-secondary placeholder-gray-400"
                  />
                </form>
                <button onClick={() => setSearchOpen(false)}>
                  <X className="w-5 h-5 text-secondary" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
