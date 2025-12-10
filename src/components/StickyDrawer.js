import React from "react";
import DeviceList from "@component/DeviceList";
import { useAppData } from "@context/AppContext";

const StickyDrawer = () => {
  const { handleSubmit, hasChanges } = useAppData();

  return (
    <aside className="h-screen w-66 bg-gray-800 text-white p-4 fixed top-0 left-0 z-20 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Devices</h2>
      <DeviceList />

      <div className="mt-6">
        <button
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
          onClick={() => handleSubmit({ clearAll: true })}
        >
          Clear All
        </button>
      </div>
    </aside>
  );
};

export default StickyDrawer;
