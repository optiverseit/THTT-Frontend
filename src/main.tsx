import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { getGoogleClientId } from "./config/env";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
    <ErrorBoundary>
      <GoogleOAuthProvider
        clientId={getGoogleClientId()}
        locale="en"
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ErrorBoundary>,
);