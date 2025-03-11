"use client";

import { useState } from "react";
import { Layout, Menu, Button, Switch, Modal, Input, message } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  UserOutlined,
  ShopOutlined,
  MoonOutlined,
  SunOutlined,
  LoginOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const { Sider } = Layout;

interface SidebarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ theme, toggleTheme }) => {
  const { token, setToken, logout } = useAuth(); 
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempToken, setTempToken] = useState("");

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleTokenSubmit = () => {
    if (tempToken.trim()) {
      setToken(tempToken);
      message.success("Token guardado correctamente");
      setIsModalOpen(false);
      setTempToken("");
    } else {
      message.error("Introduce un token válido");
    }
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className={`h-screen shadow-md ${theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"}`}
      theme="light"
    >
      <div className="flex justify-center items-center p-4">
        <Button type="primary" onClick={toggleCollapsed} icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} />
      </div>

      <div className="flex justify-center items-center p-2">
        <Switch checked={theme === "dark"} onChange={toggleTheme} checkedChildren={<MoonOutlined />} unCheckedChildren={<SunOutlined />} />
      </div>

      <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]} items={[
        { key: "/", icon: <HomeOutlined />, label: <Link href="/">Home</Link> },
        { key: "/clients", icon: <UserOutlined />, label: <Link href="/pages/clients">Clients</Link> },
        { key: "/merchants", icon: <ShopOutlined />, label: <Link href="/pages/merchants">Merchants</Link> },
      ]} />

      <div className="mt-auto p-4">
        <Menu theme="light" mode="inline" items={[
          {
            key: "auth",
            icon: token ? <LogoutOutlined style={{ color: "#1677ff" }} /> : <LoginOutlined style={{ color: "#1677ff" }} />,
            label: (
              <span style={{ color: "#1677ff", fontWeight: "600" }}>
                {token ? "Cerrar Sesión" : "Iniciar Sesión"}
              </span>
            ),
            onClick: token ? logout : () => setIsModalOpen(true),
            style: { backgroundColor: "rgba(40, 3, 250, 0.1)", borderRadius: "6px" },
          },
        ]} />
      </div>

      <Modal title="Iniciar Sesión" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={[
        <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancelar</Button>,
        <Button key="accept" type="primary" onClick={handleTokenSubmit}>Aceptar</Button>,
      ]}>
        <Input.Password placeholder="Introduce tu token" value={tempToken} onChange={(e) => setTempToken(e.target.value)} />
      </Modal>
    </Sider>
  );
};

export default Sidebar;
