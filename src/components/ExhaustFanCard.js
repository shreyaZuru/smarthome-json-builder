import React, { useState } from "react";
import { useAppData } from "@context/AppContext";
import Image from "next/image";

const ExhaustFanCard = ({ deviceDetails, index }) => {
  const { handleNameChange } = useAppData();
  const { subItems = [] } = deviceDetails;
  const name = subItems[index]?.name;

  return (
    <div
      style={{
        backgroundColor: "#1D242A",
        borderRadius: "8px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div>
          <input
            className="font-semibold bg-transparent text-white focus:outline-none"
            value={name}
            onChange={(e) =>
              handleNameChange(deviceDetails, index, e.target.value)
            }
            autoFocus
          />
        <p className="text-2xl font-bold text-white">
          Off
        </p>
      </div>

      <div className="flex justify-center my-4">
        <Image
          src="/assets/image/exhaustFan.png"
          alt="Exhaust Fan"
            width={88}
          height={91}
          style={{
            objectFit: "contain",
            height: "91px",
            width: "auto",
          }}
        />
      </div>

      <div className="bg-[#2A343D] text-white border-none rounded-[20px] py-2.5 px-5 w-full text-center">
        Turn on
      </div>
    </div>
  );
};

export default ExhaustFanCard;
