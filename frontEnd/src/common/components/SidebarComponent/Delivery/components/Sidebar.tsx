"use client";

import { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  UserOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={250}
      trigger={null}
      className="h-screen bg-[#001529] shadow-lg transition-all duration-300"
    >
      <div className="flex justify-center items-center py-4">
        <Button
          type="default"
          shape="circle"
          onClick={() => setCollapsed(!collapsed)}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          className="text-white border-none shadow-md bg-[#1890ff] hover:bg-[#40a9ff] transition-all"
        />
      </div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        className="border-none text-white"
        items={[
          {
            key: "/",
            icon: <HomeOutlined className="text-lg" />,
            label: <Link href="/" className="text-white hover:text-blue-400">Home</Link>,
          },
          {
            key: "/clients",
            icon: <UserOutlined className="text-lg" />,
            label: <Link href="/pages/clients" className="text-white hover:text-blue-400">Clients</Link>,
          },
          {
            key: "/merchants",
            icon: <ShopOutlined className="text-lg" />,
            label: <Link href="/pages/merchants" className="text-white hover:text-blue-400">Merchants</Link>,
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
