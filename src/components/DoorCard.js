import React from "react";
import Image from "next/image";
import { getDoorImage } from "../utils/imageLoader";
const garageDoorImage = "/assets/image/GarageDoor.png";
import { useAppData } from "@context/AppContext";

const DoorCard = ({ deviceDetails, index, numberOfPanels }) => {
  const doorImage = getDoorImage(numberOfPanels);
  const { handleNameChange } = useAppData();
  const { subItems = [], status } = deviceDetails;
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
      <div className="flex justify-between items-start">
        <div>
          <input
            className="font-semibold bg-transparent text-white focus:outline-none"
            value={name}
            onChange={(e) =>
              handleNameChange(deviceDetails, index, e.target.value)
            }
            autoFocus
          />
          <p className="text-2xl font-bold text-white">{status}</p>
        </div>
        <div className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
      <div className="flex justify-center my-4">
        {doorImage ? (
          <Image
            src={doorImage}
            alt={name}
            style={{ objectFit: "contain", height: "91.13px", width: "auto" }}
            width={200}
            height={91.13}
          />
        ) : (
          <Image
            src={garageDoorImage}
            alt={name}
            style={{ objectFit: "contain", height: "94px", width: "auto" }}
            width={200}
            height={94}
          />
        )}
      </div>
      <div className="bg-[#2A343D] text-white border-none rounded-[20px] py-2.5 px-5 w-full text-center">
        Open
      </div>
    </div>
  );
};

export default DoorCard;
