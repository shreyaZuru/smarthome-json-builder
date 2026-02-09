import React, { useState } from "react";
import DeviceList from "@component/DeviceList";
import { useAppData } from "@context/AppContext";
import AlertBox from "@component/AlertBox";

const StickyDrawer = () => {
  const {
    handleSubmit,
    hasChanges,
    currentRoom,
    rooms,
    currentRoomId,
    setCurrentRoomId,
    addRoom,
    deleteRoom,
    editRoomName,
  } = useAppData();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [showEditAlert, setShowEditAlert] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showClearAllAlert, setShowClearAllAlert] = useState(false);

  const handleRoomSelect = (roomId) => {
    setCurrentRoomId(roomId);
    setIsDropdownOpen(false);
  };

  const handleAddRoom = () => {
    if (newRoomName.trim()) {
      addRoom(newRoomName.trim());
      setNewRoomName("");
      setIsAdding(false);
    }
  };

  const handleEditRoom = (roomId, currentName) => {
    setEditingRoomId(roomId);
    setEditingName(currentName);
    setShowEditAlert(true);
    setIsDropdownOpen(false);
  };

  const handleSaveEdit = () => {
    if (editingName.trim()) {
      editRoomName(editingRoomId, editingName.trim());
    }
    setEditingRoomId(null);
    setEditingName("");
    setShowEditAlert(false);
  };

  const handleCancelEdit = () => {
    setEditingRoomId(null);
    setEditingName("");
    setShowEditAlert(false);
  };

  const handleDeleteRoom = (roomId) => {
    setDeletingRoomId(roomId);
      setShowDeleteAlert(true);
      setIsDropdownOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteRoom(deletingRoomId);
    setDeletingRoomId(null);
    setShowDeleteAlert(false);
  };

  const handleCancelDelete = () => {
    setDeletingRoomId(null);
    setShowDeleteAlert(false);
  };

  const handleClearAll = () => {
    setShowClearAllAlert(true);
  };

  const handleConfirmClearAll = () => {
    handleSubmit({ clearAll: true });
    setShowClearAllAlert(false);
  };

  const handleCancelClearAll = () => {
    setShowClearAllAlert(false);
  };

  const getCurrentRoom = () => {
    return rooms.find((room) => room.id === currentRoomId);
  };

  const isClearAllDisabled = () => {
    const roomCount = rooms.length;
    let totalDevices = 0;
    
    // Count total devices across all rooms
    rooms.forEach((room) => {
      room.devices.forEach((device) => {
        totalDevices += device.count;
      });
    });

    // Disable when single room with no devices
    return roomCount === 1 && totalDevices === 0;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <aside className="h-screen w-66 bg-gray-800 text-white p-3 fixed top-0 left-0 z-20 shadow-lg overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-3">Select Room</h2>
        <div className="flex items-center gap-2 mb-2">
          {/* Room Dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors text-lg font-semibold"
            >
              <span>{getCurrentRoom()?.name || "Select Room"} devices:</span>
              <span
                className={`transform transition-transform ml-2 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-1 bg-gray-600 border border-gray-600 rounded-lg shadow-lg z-50 w-full overflow-hidden">
                {rooms.map((room) => (
                  <div key={room.id} className="group">
                    <div
                      className={`flex items-center justify-between px-4 py-2 hover:bg-gray-700 cursor-pointer ${
                        currentRoomId === room.id ? "bg-gray-800" : ""
                      }`}
                      onClick={() => handleRoomSelect(room.id)}
                    >
                      <span>{room.name}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditRoom(room.id, room.name);
                          }}
                          className="text-xs text-gray-500 hover:text-gray-300 p-1 cursor-pointer"
                        >
                          ✏
                        </button>
                        {rooms.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRoom(room.id);
                            }}
                            className="text-xs text-red-500 hover:text-red-300 p-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add new room */}
            <div className="my-4">
              {isAdding ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Room name"
                    maxLength={30}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleAddRoom();
                      if (e.key === "Escape") {
                        setIsAdding(false);
                        setNewRoomName("");
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddRoom}
                      disabled={!newRoomName.trim()}
                      className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white text-sm rounded transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setIsAdding(false);
                        setNewRoomName("");
                      }}
                      className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAdding(true)}
                  disabled={rooms.length >= 5}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>+</span>
                  <span>Add Room</span>
                  {rooms.length >= 5 && (
                    <span className="text-xs">(Max 5)</span>
                  )}
                </button>
              )}
            </div>
            <div className="border-t border-gray-600 mt-4"></div>
          </div>
        </div>
        <DeviceList />
      </div>

      {/* Separator */}
      <div className="border-t border-gray-600 mb-4"></div>

      <div className="mt-6">
        <button
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
          onClick={handleClearAll}
          disabled={isClearAllDisabled()}
        >
          Clear All
        </button>
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      {/* Edit Room AlertBox */}
      {showEditAlert && (
        <AlertBox
          title="Edit Room Name"
          onClose={handleCancelEdit}
          onSave={handleSaveEdit}
          message={
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              placeholder="Room name"
              maxLength={30}
              onKeyPress={handleKeyPress}
              autoFocus
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #374151",
                borderRadius: "8px",
                background: "#374151",
                color: "#fff",
                fontSize: "16px",
                outline: "none",
              }}
            />
          }
        />
      )}

      {/* Delete Room AlertBox */}
      {showDeleteAlert && (
        <AlertBox
          title="Delete Room"
          message={`Are you sure you want to delete "${rooms.find((r) => r.id === deletingRoomId)?.name}"? All devices in this room will be removed.`}
          buttons={[
            {
              label: "Cancel",
              onClick: handleCancelDelete,
              className:
                "bg-[#30343c] text-white border-none rounded-lg py-3 px-6  font-semibold text-[17px] cursor-pointer shadow-sm hover:bg-[#363a43]",
              disabled: false,
              ariaLabel: "Cancel action",
            },
            {
              label: "Delete",
              onClick: handleConfirmDelete,
              className:
                "bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg cursor-pointer",
            },
          ]}
        />
      )}

      {/* Clear All AlertBox */}
      {showClearAllAlert && (
        <AlertBox
          title="Clear All"
          message="Are you sure you want to clear all rooms and devices? This action cannot be undone."
          buttons={[
            {
              label: "Cancel",
              onClick: handleCancelClearAll,
              className:
                "bg-[#30343c] text-white border-none rounded-lg py-3 px-6 font-semibold text-[17px] cursor-pointer shadow-sm hover:bg-[#363a43]",
              ariaLabel: "Cancel clear all",
            },
            {
              label: "Clear All",
              onClick: handleConfirmClearAll,
              className:
                "bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg cursor-pointer font-semibold text-[17px]",
            },
          ]}
        />
      )}
    </aside>
  );
};

export default StickyDrawer;
