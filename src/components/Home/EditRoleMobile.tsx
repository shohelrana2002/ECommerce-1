"use client";
import axios from "axios";
import { ArrowBigRight, Bike, LucidePhone, User, UserCog } from "lucide-react";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function EditRoleMobile() {
  const { update } = useSession();
  const router = useRouter();
  const [roles, setRole] = useState([
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "user", label: "User", icon: User },
    { id: "deliveryBoy", label: "Delivery Boy", icon: Bike },
  ]);
  const [selectedRole, setSelectedRole] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const handleEdit = async () => {
    try {
      const res = await axios.post("/api/user/edit-mobile-role", {
        role: selectedRole,
        mobile: mobileNumber,
      });
      await update({ role: selectedRole });
      if (res?.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen flex items-center flex-col bg-linear-to-b from-green-100 to-white p-6">
      <motion.h1
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          // delay: 0.3,
        }}
        className="text-xl md:text-4xl font-extrabold text-primary text-center mt-8"
      >
        Select your Role
      </motion.h1>
      <div className="flex flex-col mt-10 md:flex-row justify-center items-center gap-6 mt10">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole == role.id;
          return (
            <motion.div
              key={role.id}
              className={`flex flex-col cursor-pointer items-center justify-center w-48 h-44 rounded-2xl border-2
                transition-all ${
                  isSelected
                    ? "border-primary bg-green-100 shadow-lg"
                    : "border-gray-200 bg-white hover:border-primary"
                }
                `}
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                // delay: 0.3,
              }}
              whileTap={{ scale: 0.6 }}
              onClick={() => setSelectedRole(role.id)}
            >
              <Icon size={40} />
              <span>{role.label}</span>
            </motion.div>
          );
        })}
      </div>
      <>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.6,
          }}
          className="flex flex-col items-center mt-10"
        >
          <label
            htmlFor="mobile"
            className="text-secondary inline-flex gap-2 items-center font-medium mb-2"
          >
            <LucidePhone size={16} /> Your Phone Number
          </label>
          <input
            className="w-64 md:80 border border-gray-300 rounded-xl py-3 pl-10 text-secondary  focus:ring-2 focus:ring-primary focus:outline-none"
            type="tel"
            id="mobile"
            name="mobile"
            onChange={(e) => setMobileNumber(e.target.value)}
            value={mobileNumber}
            placeholder="88+01*******45"
          />
        </motion.div>
        <motion.button
          onClick={handleEdit}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.5,
          }}
          disabled={!selectedRole || !mobileNumber}
          className={`w-64 md:84 mt-3 font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2
              ${
                selectedRole && mobileNumber.length >= 11
                  ? "bg-primary hover:bg-green-700 text-white"
                  : "bg-gray-300 text-secondary cursor-not-allowed"
              }
             `}
        >
          Go Home <ArrowBigRight />
        </motion.button>
      </>
    </div>
  );
}
