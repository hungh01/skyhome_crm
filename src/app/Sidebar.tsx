import React from 'react';
import { Layout, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider'; // ✅ Sửa đúng import Sider
import {
    PieChartOutlined,
    UserOutlined,
    FileOutlined,
    TeamOutlined,
    ShoppingCartOutlined,
    AppstoreOutlined,
    GiftOutlined,
    PictureOutlined,
    CustomerServiceOutlined,
    WalletOutlined,
    NotificationOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

interface SidebarProps {
    currentPath: string;
}

const Sidebar = ({ currentPath }: SidebarProps) => {
    const basePath = '/' + currentPath.split('/')[1];

    const menuItems = [
        { key: '/', icon: <PieChartOutlined />, label: 'Dashboard' },
        { key: '/customers', icon: <UserOutlined />, label: 'Quản lý khách hàng' },
        { key: '/partners', icon: <TeamOutlined />, label: 'Quản lý cộng tác viên' },
        { key: '/orders', icon: <ShoppingCartOutlined />, label: 'Quản lý đơn hàng' },
        { key: '/services', icon: <AppstoreOutlined />, label: 'Quản lý dịch vụ' },
        { key: '/promotions', icon: <GiftOutlined />, label: 'Quản lý khuyến mãi' },
        { key: '/banners', icon: <PictureOutlined />, label: 'Quản lý banner' },
        { key: '/customer-service', icon: <CustomerServiceOutlined />, label: 'CSKH' },
        { key: '/wallets', icon: <WalletOutlined />, label: 'Quản lý sổ quỹ' },
        { key: '/reports', icon: <FileOutlined />, label: 'Báo cáo' },
        { key: '/notifications', icon: <NotificationOutlined />, label: 'Quản lý thông báo' },
        { key: '/penalties', icon: <ExclamationCircleOutlined />, label: 'Quản lý lệnh phạt' },
    ];

    return (
        <Sider collapsible defaultCollapsed={false}>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[basePath]}
                items={menuItems.map((item) => ({
                    ...item,
                    label: <Link href={item.key}>{item.label}</Link>,
                }))}
            />
        </Sider>
    );
};

export default Sidebar;
