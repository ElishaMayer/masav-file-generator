import React from "react";
import "./App.less";
import { Layout, Menu, Breadcrumb } from "antd";
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

const { Header, Content, Footer } = Layout;

const MenuComponent = withRouter(({ history }) => {
  console.log(history?.location?.pathname);
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[history?.location?.pathname]}
      defaultSelectedKeys={["/"]}
    >
      <Menu.Item key={"/"}>
        <Link to="/">Home Page</Link>
      </Menu.Item>
      <Menu.Item key={"/convert-excel"}>
        <Link to="/convert-excel">Convert from Excel</Link>
      </Menu.Item>
      <Menu.Item key={"/online-builder"}>
        <Link to="/online-builder">Online Editor</Link>
      </Menu.Item>
      <Menu.Item key={"/about"}>
        <Link to="/about">About</Link>
      </Menu.Item>
    </Menu>
  );
});

const App = () => {
  return (
    <Router>
      <Layout>
        <Header>
          <div className="logo" />
          <MenuComponent />
        </Header>
        <Content
          style={{
            padding: "0 50px",
            height: "calc(100vh - 96px",
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
          Elisha Mayer ©2021
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;
