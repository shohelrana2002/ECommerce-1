"use client";
import { RootState } from "@/redux/store";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { motion } from "motion/react";

import Link from "next/link";
import { useSelector } from "react-redux";
const Footer = () => {
  const { userData } = useSelector((state: RootState) => state?.user);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-linear-to-r  from-green-600 to-primary  text-white mt-20"
    >
      <div className="w-[90%] md:w-[80%] mx-auto py-10  grid grid-cols-1 md:grid-cols-3  gap-10  border-b  border-green-500/40">
        {/* title name */}
        <div>
          <h2 className="text-2xl font-bold mb-3">ShopVerse BD</h2>
          <p className="text-sm text-green-100 leading-relaxed">
            Lorem ipsum dolor sit consectetur . Qui,Lorem ipsum dolor sit
            ShopVerse BD consectetur, in cum quae esse vel Vel quos.
          </p>
        </div>
        {/* quick links */}
        <div>
          <h2 className="text-xl font-semibold mb-3 ">Quick Links</h2>
          {/* user quicks Links */}
          {userData?.role === "user" && (
            <>
              <ul className="space-y-2 text-green-100  text-sm ">
                <li>
                  <Link
                    className="hover:underline hover:text-white transition"
                    href={"/"}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:underline hover:text-white transition"
                    href={"/user/cart"}
                  >
                    Cart
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:underline hover:text-white transition"
                    href={"/user/my-orders"}
                  >
                    My Orders
                  </Link>
                </li>
              </ul>
            </>
          )}
          {/* admin quicks Links */}
          {userData?.role === "admin" && (
            <>
              <ul className="space-y-2 text-green-100  text-sm ">
                <li>
                  <Link
                    className="hover:underline hover:text-white transition"
                    href={"/"}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:underline hover:text-white transition"
                    href={"/admin/addProducts"}
                  >
                    Add Product
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:underline hover:text-white transition"
                    href={"/admin/view-grocery"}
                  >
                    View Products
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:underline hover:text-white transition"
                    href={"/admin/manage-orders"}
                  >
                    Mange Orders
                  </Link>
                </li>
              </ul>
            </>
          )}
          {/* deliveryBoy quicks Links  */}
          {userData?.role === "deliveryBoy" && (
            <>
              <ul className="space-y-2 text-green-100  text-sm ">
                <li>
                  <Link
                    className="hover:underline hover:text-white transition"
                    href={"/"}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:underline hover:text-white transition"
                    href={"/delivery/help"}
                  >
                    Help
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:underline hover:text-white transition"
                    href={"/delivery/contact"}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </>
          )}
        </div>
        {/* Contact Details */}
        <div>
          <h2 className="text-2xl font-bold mb-3">Contact Us</h2>
          <ul className="space-y-2  text-green-100  text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} />
              Parbatipur,Dinajpur
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} />
              +88 013171502**
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} />
              shopsphere2002.bd@gmail.com
            </li>
          </ul>
          <div className="flex gap-4 mt-4 ">
            <Link href={"www.facebook.com/shohelranaprtb"} target="_blank">
              <Facebook className="w-5 h-5 hover:text-white transition" />
            </Link>
            <Link href={"www.facebook.com/shohelranaprtb"} target="_blank">
              <Instagram className="w-5 h-5 hover:text-white transition" />
            </Link>
            <Link href={"www.facebook.com/shohelranaprtb"} target="_blank">
              <Twitter className="w-5 h-5 hover:text-white transition" />
            </Link>
          </div>
        </div>
      </div>
      <div className="text-center py-4  text-sm  text-green-100 bg-green-800/40">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">ShopVerse BD</span>.All rights reserved.
      </div>
    </motion.div>
  );
};

export default Footer;
