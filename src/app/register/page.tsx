"use client";
import RegisterForm from "@/components/Register/RegisterForm";
import Welcome from "@/components/Register/Welcome";
import { useState } from "react";

const RegisterPage = () => {
  const [step, setStep] = useState(2);
  return (
    <div>
      {step === 1 ? (
        <Welcome nextStep={setStep} />
      ) : (
        <RegisterForm nextStep={setStep} />
      )}
    </div>
  );
};

export default RegisterPage;
