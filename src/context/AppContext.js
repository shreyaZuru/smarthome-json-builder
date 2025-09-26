"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import AlertBox from "@component/AlertBox";

const initialDevices = [
  {
    name: "Non-dimmable lights",
    status: "Off",
    count: 0,
    type: "non_dimmable_light",
    maxDevices: 20,
  },
  {
    name: "Dimmable lights",
    status: "Off",
    count: 0,
    type: "dimmable_light",
    maxDevices: 20,
  },
  {
    name: "2 Panel sliding door",
    status: "Closed",
    count: 0,
    type: "sliding_door",
    numberOfPanels: 2,
    maxDevices: 10,
  },
  {
    name: "3 Panel sliding door",
    status: "Closed",
    count: 0,
    type: "sliding_door",
    numberOfPanels: 3,
    maxDevices: 10,
  },
  {
    name: "Garage door",
    status: "Closed",
    count: 0,
    type: "garage_door",
    maxDevices: 1,
  },
  {
    name: "Smart lock",
    status: "Active",
    count: 0,
    type: "smart_lock",
    subItems: [],
    maxDevices: 5,
  },
];

export const lightTypeList = ["non_dimmable_light", "dimmable_light"];
export const doorTypeList = ["sliding_door", "garage_door"];

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [devices, setDevices] = useState(initialDevices);
  const [alertMessage, setAlertMessage] = useState(null);
  const [dcJson, setDcJson] = useState(null);
  const [originalDevices, setOriginalDevices] = useState(null);

  let deviceId = 0;

  // Compare current devices with original devices to check for changes
  const hasChanges = useMemo(() => {
    if (!originalDevices) return false;

    // Compare device counts and contents
    for (let i = 0; i < devices.length; i++) {
      const current = devices[i];
      const original = originalDevices[i];

      // Compare count
      if (current.count !== original.count) return true;

      // Compare subItems if they exist
      if (current.subItems && original.subItems) {
        if (current.subItems.length !== original.subItems.length) return true;

        // Compare each subItem's name and checked status
        for (let j = 0; j < current.subItems.length; j++) {
          if (
            current.subItems[j].name !== original.subItems[j].name ||
            current.subItems[j].checked !== original.subItems[j].checked
          ) {
            return true;
          }
        }
      }
    }

    // No differences found
    return false;
  }, [devices, originalDevices]);

  useEffect(() => {
    // Fetch initial device data from the server
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://dev-proxy.zurutech.online/smarthome-public/demo/project/983399104480051190/json"
        );
        const data = await response.json();

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
        // Save a deep copy of original devices for comparison
        setOriginalDevices(JSON.parse(JSON.stringify(newDevices)));
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
      maxDevices: 20,
    };
    const dimmable = {
      name: "Dimmable lights",
      status: "Off",
      count: 0,
      type: "dimmable_light",
      subItems: [],
      maxDevices: 20,
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
      maxDevices: 10,
    };
    const threePanel = {
      name: "3 Panel sliding door",
      status: "Closed",
      count: 0,
      type: "sliding_door",
      numberOfPanels: 3,
      subItems: [],
      maxDevices: 10,
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
      maxDevices: 1,
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
      maxDevices: 5,
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

  const createEmptyHomeJSON = () => ({
    projectId: "983399104480051190",
    projectName: "Dummy Home",
    projectRooms: {
      rooms: [
        {
          iD: 5000,
          displayName: "Room",
          floorId: 0,
        },
      ],
    },
  });

  const createInitialDcJson = () => ({
    ...createEmptyHomeJSON(),
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
  });

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

  const handleSubmit = async ({ clearAll = false } = {}) => {
    try {
      const payload = clearAll ? createEmptyHomeJSON() : createInitialDcJson();
      if (!clearAll) {
        const deviceHandlers = {
          non_dimmable_light: (dcJson, data) =>
            addLightData(dcJson, data, false),
          dimmable_light: (dcJson, data) => addLightData(dcJson, data, true),
          sliding_door: addSlidingDoorData,
          garage_door: addGarageDoorData,
          smart_lock: addSmartLockData,
        };
        devices.forEach((device) => {
          const handler = deviceHandlers[device.type];
          if (handler) {
            handler(payload, device);
          }
        });
      }

      const response = await fetch(
        "https://dev-proxy.zurutech.online/smarthome-public/demo/project/983399104480051190",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (data.code === "OK") {
        setAlertMessage(
          `Dummy home DC json ${
            clearAll ? "cleared" : "uploaded"
          } successfully.`
        );
        deviceId = 0;
        if (clearAll) {
          setOriginalDevices(initialDevices);
          setDevices(initialDevices);
        } else {
          setOriginalDevices(JSON.parse(JSON.stringify(devices)));
        }
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        appData: {
          devices,
          hasChanges,
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
