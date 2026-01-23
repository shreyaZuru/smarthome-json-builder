"use client";
import React from "react";
import { useToast } from "@context/ToastContext";

const DeviceItem = ({ name, count, subItems, onCountChange, maxDevices }) => {
  const { showToast } = useToast();

  const handleIncrement = () => {
    onCountChange(count + 1);
  };

  const handleDecrement = () => {
    if (count > 0) {
      onCountChange(count - 1);
    }
  };

  return (
    <li className="mb-2 pb-2 pt-2 rounded-md">
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrement}
          className={
            "px-2 rounded-full hover:bg-gray-600 active:bg-gray-400 transition-colors duration-150 text-gray-200"
          }
          disabled={count === 0}
          aria-label={`Decrease ${name}`}
        >
          –
        </button>
        <p className="font-semibold min-w-[160px]">{name}</p>
        <button
          onClick={handleIncrement}
          className="px-2 rounded-full hover:bg-gray-600 active:bg-gray-400 transition-colors duration-150 text-gray-200"
          aria-label={`Increase ${name}`}
        >
          +
        </button>
      </div>
      {subItems && <ul className="ml-2 mt-2"></ul>}
      <p className="text-sm">Selected: {count}</p>
    </li>
  );
};

export default DeviceItem;
