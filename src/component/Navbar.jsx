import React, { useState } from "react";
import {
  AppstoreOutlined,
  BgColorsOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const items = [
  {
    key: "1",
    icon: <PieChartOutlined />,
    label: <Link to="/home">Home</Link>,
  },
  {
    key: "2",
    icon: <DesktopOutlined />,
    label: <Link to="/bg">BackGround</Link>,
  },
  {
    key: "3",
    icon: <ContainerOutlined />,
    label: <Link to="/qr">Generate QR</Link>,
  },
  {
    key: "4",
    icon: <ContainerOutlined />,
    label: <Link to="/bg-remove">Remove BackGround</Link>,
  },
  // {
  //   key: "5",
  //   icon: <ContainerOutlined />,
  //   label: <Link to="/file-convertor">File Convertor</Link>,
  // },
  {
    key: "6",
    icon: <ContainerOutlined />,
    label: <Link to="/doc-pdf">doc to pdf</Link>,
  },
  {
    key: "sub1",
    icon: <MailOutlined />,
    label: <Link to="/pdf-doc">Pdf To Doc</Link>,
  },
  {
    key: "sub2",
    label: <Link to="/image-enhancer">Image Enhancer</Link>,
    icon: <AppstoreOutlined />,
   
 
  },
  {
    key: "sub3",
    label: <Link to="/image-resize">Image Resize</Link>,
    icon: <AppstoreOutlined />,
   
 
  },
];

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div>
      <div className="w-full">
        <button
          type="button"
          onClick={toggleCollapsed}
          className="bg-cyan-800 p-2 w-full text-white"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        inlineCollapsed={collapsed}
        items={items}
        className="bg-cyan-500 transition-all duration-300"
      />
    </div>
  );
};

export default Navbar;
