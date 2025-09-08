import React from "react";
import { useAppData } from "@context/AppContext";

const KeyIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.6001 4C14.9609 4 11.2002 7.76081 11.2002 12.4C11.2002 12.782 11.2257 13.1587 11.2754 13.5283C11.3117 13.7983 11.3342 13.9673 11.3461 14.0905C11.3483 14.1124 11.3498 14.1304 11.3508 14.145L11.3401 14.1568C11.2817 14.221 11.1977 14.3054 11.0466 14.4565L4.91405 20.5891L4.87066 20.6323C4.70908 20.7931 4.50563 20.9954 4.35389 21.2431C4.2223 21.4578 4.12533 21.6919 4.06654 21.9368C3.99874 22.2192 3.99951 22.5061 4.00012 22.734L4.00023 22.7953L4.00023 24.9183C4.00019 25.2211 4.00015 25.5161 4.02056 25.7659C4.04298 26.0402 4.09586 26.3639 4.26181 26.6896C4.49191 27.1412 4.85905 27.5083 5.31064 27.7384C5.63634 27.9044 5.96002 27.9572 6.23433 27.9797C6.48408 28.0001 6.77896 28 7.08176 28L10.0002 28C10.6629 28 11.2002 27.4627 11.2002 26.8V25.6H12.4001C13.0629 25.6 13.6001 25.0627 13.6001 24.4V23.2H14.8001C15.1184 23.2 15.4236 23.0736 15.6486 22.8485L17.5436 20.9536C17.6947 20.8025 17.7791 20.7185 17.8433 20.66L17.8551 20.6493C17.8696 20.6504 17.8877 20.6519 17.9096 20.654C18.0328 20.6659 18.2018 20.6884 18.4718 20.7247C18.8414 20.7744 19.218 20.8 19.6001 20.8C24.2392 20.8 28 17.0392 28 12.4C28 7.76081 24.2392 4 19.6001 4ZM19.6003 11.1998C19.9092 11.1998 20.2142 11.3167 20.4488 11.5512C20.6833 11.7858 20.8002 12.0908 20.8002 12.3997C20.8003 13.0625 21.3375 13.5997 22.0003 13.5997C22.663 13.5997 23.2002 13.0624 23.2002 12.3997C23.2002 11.4802 22.8485 10.5569 22.1458 9.85419C21.4431 9.15148 20.5197 8.79978 19.6003 8.79978C18.9375 8.79978 18.4003 9.33703 18.4003 9.99977C18.4003 10.6625 18.9375 11.1998 19.6003 11.1998Z"
      fill="currentColor"
    />
  </svg>
);

const SmartLockCard = ({ deviceDetails, index }) => {
  const { handleCheckboxChange, handleNameChange } = useAppData();
  const { subItems = [], status } = deviceDetails;
  const name = subItems[index]?.name;
  const doorbellChecked = subItems[index]?.checked || false;

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
        height: "255px",
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
        <div className="flex items-center">
          <label className="text-white mr-2">Camera doorbell</label>
          <input
            type="checkbox"
            checked={doorbellChecked}
            onChange={(e) =>
              handleCheckboxChange(deviceDetails, index, e.target.checked)
            }
          />
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#2A343D",
          color: "white",
          border: "none",
          borderRadius: "40px",
          padding: "10px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          marginTop: "16px",
        }}
      >
        <div
          style={{
            backgroundColor: "#398FCE",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#F9FAFB",
          }}
        >
          <KeyIcon />
        </div>
        <span className="ml-4">Slide to unlock door</span>
      </div>
    </div>
  );
};

export default SmartLockCard;
