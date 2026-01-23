import React from "react";

const AlertBox = ({ title, message, onClose, onSave, buttons }) => {
  // Default buttons if not provided
  const defaultButtons = buttons || [
    {
      label: "Close",
      onClick: onClose,
      className:
        "bg-[#30343c] text-white border-none rounded-lg py-3 w-[180px] font-semibold text-[17px] cursor-pointer shadow-sm transition-colors duration-200 mx-auto block hover:bg-[#363a43]",
    },
    ...(onSave
      ? [
          {
            label: "Save",
            onClick: onSave,
            className:
              "bg-[#3b82f6] text-white border-none rounded-lg py-3 w-[180px] font-semibold text-[17px] cursor-pointer shadow-sm transition-colors duration-200 mx-auto block hover:bg-[#2563eb]",
          },
        ]
      : []),
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#23272f",
          padding: "32px 24px",
          borderRadius: "20px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.4)",
          minWidth: "340px",
          maxWidth: "90vw",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: 22,
            marginBottom: 8,
            color: "#fff",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#d1d5db",
            lineHeight: 1.4,
          }}
        >
          {message}
        </div>
        <div className="flex flex-row justify-center gap-4 mt-6">
          {defaultButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              aria-label={button.ariaLabel || button.label}
              className={button.className}
              disabled={button.disabled}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
