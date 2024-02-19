import React, { useEffect } from "react";
import "./App.less";
import { Layout, Menu, Breadcrumb, Button } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  withRouter,
} from "react-router-dom";
import { About } from "./pages/About";
import { MainPage } from "./pages/MainPage";
import { OnlineConvertor } from "./pages/OnlineConvertor";
import { ExcelToMasav } from "./pages/ExcelToMasav";
import { ReactComponent as Logo } from "./assets/Logo.svg";
import { useTranslation } from "react-i18next";
import pack from "../package.json";
import CookieConsent from "react-cookie-consent";

const { Header, Content, Footer } = Layout;

const MenuComponent = withRouter(({ history }) => {
  const { t } = useTranslation();
  return (
    <>
      <CookieConsent buttonText={t("cookies-agree")}>
        {t("cookies-message")}
      </CookieConsent>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[history?.location?.pathname]}
        defaultSelectedKeys={["/"]}
      >
        <Menu.Item
          icon={
            <Logo height="25px" style={{ transform: "translate(4px, 6px)" }} />
          }
          key={"/"}
        >
          <Link to="/">{t("home-page")}</Link>
        </Menu.Item>
        <Menu.Item key={"/convert-excel"}>
          <Link to="/convert-excel">{t("convert-from-excel")}</Link>
        </Menu.Item>
        <Menu.Item key={"/charges-online-builder"}>
          <Link to="/charges-online-builder">{t("charges-online-editor")}</Link>
        </Menu.Item>
        <Menu.Item key={"/payments-online-builder"}>
          <Link to="/payments-online-builder">
            {t("payments-online-editor")}
          </Link>
        </Menu.Item>
        <Menu.Item key={"/about"}>
          <Link to="/about">{t("about")}</Link>
        </Menu.Item>
        <Menu.Item key={"/lang"}>
          <a href={`${window.location.pathname}?lang=${t("other-lang-code")}`}>
            {t("other-lang")}
          </a>
        </Menu.Item>
      </Menu>
    </>
  );
});

const App = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.getElementById("seo-title").innerHTML = t("seo-title");
    document.getElementById("seo-description").content = t("seo-description");
  }, []);
  return (
    <Router>
      <Layout
        style={{
          height: "100vh",
          overflowY: "auto",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <MenuComponent />
          <Switch>
            <Route path="/convert-excel">
              <ExcelToMasav />
            </Route>
            <Route path="/payments-online-builder">
              <OnlineConvertor id="payments" fileType="payments" />
            </Route>
            <Route path="/charges-online-builder">
              <OnlineConvertor id="charges" fileType="charges" />
            </Route>
            <Route path="/online-builder">
              <Redirect
                to={{
                  pathname: "/payments-online-builder",
                }}
              />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/">
              <MainPage />
            </Route>
          </Switch>
        </div>
        <footer style={{ textAlign: "center", padding: "5px" }}>
          {t("credits") + " v" + pack.version}
        </footer>
      </Layout>
    </Router>
  );
};

export default App;
