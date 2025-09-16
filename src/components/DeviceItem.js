"use client";
import React from "react";

const DeviceItem = ({ name, count, subItems, onCountChange, maxDevices }) => {
  const handleIncrement = () => {
    if (count >= maxDevices) return;
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
          className={`px-2 rounded-full border border-gray-500 bg-[#1D242A] hover:bg-gray-600 active:bg-gray-200 transition-colors duration-150`}
          disabled={count === 0}
          aria-label={`Decrease ${name}`}
        >
          –
        </button>
        <p className="font-semibold min-w-[160px] text-center">{name}</p>
        <button
          onClick={handleIncrement}
          className="px-2 rounded-full border border-gray-500 bg-[#1D242A] hover:bg-gray-600 active:bg-gray-200 transition-colors duration-150"
          aria-label={`Increase ${name}`}
        >
          +
        </button>
      </div>
      {subItems && <ul className="ml-2 mt-2"></ul>}
      <p className="text-sm text-gray-400">Selected: {count}</p>
    </li>
  );
};

export default DeviceItem;
