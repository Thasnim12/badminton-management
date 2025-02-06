import React from "react";
import ReactDOM from "react-dom/client"; // Import from "react-dom/client"
import "antd/dist/reset.css"; // Import Ant Design styles
import {Provider} from "react-redux"
import "./index.css";
import App from "./App";
import store from "./Store";
const appElement = document.getElementById("app") || document.body; // Ensure target element exists

if (appElement) {
  const root = ReactDOM.createRoot(appElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
        </Provider>
    </React.StrictMode>
  );
}
