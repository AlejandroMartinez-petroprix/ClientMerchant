"use client";

import { useState } from "react";
import { Layout, Menu, Button, Switch } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  UserOutlined,
  ShopOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Sider } = Layout;

interface SidebarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ theme, toggleTheme }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className={`h-screen shadow-md ${
        theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
      }`}
      theme="light"
    >
      {/* Botón de Expandir */}
      <div className="flex justify-center items-center p-4">
        <Button
          type="primary"
          onClick={toggleCollapsed}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        />
      </div>

      {/* Botón para cambiar el tema */}
      <div className="flex justify-center items-center p-2">
        <Switch
          checked={theme === "dark"}
          onChange={toggleTheme}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
        />
      </div>

      {/* Menú de Navegación */}
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={[
          { key: "/", icon: <HomeOutlined />, label: <Link href="/">Home</Link> },
          { key: "/clients", icon: <UserOutlined />, label: <Link href="/pages/clients">Clients</Link> },
          { key: "/merchants", icon: <ShopOutlined />, label: <Link href="/pages/merchants">Merchants</Link> },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
