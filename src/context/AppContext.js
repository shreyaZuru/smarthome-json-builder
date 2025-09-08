"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import AlertBox from "@component/AlertBox";

const initialDevices = [
  {
    name: "Non-dimmable lights",
    status: "Off",
    count: 0,
    type: "non_dimmable_light",
  },
  { name: "Dimmable lights", status: "Off", count: 0, type: "dimmable_light" },
  {
    name: "2 Panel sliding door",
    status: "Closed",
    count: 0,
    type: "sliding_door",
    numberOfPanels: 2,
  },
  {
    name: "3 Panel sliding door",
    status: "Closed",
    count: 0,
    type: "sliding_door",
    numberOfPanels: 3,
  },
  {
    name: "Garage door",
    status: "Closed",
    count: 0,
    type: "garage_door",
  },
  {
    name: "Smart lock",
    status: "Active",
    count: 0,
    type: "smart_lock",
    subItems: [],
  },
];

export const lightTypeList = ["non_dimmable_light", "dimmable_light"];
export const doorTypeList = ["sliding_door", "garage_door"];

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [devices, setDevices] = useState(initialDevices);
  const [alertMessage, setAlertMessage] = useState(null);
  const [dcJson, setDcJson] = useState(null);

  let deviceId = 0;

  useEffect(() => {
    // Fetch initial device data from the server
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://10.40.1.4:3008/project/983399104480051190/json"
        );
        const data = await response.json();
        console.log("Fetched device data:", data);
        let tempDcJson = { ...data };
        // Extract devices from dcJson
        const lightDevices = extractLightDevices(tempDcJson);
        const slidingDoorDevices = extractSlidingDoorDevices(tempDcJson);
        const garageDoorDevices = extractGarageDoorDevices(tempDcJson);
        const smartLockDevices = extractSmartLockDevices(tempDcJson);

        // Compose devices array in the same order as initialDevices
        const newDevices = [
          ...lightDevices,
          ...slidingDoorDevices,
          ...garageDoorDevices,
          ...smartLockDevices,
        ];
        setDevices(newDevices);
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };

    fetchData();
  }, []);

  // Reverse functions to extract devices from dcJson
  function extractLightDevices(dcJson) {
    const lightingDevices =
      dcJson?.smartBuildingSystems?.lightingSystem?.lightingDevices || [];
    const lightingZones =
      dcJson?.smartBuildingSystems?.lightingSystem?.lightingZones || [];
    // Group by dimmable/non-dimmable
    const nonDimmable = {
      name: "Non-dimmable lights",
      status: "Off",
      count: 0,
      type: "non_dimmable_light",
      subItems: [],
    };
    const dimmable = {
      name: "Dimmable lights",
      status: "Off",
      count: 0,
      type: "dimmable_light",
      subItems: [],
    };
    lightingZones.forEach((zone) => {
      const device = lightingDevices.find((d) => d.iD === zone.iD);
      if (!device) return;
      const item = {
        name: device.displayName,
        type: "checkbox",
        checked: false,
      };
      if (zone.dimmable) {
        dimmable.subItems.push(item);
      } else {
        nonDimmable.subItems.push(item);
      }
    });
    nonDimmable.count = nonDimmable.subItems.length;
    dimmable.count = dimmable.subItems.length;
    return [nonDimmable, dimmable];
  }

  function extractSlidingDoorDevices(dcJson) {
    const slidingDoorDevices =
      dcJson?.smartBuildingSystems?.openingSystem?.slidingDoorDevices || [];
    // Group by numberOfPanels
    const twoPanel = {
      name: "2 Panel sliding door",
      status: "Closed",
      count: 0,
      type: "sliding_door",
      numberOfPanels: 2,
      subItems: [],
    };
    const threePanel = {
      name: "3 Panel sliding door",
      status: "Closed",
      count: 0,
      type: "sliding_door",
      numberOfPanels: 3,
      subItems: [],
    };
    slidingDoorDevices.forEach((device) => {
      const item = {
        name: device.displayName,
        type: "checkbox",
        checked: false,
      };
      if (device.panels === 2) {
        twoPanel.subItems.push(item);
      } else if (device.panels === 3) {
        threePanel.subItems.push(item);
      }
    });
    twoPanel.count = twoPanel.subItems.length;
    threePanel.count = threePanel.subItems.length;
    return [twoPanel, threePanel];
  }

  function extractGarageDoorDevices(dcJson) {
    const garageDoorController =
      dcJson?.smartBuildingDevices?.garageDoorController || [];
    const garageDoor = {
      name: "Garage door",
      status: "Closed",
      count: 0,
      type: "garage_door",
      subItems: [],
    };
    garageDoorController.forEach((device) => {
      garageDoor.subItems.push({
        name: device.displayName,
        type: "checkbox",
        checked: false,
      });
    });
    garageDoor.count = garageDoor.subItems.length;
    return [garageDoor];
  }

  function extractSmartLockDevices(dcJson) {
    const lockingControllers =
      dcJson?.smartBuildingDevices?.lockingControllers || [];
    const doorbells = dcJson?.smartBuildingDevices?.doorbells || [];
    const smartLock = {
      name: "Smart lock",
      status: "Active",
      count: 0,
      type: "smart_lock",
      subItems: [],
    };
    lockingControllers.forEach((device) => {
      // Check if a doorbell exists for this lock
      const hasDoorbell = doorbells.some(
        (bell) => bell.smartLockId === device.iD
      );
      smartLock.subItems.push({
        name: device.displayName,
        type: "checkbox",
        checked: hasDoorbell,
      });
    });
    smartLock.count = smartLock.subItems.length;
    return [smartLock];
  }

  const handleCountChange = (deviceDetails, newCount) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) => {
        if (device.name === deviceDetails.name) {
          let subItems = device.subItems ? [...device.subItems] : [];
          const currentCount = subItems.length;

          if (newCount > currentCount) {
            // Push new subItems
            for (let i = currentCount; i < newCount; i++) {
              subItems.push({
                name: `${device.name} ${i + 1}`,
                type: "checkbox",
                checked: false,
              });
            }
          } else if (newCount < currentCount) {
            // Pop subItems
            subItems = subItems.slice(0, newCount);
          }

          return { ...device, count: newCount, subItems };
        }
        return device;
      })
    );
  };
  const handleNameChange = (deviceDetails, index, newName) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        deviceDetails.name === device.name
          ? {
              ...device,
              subItems: device.subItems.map((subItem, subIndex) =>
                subIndex === index
                  ? {
                      ...subItem,
                      name: newName,
                    }
                  : subItem
              ),
            }
          : device
      )
    );
  };

  const handleCheckboxChange = (deviceDetails, index, isChecked) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.name === deviceDetails.name
          ? {
              ...device,
              subItems: device.subItems.map((subItem, subIndex) =>
                subIndex === index
                  ? {
                      ...subItem,
                      checked: isChecked,
                    }
                  : subItem
              ),
            }
          : device
      )
    );
  };

  const handleSubmit = () => {
    try {
      let roomId = 5000;

      let dcJson = {
        projectId: "983399104480051190",
        projectName: "Dummy Home",
        projectRooms: {
          rooms: [
            {
              iD: roomId,
              displayName: "Room",
              floorId: 0,
            },
          ],
        },
        smartBuildingSystems: {
          lightingSystem: {
            lightingGroups: [],
            lightingZones: [],
            lightingDevices: [],
          },
          openingSystem: {
            slidingDoorDevices: [],
          },
        },
        smartSwitches: [
          {
            iD: 1001,
            displayName: "Smart Switch",
            roomId: 5000,
          },
        ],
        smartBuildingDevices: {
          garageDoorController: [],
          lockingControllers: [],
          doorbells: [],
        },
      };
      for (let deviceTypeData of devices) {
        switch (deviceTypeData.type) {
          case "non_dimmable_light":
            addLightData(dcJson, deviceTypeData, false);
            break;
          case "dimmable_light":
            addLightData(dcJson, deviceTypeData, true);
            break;
          case "sliding_door":
            addSlidingDoorData(dcJson, deviceTypeData);
            break;
          case "garage_door":
            addGarageDoorData(dcJson, deviceTypeData);
            break;
          case "smart_lock":
            addSmartLockData(dcJson, deviceTypeData);
            break;
          default:
            break;
        }
      }

      fetch("http://10.40.1.4:3008/project/983399104480051190", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dcJson),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === "OK") {
            setAlertMessage("Dummy home DC json uploaded successfully.");
            deviceId = 0;
          }
        })
        .catch((error) => {
          console.error("API error:", error);
        });
    } catch (error) {
      console.error("error in api", error);
    }
  };

  const addLightData = (dcJson, deviceData, isDimmable) => {
    deviceData.subItems?.map((item) => {
      let currentDeviceId = ++deviceId;
      dcJson.smartBuildingSystems.lightingSystem.lightingDevices.push({
        iD: currentDeviceId,
        displayName: item.name,
        roomId: 5000,
        isFeatured: true,
      });
      dcJson.smartBuildingSystems.lightingSystem.lightingZones.push({
        iD: currentDeviceId,
        zoneId: 0,
        dimmable: isDimmable,
        lightingDeviceIds: [currentDeviceId],
      });
      dcJson.smartBuildingSystems.lightingSystem.lightingGroups.push({
        iD: currentDeviceId,
        displayName: item.name,
        lightingZoneIds: [currentDeviceId],
      });
    });
  };

  const addSlidingDoorData = (dcJson, deviceData) => {
    if (deviceId < 100) {
      deviceId = 100;
    }
    deviceData.subItems?.map((item) => {
      let currentDeviceId = ++deviceId;
      dcJson.smartBuildingSystems.openingSystem.slidingDoorDevices.push({
        iD: currentDeviceId,
        displayName: item.name,
        roomId: 5000,
        isFeatured: true,
        panels: deviceData.numberOfPanels,
        dimension: {
          w: 3675,
          h: 2690,
        },
      });
    });
  };

  const addGarageDoorData = (dcJson, deviceData) => {
    if (deviceId < 200) {
      deviceId = 200;
    }
    deviceData.subItems?.map((item) => {
      let currentDeviceId = ++deviceId;
      dcJson.smartBuildingDevices.garageDoorController.push({
        iD: currentDeviceId,
        displayName: item.name,
        roomId: 5000,
        isFeatured: true,
        dimension: {
          w: 3275,
          h: 2675,
        },
      });
    });
  };

  const addSmartLockData = (dcJson, deviceData) => {
    if (deviceId < 300) {
      deviceId = 300;
    }
    deviceData.subItems?.map((item) => {
      let currentDeviceId = ++deviceId;
      dcJson.smartBuildingDevices.lockingControllers.push({
        iD: currentDeviceId,
        displayName: item.name,
        roomId: 5000,
        isFeatured: true,
      });
      if (item.checked) {
        dcJson.smartBuildingDevices.doorbells.push({
          iD: 100 + parseInt(currentDeviceId),
          displayName: item.name + " Doorbell",
          roomId: 5000,
          smartLockId: currentDeviceId,
        });
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        appData: {
          devices,
          handleCountChange,
          handleNameChange,
          handleCheckboxChange,
          handleSubmit,
        },
      }}
    >
      {children}
      {alertMessage ? (
        <AlertBox
          title={"Success"}
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      ) : null}
    </AppContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppProvider");
  }
  return context.appData;
};
