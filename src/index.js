import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import CookieConsent from "react-cookie-consent";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { ErrorBoundary } from "./elements/ErrorBoundry";

const firebaseConfig = {
  apiKey: "AIzaSyCyc2BK0sp2gL6VN0eQ3QyBOnZytHqlZUY",
  authDomain: "masav-convertor.firebaseapp.com",
  projectId: "masav-convertor",
  storageBucket: "masav-convertor.appspot.com",
  messagingSenderId: "934100665803",
  appId: "1:934100665803:web:160ffd8971ed1f06ce624e",
  measurementId: "G-WLTHE7VSGS",
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

ReactDOM.render(
  <React.StrictMode>
    <CookieConsent>
      This website uses cookies to enhance the user experience.
    </CookieConsent>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
