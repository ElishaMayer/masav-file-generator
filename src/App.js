import React, { useEffect } from "react";
import "./App.less";
import { Layout, Menu, Breadcrumb, Button } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  withRouter,
} from "react-router-dom";
import { About } from "./pages/About";
import { MainPage } from "./pages/MainPage";
import { OnlineConvertor } from "./pages/OnlineConvertor";
import { ExcelToMasav } from "./pages/ExcelToMasav";
import { ReactComponent as Logo } from "./logo.svg";
import { useTranslation } from "react-i18next";
import pack from "../package.json";

const { Header, Content, Footer } = Layout;

const MenuComponent = withRouter(({ history }) => {
  const { t } = useTranslation();
  return (
    <>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[history?.location?.pathname]}
        defaultSelectedKeys={["/"]}
      >
        <Menu.Item
          icon={
            <Logo height="25px" style={{ transform: "translate(-6px, 6px)" }} />
          }
          key={"/"}
        >
          <Link to="/">{t("home-page")}</Link>
        </Menu.Item>
        <Menu.Item key={"/convert-excel"}>
          <Link to="/convert-excel">{t("convert-from-excel")}</Link>
        </Menu.Item>
        <Menu.Item key={"/online-builder"}>
          <Link to="/online-builder">{t("online-editor")}</Link>
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
      <Layout>
        <MenuComponent />
        <Content
          style={{
            padding: "0 50px",
            height: "calc(100vh - 80px",
            overflowY: "scroll",
          }}
        >
          <Switch>
            <Route path="/convert-excel">
              <ExcelToMasav />
            </Route>
            <Route path="/online-builder">
              <OnlineConvertor />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/">
              <MainPage />
            </Route>
          </Switch>
        </Content>
        <Footer style={{ textAlign: "center", padding: "5px" }}>
          {t("credits") + " v" + pack.version}
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;
