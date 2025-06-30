import React from 'react';
import { Layout, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
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
    const basePath = '/admin' + currentPath.split('/')[1];

    const menuItems = [
        { key: '/admin', icon: <PieChartOutlined />, label: 'Dashboard' },
        { key: '/admin/customers', icon: <UserOutlined />, label: 'Quản lý khách hàng' },
        { key: '/admin/partners', icon: <TeamOutlined />, label: 'Quản lý cộng tác viên' },
        { key: '/admin/orders', icon: <ShoppingCartOutlined />, label: 'Quản lý đơn hàng' },
        { key: '/admin/services', icon: <AppstoreOutlined />, label: 'Quản lý dịch vụ' },
        { key: '/admin/promotions', icon: <GiftOutlined />, label: 'Quản lý khuyến mãi' },
        { key: '/admin/banners', icon: <PictureOutlined />, label: 'Quản lý banner' },
        { key: '/admin/customer-service', icon: <CustomerServiceOutlined />, label: 'CSKH' },
        { key: '/admin/wallets', icon: <WalletOutlined />, label: 'Quản lý sổ quỹ' },
        { key: '/admin/reports', icon: <FileOutlined />, label: 'Báo cáo' },
        { key: '/admin/notifications', icon: <NotificationOutlined />, label: 'Quản lý thông báo' },
        { key: '/admin/penalties', icon: <ExclamationCircleOutlined />, label: 'Quản lý lệnh phạt' },
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
