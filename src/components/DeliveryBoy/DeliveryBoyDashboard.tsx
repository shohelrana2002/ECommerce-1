"use client";

import { getSocket } from "@/lib/socket";
import axios from "axios";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

const DeliveryBoyDashboard = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  useEffect(() => {
    const assignmentsFetch = async () => {
      try {
        const { data } = await axios.get("/api/delivery/get-assignments");
        setAssignments(data);
      } catch (error) {
        console.log(error);
      }
    };
    assignmentsFetch();
  }, []);
  /*==============socket api call here============= */
  useEffect((): any => {
    const socket = getSocket();
    socket.on("new-assignment", (deliveryAssignment) => {
      setAssignments((prev) => [...prev, deliveryAssignment]);
    });
    return () => socket.off("new-assignment");
  }, []);
  return (
    <div className="mt-24 w-full min-h-screen  bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Delivery Assignments </h2>
        {assignments?.length > 0 ? (
          assignments.map((data, index) => (
            <div
              className="p-5 bg-white rounded-xl shadow mb-4 border"
              key={index}
            >
              <p>
                <b>OrderId:</b>
                <span className="text-primary font-extrabold">
                  #{data?.order?._id.slice(-8)}
                </span>
              </p>
              <p className="flex items-center">
                <b>Address:</b>
                <MapPin size={16} className="text-primary font-bold" />
                {data?.order?.address?.fullAddress.slice(0, 83)}
              </p>
              <div className="flex justify-center gap-x-4 mt-4">
                <button
                  className="w-full px-6 py-2 bg-primary text-white rounded-full font-semibold 
      hover:bg-green-500 cursor-pointer transition-colors duration-300 shadow-md"
                >
                  Accept
                </button>
                <button
                  className="w-full px-6 py-2 cursor-pointer bg-red-800 text-white rounded-full font-semibold 
      hover:bg-red-700 transition-colors duration-300 shadow-md"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <>No Assignment Data</>
        )}
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
