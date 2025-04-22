import { BookOutlined, DashboardOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, MenuProps, Space, theme } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { RiAdminFill } from "react-icons/ri";
import { useCurrentApp } from "../context/app.context";
import { logoutAPI } from "@/services/api";
import { Link, Outlet } from "react-router-dom";

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { isAuthenticated, user, setIsAuthenticated, setUser } = useCurrentApp();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const items: MenuProps['items'] = [
        {
            key: 'home',
            label: <Link to="/admin">Trang quản trị</Link>
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="">
                    2nd menu item
                </a>
            ),
        },
        {
            key: 'logout',
            label: <label style={{ cursor: 'pointer' }} onClick={() => handlelogout()}>Đăng xuất</label>
        },
    ];

    const handlelogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
        }
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    if (isAuthenticated === false) {
        return (<Outlet />)
    }

    const isAdminRoute = location.pathname.includes("admin");
    if (isAuthenticated === true && isAdminRoute === true) {
        const role = user?.role;
        if (role === "USER") {
            return (<Outlet />)
        }
    }

    return (
        <>
            <Layout style={{ minHeight: '100vh' }} className="layout-admin">
                <Sider theme="light" trigger={null} collapsible collapsed={collapsed}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        items={[
                            {
                                key: '1',
                                icon: <RiAdminFill />,
                                label: 'Admin',
                            },
                            {
                                key: '2',
                                icon: <DashboardOutlined />,
                                label: 'Dashboard',
                            },
                            {
                                key: '3',
                                icon: <UserOutlined />,
                                label: 'Manage Users',
                                children: [
                                    { key: '6', label: 'Option 1' },
                                    { key: '7', label: 'Option 2' },
                                ],
                            },
                            {
                                key: '4',
                                icon: <BookOutlined />,
                                label: 'Manage Books',
                            },
                            {
                                key: '5',
                                icon: <ShoppingCartOutlined />,
                                label: 'Manage Orders',
                            },
                        ]}
                    />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <Dropdown menu={{ items }} placement="bottomRight">
                            <Space>
                                <Avatar src={urlAvatar} /> {user?.fullName}
                            </Space>
                        </Dropdown>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>

        </>
    )
}

export default LayoutAdmin;