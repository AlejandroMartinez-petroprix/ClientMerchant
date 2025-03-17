"use client";

import { useState } from "react";
import { Layout, Menu, Button, Switch, Modal, Input } from "antd";
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
import { useAuth } from "@/common/context/AuthContext";

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
      setToken(tempToken); // `setToken` ya maneja las cookies
      setIsModalOpen(false);
      setTempToken("");
    }
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className={`h-screen shadow-md transition-all duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
      theme={theme === "dark" ? "dark" : "light"}
    >
      {/* Botón de colapsar */}
      <div className="flex justify-center items-center p-4">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          className="text-xl"
        />
      </div>

      {/* Switch de tema */}
      <div className="flex justify-center items-center p-2">
        <Switch
          checked={theme === "dark"}
          onChange={toggleTheme}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
        />
      </div>

      {/* Menú de navegación */}
      <Menu
        theme={theme === "dark" ? "dark" : "light"}
        mode="inline"
        defaultSelectedKeys={["1"]}
        className="border-none"
        items={[
          {
            key: "/",
            icon: <HomeOutlined />,
            label: <Link href="/">Home</Link>,
          },
          {
            key: "/clients",
            icon: <UserOutlined />,
            label: <Link href="/pages/clients">Clients</Link>,
          },
          {
            key: "/merchants",
            icon: <ShopOutlined />,
            label: <Link href="/pages/merchants">Merchants</Link>,
          },
        ]}
      />

      {/* Botón de autenticación */}
      <div className="mt-auto p-4 flex justify-center">
        <Button
          type="default"
          block
          icon={token ? <LogoutOutlined /> : <LoginOutlined />}
          className={`flex items-center justify-center gap-2 font-semibold transition-all ${
            theme === "dark"
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
          onClick={token ? logout : () => setIsModalOpen(true)}
        >
          {!collapsed && (token ? "Cerrar Sesión" : "Iniciar Sesión")}
        </Button>
      </div>

      {/* Modal de inicio de sesión */}
      <Modal
        title="Iniciar Sesión"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>,
          <Button key="accept" type="primary" onClick={handleTokenSubmit}>
            Aceptar
          </Button>,
        ]}
      >
        <Input.Password
          placeholder="Introduce tu token"
          value={tempToken}
          onChange={(e) => setTempToken(e.target.value)}
        />
      </Modal>
    </Sider>
  );
};

export default Sidebar;
