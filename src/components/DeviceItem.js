"use client";
import React from "react";

const DeviceItem = ({ name, count, subItems, type, onCountChange }) => {
  const handleIncrement = () => {
    if (type === "garage_door") {
      onCountChange(1);
      return;
    }
    onCountChange(count + 1);
  };

  const handleDecrement = () => {
    if (count > 0) {
      onCountChange(count - 1);
    }
  };

  return (
    <li className="mb-2 pb-2 pt-2 rounded-md">
      <div className="flex items-center">
        <button onClick={handleDecrement} className="padding px-2">
          -
        </button>
        <p className="font-semibold">{name}</p>
        <button onClick={handleIncrement} className="padding px-2">
          +
        </button>
      </div>
      {subItems && <ul className="ml-2 mt-2"></ul>}
      <p className="text-sm text-gray-400">Selected: {count}</p>
    </li>
  );
};

export default DeviceItem;
