import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ErrorBoundary } from "./elements/ErrorBoundary";
import "./i18Next";
import { Skeleton } from "antd";
import { ConfigProvider } from "antd";
import { getLanguageCode } from "./functions/getLanguageCode";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<Skeleton />}>
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
serviceWorkerRegistration.unregister();
