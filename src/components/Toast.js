"use client";
import React, { useState, useEffect } from "react";

const Toast = ({ message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="bg-[#651E06] text-white px-6 py-3 rounded-xl shadow-lg flex items-center justify-between">
      <div className="flex-grow text-center">{message}</div>
      <button
        onClick={onClose}
        className="ml-3 text-white hover:text-gray-300"
        aria-label="Close toast"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
