import React from "react";

const AlertBox = ({ title, message, onClose }) => (
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
          marginBottom: 24,
          lineHeight: 1.4,
        }}
      >
        {message}
      </div>
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          background: "#30343c",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "12px 0",
          width: 180,
          fontWeight: 600,
          fontSize: 17,
          cursor: "pointer",
          boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
          transition: "background 0.2s",
          margin: "0 auto",
          display: "block",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#363a43")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#30343c")}
      >
        Close
      </button>
    </div>
  </div>
);

export default AlertBox;
