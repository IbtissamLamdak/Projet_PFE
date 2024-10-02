import { Outlet } from "react-router-dom";
import SideMenu from "../components/menu/Menu";
import { Button, ConfigProvider, Layout, theme } from "antd";
import { useState } from "react";
import AppHeader from "../components/header/Header";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import Logo from "../components/logo/Logo";
import { ToastContainer } from "react-toastify";

const { Header, Sider, Content, Footer } = Layout;

type LayoutType = {
  children?: React.ReactNode;
};

const AppLayout = ({ children }: LayoutType) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsed={collapsed}
        style={{
          background: colorBgContainer,
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1,
        }}
        className="border-r"
      >
        <Logo collapsed={collapsed} />
        <SideMenu />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          minHeight: "100vh",
          background: colorBgContainer,
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: "sticky",
          }}
          className="border-b"
        >
          <AppHeader>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((c) => !c)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </AppHeader>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
      <ToastContainer />
    </Layout>
  );
  // return (
  //   <div className="App">
  //     <Header />
  //     <div className="SideMenuAndPageContent">
  //       <SideMenu />
  //       <div className="PageContent">
  //         <Outlet />
  //         <FloatButton.BackTop visibilityHeight={100} />
  //       </div>
  //     </div>
  //     <Footer />
  //   </div>
  // );
};

export default AppLayout;
