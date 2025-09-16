"use client";
import React, { useMemo } from "react";

import SmartLockCard from "@component/SmartLockCard";
import DoorCard from "@component/DoorCard";
import LightCard from "@component/LightCard";
import StickyDrawer from "@component/StickyDrawer";
import { useAppData, lightTypeList, doorTypeList } from "@context/AppContext";

const DemoScreen = () => {
  const { devices, hasChanges, handleNameChange, handleSubmit } = useAppData();

  const lightDevices = useMemo(
    () => devices.filter((device) => lightTypeList.includes(device.type)),
    [devices]
  );
  const doorDevices = useMemo(
    () => devices.filter((device) => doorTypeList.includes(device.type)),
    [devices]
  );
  const smartLockDevices = useMemo(
    () => devices.filter((device) => device.type === "smart_lock"),
    [devices]
  );
  const isAnySelected = useMemo(
    () =>
      lightDevices.some((device) => device.count > 0) ||
      doorDevices.some((device) => device.count > 0) ||
      smartLockDevices.some((device) => device.count > 0),
    [lightDevices, doorDevices, smartLockDevices]
  );

  return (
    <div className="flex">
      <StickyDrawer />
      <main className="flex-grow p-8 ml-64">
        <header>
          <h1 className="text-4xl font-bold mb-4">Smart Home</h1>
          <p className="text-lg text-gray-600 mb-8">
            Welcome to your smart home dashboard.{" "}
            {isAnySelected && (
              <span>
                Below cards are non operable display preview. To operate them
                submit and test in mobile device.
              </span>
            )}
          </p>
        </header>
        <section className="light-card-container">
          {lightDevices.flatMap((device) =>
            Array.from({ length: device.count }).map((_, index) => (
              <div
                key={`${device.name}-${index}`}
                className="light-card-wrapper"
              >
                <LightCard
                  deviceDetails={device}
                  index={index}
                  brightness={0}
                  handleNameChange={(e) =>
                    handleNameChange(device, index, e.target.value)
                  }
                />
              </div>
            ))
          )}
        </section>
        <section style={{ marginTop: 16 }}>
          {doorDevices.flatMap((device) =>
            Array.from({ length: device.count }).map((_, index) => (
              <div
                key={`${device.name}-${index}`}
                className="door-card-wrapper"
              >
                <DoorCard
                  deviceDetails={device}
                  index={index}
                  numberOfPanels={device.numberOfPanels}
                />
              </div>
            ))
          )}
          {smartLockDevices.flatMap((device) =>
            Array.from({ length: device.count }).map((_, index) => (
              <div
                key={`${device.name}-${index}`}
                className="door-card-wrapper"
              >
                <SmartLockCard deviceDetails={device} index={index} />
              </div>
            ))
          )}
        </section>
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          <button
            style={{
              backgroundColor: hasChanges ? "#3B82F6" : "#394046",
              color: hasChanges ? "white" : "grey",
              border: "none",
              borderRadius: 20,
              padding: "10px 20px",
              cursor: hasChanges ? "pointer" : "not-allowed",
            }}
            onClick={handleSubmit}
            disabled={!hasChanges}
          >
            Submit
          </button>
        </div>
      </main>
    </div>
  );
};

export default DemoScreen;
