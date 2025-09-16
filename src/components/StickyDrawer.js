import React from "react";
import DeviceList from "@component/DeviceList";

const StickyDrawer = () => (
  <aside className="h-screen w-66 bg-gray-800 text-white p-4 fixed top-0 left-0 z-20 shadow-lg">
    <h2 className="text-2xl font-bold mb-4">Devices</h2>
    <DeviceList />
  </aside>
);

export default StickyDrawer;
