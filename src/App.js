import React, { useEffect, useState } from "react";
import "./App.less";
import { Layout, Menu, Breadcrumb, Button, Modal, Tag, Checkbox } from "antd";
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
import { ReactComponent as Logo } from "./assets/Logo.svg";
import { useTranslation } from "react-i18next";
import pack from "../package.json";
import { isElectron } from "./isElectron";

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
            <Logo height="25px" style={{ transform: "translate(4px, 6px)" }} />
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
          {isElectron ? (
            <Button
              style={{ background: "none", border: "none", color: "#fff" }}
              onClick={() => {
                localStorage.setItem("@language", t("other-lang-code"));
                window.location.reload();
              }}
            >
              {t("other-lang")}
            </Button>
          ) : (
            <a
              href={`${window.location.pathname}?lang=${t("other-lang-code")}`}
            >
              {t("other-lang")}
            </a>
          )}
        </Menu.Item>
      </Menu>
    </>
  );
});

const App = () => {
  const { t } = useTranslation();
  const [showWarningModal, setShowWarningModal] = useState(
    localStorage.getItem("@userAgreedTerms") !== "true"
  );
  const [userAgreedToTerms, setUserAgreedToTerms] = useState(false);

  const agreeToTerms = () => {
    localStorage.setItem("@userAgreedTerms", "true");
    setShowWarningModal(false);
  };

  useEffect(() => {
    document.getElementById("seo-title").innerHTML = t("seo-title");
    document.getElementById("seo-description").content = t("seo-description");
  }, []);
  return (
    <React.Fragment>
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
            <div style={{ padding: "0 50px" }}>
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
            </div>
          </div>
          <footer style={{ textAlign: "center", padding: "5px" }}>
            {pack.version}
          </footer>
        </Layout>
      </Router>
      <Modal
        footer={null}
        closable={false}
        visible={showWarningModal}
        onOk={() => setShowWarningModal(false)}
      >
        <Tag
          style={{
            whiteSpace: "break-spaces",
            margin: 0,
            fontSize: "16px",
            padding: "5px",
            fontWeight: "600",
          }}
          color="red"
        >
          {t("online-convertor:masav-file-zip-warning")}
        </Tag>
        <div className="license-box">{t("license")}</div>
        <Checkbox
          style={{ margin: "10px 0" }}
          onChange={(e) => setUserAgreedToTerms(e.target.checked)}
          checked={userAgreedToTerms}
        >
          {t("license-checkbox")}
        </Checkbox>
        <Button
          href={`${window.location.pathname}?lang=${t("other-lang-code")}`}
          shape="round"
          htmlType="button"
        >
          {t("other-lang")}
        </Button>
        <Button
          style={{ margin: "0 10px" }}
          disabled={!userAgreedToTerms}
          onClick={agreeToTerms}
          type="primary"
          shape="round"
          htmlType="button"
        >
          {t("confirm")}
        </Button>
      </Modal>
    </React.Fragment>
  );
};

export default App;
