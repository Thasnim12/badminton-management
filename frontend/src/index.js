import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css"; 
import { Provider } from "react-redux"
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./index.css";
import App from "./App";
import store from "./Store";

const appElement = document.getElementById("app") || document.body; 


if (appElement) {
  const root = ReactDOM.createRoot(appElement);
  const clientId = "133525221348-r5islouoshsebvjgpr4fdcjjuoqiookl.apps.googleusercontent.com";
  root.render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <Provider store={store}>
          <App />
        </Provider>
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
}
