import { Link, useNavigate } from "react-router-dom";
import { useCurrentApp } from "../context/app.context"
import { logoutAPI } from "@/services/api";
import { Header } from "antd/es/layout/layout";
import { Avatar, Badge, Dropdown, Input, MenuProps, Space } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { FaHome } from "react-icons/fa";

const AppHeader = () => {
    const { isAuthenticated, user, setIsAuthenticated, setUser } = useCurrentApp();
    const navigate = useNavigate();
    const handlelogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
        }
    }
    const items: MenuProps['items'] = [
        {
            key: 'admin',
            label: <Link to="/admin">Trang quản trị</Link>
        },
        {
            key: 'user',
            label: <Link to="/users">Quản lý tài khoản</Link>
        },
        {
            key: 'history',
            label: <Link to="/history">Lịch sử mua hàng</Link>
        },
        {
            key: 'logout',
            label: <label style={{ cursor: 'pointer' }} onClick={() => handlelogout()}>Đăng xuất</label>
        },
    ];

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    return (
        <Header style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0', margin: '0 200px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1890ff', display: 'flex', alignItems: 'center' }}>
                <FaHome />&nbsp; Home Page
            </div>
            <Input.Search
                placeholder="Bạn tìm gì hôm nay"
                style={{ maxWidth: 1000 }}
                allowClear
            />
            {isAuthenticated === true ?
                <Space size="large">
                    <Badge count={10} offset={[0, 0]}>
                        <ShoppingCartOutlined style={{ fontSize: '25px' }} />
                    </Badge>

                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Space>
                            <Avatar src={urlAvatar} /> {user?.fullName}
                        </Space>
                    </Dropdown>
                </Space>
                : ''
            }
        </Header>
    );
}

export default AppHeader