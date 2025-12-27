"use client";
import { motion } from "motion/react";
import {
  Eye,
  EyeOff,
  Leaf,
  LoaderCircle,
  Lock,
  LogIn,
  Mail,
} from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import googleIcon from "./../../assets/google.png";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setLoading(false);
        return;
      }
      router.push("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-white relative">
      <motion.h2
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
        className="text-xl md:text-4xl font-extrabold mb-2 text-primary "
      >
        Welcome Back 🎉
      </motion.h2>
      <motion.p
        initial={{
          opacity: 0,
          y: 2,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
          delay: 0.3,
        }}
        className="inline-flex text-secondary font-semibold items-center gap-2 my-2"
      >
        Visit Now ShopVerse BD <Leaf className="w-5 h-5 text-primary" />
      </motion.p>
      <motion.form
        onSubmit={handleLogin}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
          delay: 0.3,
        }}
        className="flex flex-col max-w-sm w-full gap-5"
      >
        <div className="relative">
          <Mail className="absolute left-3  top-3 w-5 h-5 text-secondary" />
          <input
            type="text"
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 text-secondary  focus:ring-2 focus:ring-primary focus:outline-none"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3  top-3 w-5 h-5 text-secondary" />
          <input
            type={show ? "text" : "password"}
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 text-secondary  focus:ring-2 focus:ring-primary focus:outline-none"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Your Password"
          />
          {show ? (
            <EyeOff
              onClick={() => setShow(!show)}
              className="absolute top-3.5 text-secondary w-5 h-5 cursor-pointer right-3"
            />
          ) : (
            <Eye
              onClick={() => setShow(!show)}
              className="absolute top-3.5 text-secondary w-5 h-5 cursor-pointer right-3"
            />
          )}
        </div>
        {(() => {
          const validation = email !== "" && password !== "";
          return (
            <button
              disabled={!validation || loading}
              className={`w-full font-semibold py-3 cursor-pointer rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2
              ${
                validation
                  ? "bg-primary hover:bg-green-700 text-white"
                  : "bg-gray-300 text-secondary cursor-not-allowed"
              }
             `}
            >
              {loading ? (
                <LoaderCircle className="w-5 h-5 animate-spin" />
              ) : (
                " Login"
              )}
            </button>
          );
        })()}
        <div className="flex items-center my-4">
          <hr className="grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 font-medium">OR</span>
          <hr className="grow border-t border-gray-300" />
        </div>
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2 bg-green-900 text-white rounded-md hover:bg-primary transition-colors duration-200"
        >
          <Image src={googleIcon} width={30} height={10} alt="google" /> Sign in
          with Google
        </button>
        <p
          onClick={() => router.push("/register")}
          className="inline-flex cursor-pointer justify-center text-secondary mt-6 items-center gap-1"
        >
          Are You New Create Account ? <LogIn className="w-5 h-4" />
          <span className="text-primary"> SignUp</span>
        </p>
      </motion.form>
    </div>
  );
};

export default LoginForm;
