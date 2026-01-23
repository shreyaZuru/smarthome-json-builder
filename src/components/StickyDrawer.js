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

  const getCurrentRoom = () => {
    return rooms.find((room) => room.id === currentRoomId);
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
                          className="text-xs text-gray-500 hover:text-gray-300 p-1"
                        >
                          ✏
                        </button>
                        {rooms.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRoom(room.id);
                            }}
                            className="text-xs text-red-500 hover:text-red-300 p-1"
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
                  disabled={rooms.length >= 10}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>+</span>
                  <span>Add Room</span>
                  {rooms.length >= 10 && (
                    <span className="text-xs">(Max 10)</span>
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
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
          onClick={() => handleSubmit({ clearAll: true })}
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
    </aside>
  );
};

export default StickyDrawer;
