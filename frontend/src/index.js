import React from "react";
import ReactDOM from "react-dom/client"; // Import from "react-dom/client"
import "antd/dist/reset.css"; // Import Ant Design styles
import "./index.css";
import App from "./App";

const appElement = document.getElementById("app") || document.body; // Ensure target element exists

if (appElement) {
  const root = ReactDOM.createRoot(appElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
