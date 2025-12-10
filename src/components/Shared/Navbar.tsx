"use client";
import { motion } from "motion/react";
import { IUser } from "@/models/user.model";
import {
  Eye,
  LogOut,
  Menu,
  Package,
  PlusCircle,
  SearchIcon,
  Settings,
  ShoppingCartIcon,
  User,
  X,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function Navbar({ user }: { user: IUser }) {
  const menuRef = useRef<HTMLDivElement>(null);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartData } = useSelector((state: RootState) => state.cart);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const sideBar = menuOpen
    ? createPortal(
        <AnimatePresence>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-998"
            onClick={() => setMenuOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -180, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -180, opacity: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 14 }}
            className="fixed top-0 left-0 h-full w-[75%] sm:w-[60%] z-999
              bg-linear-to-b from-green-900/90 via-green-800/85 to-green-700/80
              backdrop-blur-xl shadow-[0_0_25px_rgba(0,255,120,0.35)]
              border-r border-green-400/20 p-6 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-green-100 tracking-wide">
                Admin Panel
              </h1>

              <button
                onClick={() => setMenuOpen(false)}
                className="text-white/80 hover:text-red-500 transition-all"
              >
                <X size={28} />
              </button>
            </div>

            {/* Divider */}
            <div className="w-full h-1 bg-white/10 mb-6"></div>

            {/* Menu Buttons */}
            <div className="flex flex-col gap-3 sm:hidden">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl 
                bg-white/10 hover:bg-green-500/30 transition-all
                text-green-50 font-medium border border-white/10
                shadow-inner"
              >
                {user?.image ? (
                  <Image
                    width={36}
                    className="rounded-full"
                    height={36}
                    src={user?.image}
                    alt="user"
                  />
                ) : (
                  <User />
                )}{" "}
                <p className="flex flex-col">
                  {user?.name}
                  <span className="text-xs">{user?.role}</span>
                </p>
              </Link>
              <Link
                href="/admin/addProducts"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl 
                bg-white/10 hover:bg-green-500/30 transition-all
                text-green-50 font-medium border border-white/10
                shadow-inner"
              >
                <PlusCircle size={20} /> Add Product
              </Link>

              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl 
                bg-white/10 hover:bg-blue-500/30 transition-all
                text-blue-100 font-medium border border-white/10
                shadow-inner"
              >
                <Eye size={20} /> View Products
              </Link>

              <Link
                href="/admin/manage-product"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl 
                bg-white/10 hover:bg-orange-500/30 transition-all
                text-orange-200 font-medium border border-white/10
                shadow-inner"
              >
                <Settings size={20} /> Manage Products
              </Link>
            </div>

            {/* Bottom Footer */}
            <div className="mt-auto pt-6 flex flex-col gap-4">
              {/* Logout Button */}
              <button
                onClick={async () => await signOut({ callbackUrl: "/" })}
                className="flex items-center gap-3 p-3 rounded-xl 
      bg-red-500/20 text-red-200 
      hover:bg-red-600 hover:text-white 
      transition-all border border-red-500/30 shadow-inner"
              >
                <LogOut size={20} />
                Logout
              </button>

              <p className="text-xs text-white/40 tracking-wide text-center">
                © {new Date().getFullYear()} ShopVerse Admin
              </p>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )
    : null;

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
      {user?.role === "user" && (
        <>
          {/* center */}
          <form className="hidden md:flex items-center bg-white rounded-full  px-4 py-2 w-1/2 max-w-lg shadow-md">
            <SearchIcon className="text-secondary w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Search Grocery...."
              className="w-full outline-none text-secondary placeholder-gray-400"
            />
          </form>
        </>
      )}

      {/* Right side */}
      <div className="flex items-center gap-3 md:gap-6 relative">
        {/* small size to show search bar */}
        {user?.role === "user" && (
          <>
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
                {cartData?.length ? cartData?.length : 0}
              </span>
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/admin/addProducts"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-green-700 hover:bg-green-600 hover:text-white transition font-medium"
              >
                <PlusCircle size={18} />
                Add Product
              </Link>

              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition font-medium"
              >
                <Eye size={18} />
                View Product
              </Link>

              <Link
                href="/admin/manage-product"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-100 text-orange-700 hover:bg-orange-600 hover:text-white transition font-medium"
              >
                <Settings size={18} />
                Manage Product
              </Link>
            </div>
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex bg-white  rounded-full w-10 h-10 justify-center items-center shadow-md md:hidden"
            >
              <Menu className="text-primary w-6 h-6"></Menu>
            </div>
          </>
        )}

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
                {user?.role === "user" && (
                  <>
                    <Link
                      onClick={() => setOpenDropdown(false)}
                      href="/"
                      className="inline-flex gap-x-2 px-4 py-2   text-gray-700 hover:bg-primary hover:text-white rounded-lg"
                    >
                      <Package /> My Orders
                    </Link>
                  </>
                )}

                <button
                  className="w-full text-left cursor-pointer inline-flex gap-x-2  px-4 py-2 text-gray-700  hover:bg-primary hover:text-white rounded-lg"
                  onClick={() => signOut()}
                >
                  <LogOut className="text-red-500" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {user?.role === "user" && (
            <>
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
            </>
          )}
        </div>
      </div>
      {sideBar}
    </div>
  );
}
