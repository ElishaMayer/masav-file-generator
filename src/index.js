import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import CookieConsent from "react-cookie-consent";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { ErrorBoundary } from "./elements/ErrorBoundry";
import "./i18Next";
import { Skeleton } from "antd";
import { ConfigProvider } from "antd";
import { getLanguageCode } from "./functions/getLanguageCode";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { isElectron } from "./isElectron";

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
    <Suspense fallback={<Skeleton />}>
      {!isElectron && (
        <CookieConsent>
          This website uses cookies to enhance the user experience.
        </CookieConsent>
      )}
      <ErrorBoundary>
        <ConfigProvider direction={getLanguageCode() === "he" ? "rtl" : "ltr"}>
          <App />
        </ConfigProvider>
      </ErrorBoundary>
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
if (isElectron) serviceWorkerRegistration.unregister();
else serviceWorkerRegistration.register();
