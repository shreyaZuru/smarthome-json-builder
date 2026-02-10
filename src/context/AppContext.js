"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import AlertBox from "@component/AlertBox";

const createInitialDevices = () => [
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
  {
    name: "Exhaust fan",
    status: "Off",
    count: 0,
    type: "exhaust_fan",
    subItems: [],
    maxDevices: 5,
  },
];

const createInitialRooms = () => [
  {
    id: 1,
    name: "Living Room",
    devices: createInitialDevices(),
  },
];

export const lightTypeList = ["non_dimmable_light", "dimmable_light"];
export const doorTypeList = ["sliding_door", "garage_door"];

const AppContext = createContext();

let lightGroupId = 1; // 1-100
let slidingDoorId = 101; // 101-200
let garageDoorId = 201; // 201-300
let smartLockId = 301; // 301-400
let doorbellId = 401; // 401-500
let exhaustFanId = 600; // 600-605

const resetDeviceIds = () => {
  lightGroupId = 1;
  slidingDoorId = 101;
  garageDoorId = 201;
  smartLockId = 301;
  doorbellId = 401;
  exhaustFanId = 600;
};

export const AppProvider = ({ children }) => {
  const [rooms, setRooms] = useState(createInitialRooms());
  const [currentRoomId, setCurrentRoomId] = useState(1);
  const [alertMessage, setAlertMessage] = useState(null);
  const [dcJson, setDcJson] = useState(null);
  const [originalRooms, setOriginalRooms] = useState(null);

  // Get current room and its devices
  const currentRoom = useMemo(() => {
    return rooms.find((room) => room.id === currentRoomId) || rooms[0];
  }, [rooms, currentRoomId]);

  const devices = currentRoom?.devices || [];

  // Compare current rooms with original rooms to check for changes
  const hasChanges = useMemo(() => {
    if (!originalRooms) return false;

    // Compare room count
    if (rooms.length !== originalRooms.length) return true;

    // Compare each room
    for (let roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
      const currentRoom = rooms[roomIndex];
      const originalRoom = originalRooms[roomIndex];

      // Compare room name
      if (currentRoom.name !== originalRoom.name) return true;

      // Compare device counts and contents
      for (let i = 0; i < currentRoom.devices.length; i++) {
        const current = currentRoom.devices[i];
        const original = originalRoom.devices[i];

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
    }

    // No differences found
    return false;
  }, [rooms, originalRooms]);

  useEffect(() => {
    // Fetch initial device data from the server
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://dev-proxy.zurutech.online/smarthome-public/demo/project/983399104480051190/json",
        );
        const data = await response.json();

        let tempDcJson = { ...data };
        const roomsFromServer = data?.projectRooms?.rooms || [];

        let newRooms;
        if (roomsFromServer.length === 0) {
          // If no rooms from server, use initial rooms
          newRooms = createInitialRooms();
        } else {
          // Create rooms from server data
          newRooms = roomsFromServer.map((serverRoom, index) => {
            // Extract devices for each room from dcJson
            const lightDevices = extractLightDevices(tempDcJson, serverRoom.iD);
            const slidingDoorDevices = extractSlidingDoorDevices(
              tempDcJson,
              serverRoom.iD,
            );
            const garageDoorDevices = extractGarageDoorDevices(
              tempDcJson,
              serverRoom.iD,
            );
            const smartLockDevices = extractSmartLockDevices(
              tempDcJson,
              serverRoom.iD,
            );
            const exhaustFanDevices = extractExhaustFanDevices(
              tempDcJson,
              serverRoom.iD,
            );

            // Compose devices array in the same order as initialDevices
            const roomDevices = [
              ...lightDevices,
              ...slidingDoorDevices,
              ...garageDoorDevices,
              ...smartLockDevices,
              ...exhaustFanDevices,
            ];

            return {
              id: serverRoom.iD,
              name: serverRoom.displayName,
              devices: roomDevices,
            };
          });
        }

        setRooms(newRooms);
        setCurrentRoomId(newRooms[0]?.id || 1);
        // Save a deep copy of original rooms for comparison
        setOriginalRooms(JSON.parse(JSON.stringify(newRooms)));
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };

    fetchData();
  }, []);

  // Reverse functions to extract devices from dcJson
  function extractLightDevices(dcJson, roomId = 5000) {
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
      const device = lightingDevices.find(
        (d) => d.iD === zone.iD && d.roomId === roomId,
      );
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

  function extractSlidingDoorDevices(dcJson, roomId = 5000) {
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
    slidingDoorDevices
      .filter((device) => device.roomId === roomId)
      .forEach((device) => {
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

  function extractGarageDoorDevices(dcJson, roomId = 5000) {
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
    garageDoorController
      .filter((device) => device.roomId === roomId)
      .forEach((device) => {
        garageDoor.subItems.push({
          name: device.displayName,
          type: "checkbox",
          checked: false,
        });
      });
    garageDoor.count = garageDoor.subItems.length;
    return [garageDoor];
  }

  function extractSmartLockDevices(dcJson, roomId = 5000) {
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
    lockingControllers
      .filter((device) => device.roomId === roomId)
      .forEach((device) => {
        // Check if a doorbell exists for this lock
        const hasDoorbell = doorbells.some(
          (bell) => bell.smartLockId === device.iD,
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

  function extractExhaustFanDevices(dcJson, roomId = 5000) {
    const exhaustFanController = dcJson?.smartBuildingDevices?.exhaustFan || [];
    const exhaustFan = {
      name: "Exhaust fan",
      status: "Off",
      count: 0,
      type: "exhaust_fan",
      subItems: [],
      maxDevices: 5,
    };

    exhaustFanController
      .filter((device) => device.roomId === roomId)
      .forEach((device) => {
        exhaustFan.subItems.push({
          name: device.displayName || device.name,
          type: "checkbox",
          checked: false,
        });
      });

    exhaustFan.count = exhaustFan.subItems.length;
    return [exhaustFan];
  }

  const handleCountChange = (deviceDetails, newCount) => {
    // Validate combined limits across ALL rooms before allowing the change

    // Check for combined light limits across all rooms (non_dimmable_light + dimmable_light <= 40)
    if (lightTypeList.includes(deviceDetails.type)) {
      let totalLights = 0;
      rooms.forEach((room) => {
        room.devices.forEach((device) => {
          if (lightTypeList.includes(device.type)) {
            // If this is the device being changed, use newCount, otherwise use current count
            if (
              room.id === currentRoomId &&
              device.name === deviceDetails.name
            ) {
              totalLights += newCount;
            } else {
              totalLights += device.count;
            }
          }
        });
      });

      if (totalLights > 40) {
        setAlertMessage(
          `Total lights (dimmable + non-dimmable) across all rooms cannot exceed 40.`,
        );
        return;
      }
    }

    // Check for combined sliding door limits across all rooms (2 panel + 3 panel <= 20)
    if (deviceDetails.type === "sliding_door") {
      let totalSlidingDoors = 0;
      rooms.forEach((room) => {
        room.devices.forEach((device) => {
          if (device.type === "sliding_door") {
            // If this is the device being changed, use newCount, otherwise use current count
            if (
              room.id === currentRoomId &&
              device.name === deviceDetails.name
            ) {
              totalSlidingDoors += newCount;
            } else {
              totalSlidingDoors += device.count;
            }
          }
        });
      });

      if (totalSlidingDoors > 20) {
        setAlertMessage(
          `Total sliding doors (2 panel + 3 panel) across all rooms cannot exceed 20.`,
        );
        return;
      }
    }

    // Check garage door limit across all rooms (max 1)
    if (deviceDetails.type === "garage_door") {
      let totalGarageDoors = 0;
      rooms.forEach((room) => {
        room.devices.forEach((device) => {
          if (device.type === "garage_door") {
            // If this is the device being changed, use newCount, otherwise use current count
            if (
              room.id === currentRoomId &&
              device.name === deviceDetails.name
            ) {
              totalGarageDoors += newCount;
            } else {
              totalGarageDoors += device.count;
            }
          }
        });
      });

      if (totalGarageDoors > 1) {
        setAlertMessage("Maximum 1 garage door allowed across all rooms.");
        return;
      }
    }

    // Check smart lock limit across all rooms (max 5)
    if (deviceDetails.type === "smart_lock") {
      let totalSmartLocks = 0;
      rooms.forEach((room) => {
        room.devices.forEach((device) => {
          if (device.type === "smart_lock") {
            // If this is the device being changed, use newCount, otherwise use current count
            if (
              room.id === currentRoomId &&
              device.name === deviceDetails.name
            ) {
              totalSmartLocks += newCount;
            } else {
              totalSmartLocks += device.count;
            }
          }
        });
      });

      if (totalSmartLocks > 5) {
        setAlertMessage(`Total smart locks across all rooms cannot exceed 5.`);
        return;
      }
    }

    // Check exhaust fan limit across all rooms (max 5)
    if (deviceDetails.type === "exhaust_fan") {
      let totalExhaustFans = 0;
      rooms.forEach((room) => {
        room.devices.forEach((device) => {
          if (device.type === "exhaust_fan") {
            // If this is the device being changed, use newCount, otherwise use current count
            if (
              room.id === currentRoomId &&
              device.name === deviceDetails.name
            ) {
              totalExhaustFans += newCount;
            } else {
              totalExhaustFans += device.count;
            }
          }
        });
      });

      if (totalExhaustFans > 5) {
        setAlertMessage(`Total exhaust fans across all rooms cannot exceed 5.`);
        return;
      }
    }

    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === currentRoomId
          ? {
              ...room,
              devices: room.devices.map((device) => {
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
              }),
            }
          : room,
      ),
    );
  };
  const handleNameChange = (deviceDetails, index, newName) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === currentRoomId
          ? {
              ...room,
              devices: room.devices.map((device) =>
                deviceDetails.name === device.name
                  ? {
                      ...device,
                      subItems: device.subItems.map((subItem, subIndex) =>
                        subIndex === index
                          ? {
                              ...subItem,
                              name: newName,
                            }
                          : subItem,
                      ),
                    }
                  : device,
              ),
            }
          : room,
      ),
    );
  };

  const handleCheckboxChange = (deviceDetails, index, isChecked) => {
    // Validate doorbell limit (only 1 doorbell allowed across all rooms)
    if (deviceDetails.type === "smart_lock" && isChecked) {
      // Count all checked doorbells across all rooms
      let totalCheckedDoorbells = 0;
      rooms.forEach((room) => {
        room.devices.forEach((device) => {
          if (device.type === "smart_lock" && device.subItems) {
            totalCheckedDoorbells += device.subItems.filter(
              (item) => item.checked,
            ).length;
          }
        });
      });

      if (totalCheckedDoorbells >= 1) {
        setAlertMessage(
          "Only 1 doorbell is allowed across all rooms. Please uncheck the existing doorbell first.",
        );
        return;
      }
    }

    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === currentRoomId
          ? {
              ...room,
              devices: room.devices.map((device) =>
                device.name === deviceDetails.name
                  ? {
                      ...device,
                      subItems: device.subItems.map((subItem, subIndex) =>
                        subIndex === index
                          ? {
                              ...subItem,
                              checked: isChecked,
                            }
                          : subItem,
                      ),
                    }
                  : device,
              ),
            }
          : room,
      ),
    );
  };

  // Room management functions
  const addRoom = (roomName) => {
    if (rooms.length >= 5) {
      setAlertMessage("Maximum 5 rooms allowed.");
      return;
    }
    const newRoomId = Math.max(...rooms.map((r) => r.id), 0) + 1;
    const newRoom = {
      id: newRoomId,
      name: roomName,
      devices: createInitialDevices(),
    };
    setRooms((prev) => [...prev, newRoom]);
    setCurrentRoomId(newRoomId);
  };

  const deleteRoom = (roomId) => {
    if (rooms.length <= 1) {
      setAlertMessage("At least one room is required.");
      return;
    }
    setRooms((prev) => prev.filter((room) => room.id !== roomId));
    if (currentRoomId === roomId) {
      const remainingRooms = rooms.filter((room) => room.id !== roomId);
      setCurrentRoomId(remainingRooms[0]?.id || 1);
    }
  };

  const editRoomName = (roomId, newName) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId ? { ...room, name: newName } : room,
      ),
    );
  };

  const createEmptyHomeJSON = () => ({
    projectId: "983399104480051190",
    projectName: "Dummy Home",
    projectRooms: {
      rooms: rooms.map((room, index) => ({
        iD: room.id,
        displayName: room.name,
        floorId: 0,
      })),
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
      exhaustFan: [],
    },
    smartSwitches: rooms.map((room, index) => ({
      iD: 1000 + room.id,
      displayName: `Smart Switch - ${room.name}`,
      roomId: room.id,
    })),
    smartBuildingDevices: {
      garageDoorController: [],
      lockingControllers: [],
      doorbells: [],
    },
  });

  const addLightData = (dcJson, deviceData, isDimmable, roomId) => {
    deviceData.subItems?.map((item) => {
      let currentDeviceId = lightGroupId++;
      dcJson.smartBuildingSystems.lightingSystem.lightingDevices.push({
        iD: currentDeviceId,
        displayName: item.name,
        roomId: roomId,
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
        isFeatured: true,
        lightingZoneIds: [currentDeviceId],
      });
    });
  };

  const addSlidingDoorData = (dcJson, deviceData, roomId) => {
    deviceData.subItems?.map((item) => {
      let currentDeviceId = slidingDoorId++;
      dcJson.smartBuildingSystems.openingSystem.slidingDoorDevices.push({
        iD: currentDeviceId,
        displayName: item.name,
        roomId: roomId,
        isFeatured: true,
        panels: deviceData.numberOfPanels,
        dimension: {
          width: 3675,
          height: 2690,
        },
      });
    });
  };

  const addGarageDoorData = (dcJson, deviceData, roomId) => {
    deviceData.subItems?.map((item) => {
      let currentDeviceId = garageDoorId++;
      dcJson.smartBuildingDevices.garageDoorController.push({
        iD: currentDeviceId,
        displayName: item.name,
        roomId: roomId,
        isFeatured: true,
        dimension: {
          width: 3275,
          height: 2675,
        },
      });
    });
  };

  const addSmartLockData = (dcJson, deviceData, roomId) => {
    deviceData.subItems?.map((item) => {
      let currentDeviceId = smartLockId++;
      dcJson.smartBuildingDevices.lockingControllers.push({
        iD: currentDeviceId,
        displayName: item.name,
        roomId: roomId,
        isFeatured: true,
      });
      if (item.checked) {
        dcJson.smartBuildingDevices.doorbells.push({
          iD: doorbellId++,
          displayName: item.name + " Doorbell",
          roomId: roomId,
          smartLockId: currentDeviceId,
        });
      }
    });
  };

  const addExhaustFanData = (dcJson, deviceData, roomId) => {
    deviceData.subItems?.map((item) => {
      let currentDeviceId = exhaustFanId++;
      dcJson.smartBuildingSystems.exhaustFan.push({
        iD: currentDeviceId,
        zoneId: 0,
        displayName: item.name,
        roomId: roomId,
        isFeatured: true,
      });
    });
  };

  const handleSubmit = async ({ clearAll = false } = {}) => {
    try {
      const payload = clearAll ? createEmptyHomeJSON() : createInitialDcJson();
      if (!clearAll) {
        const deviceHandlers = {
          non_dimmable_light: (dcJson, data, roomId) =>
            addLightData(dcJson, data, false, roomId),
          dimmable_light: (dcJson, data, roomId) =>
            addLightData(dcJson, data, true, roomId),
          sliding_door: addSlidingDoorData,
          garage_door: addGarageDoorData,
          smart_lock: addSmartLockData,
          exhaust_fan: addExhaustFanData,
        };

        // Iterate through all rooms and their devices
        rooms.forEach((room) => {
          room.devices.forEach((device) => {
            const handler = deviceHandlers[device.type];
            if (handler) {
              handler(payload, device, room.id);
            }
          });
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
        },
      );

      const data = await response.json();
      if (data.code === "OK") {
        setAlertMessage(
          `Dummy home DC json ${
            clearAll ? "cleared" : "uploaded"
          } successfully.`,
        );
        resetDeviceIds();
        if (clearAll) {
          const initialRooms = createInitialRooms();
          setOriginalRooms(initialRooms);
          setRooms(initialRooms);
          setCurrentRoomId(1);
        } else {
          setOriginalRooms(JSON.parse(JSON.stringify(rooms)));
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
          rooms,
          currentRoomId,
          currentRoom,
          hasChanges,
          handleCountChange,
          handleNameChange,
          handleCheckboxChange,
          handleSubmit,
          addRoom,
          deleteRoom,
          editRoomName,
          setCurrentRoomId,
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
