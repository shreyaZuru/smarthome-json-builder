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
    <div className="fixed bottom-20 right-4 z-[1001] flex items-center justify-center">
      <div className="bg-[#0B283D] text-white px-4 py-2 rounded-md shadow-lg">
        {message}
      </div>
    </div>
  );
};

export default Toast;
