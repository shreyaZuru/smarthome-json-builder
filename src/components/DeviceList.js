"use client";
import React from "react";
import DeviceItem from "@component/DeviceItem";
import { useAppData } from "@context/AppContext";

const DeviceList = () => {
  const { devices, handleCountChange } = useAppData();
  return (
    <ul>
      {devices.map((device) => (
        <DeviceItem
          key={device.name}
          {...device}
          onCountChange={(newCount) => handleCountChange(device, newCount)}
        />
      ))}
    </ul>
  );
};

export default DeviceList;
