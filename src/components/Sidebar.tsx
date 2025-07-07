'use client';

import React from 'react';
import { Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { usePathname } from 'next/navigation';
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
import Image from 'next/image';
import logo from "@/public/Logo.png";



const Sidebar = () => {
    const currentPath = usePathname();

    // Better logic for determining the active menu item
    const getSelectedKey = (pathname: string) => {
        // Handle exact matches first
        if (pathname === '/admin') return '/admin';

        // For nested routes, get the base admin path
        const pathSegments = pathname.split('/').filter(Boolean);
        if (pathSegments.length >= 2 && pathSegments[0] === 'admin') {
            return `/admin/${pathSegments[1]}`;
        }
        // Fallback
        return '/admin';
    };

    // Alternative approach if you want to make it work without currentPath:
    // You could also implement this logic:
    const getSelectedKeyFromBrowser = () => {
        if (typeof window !== 'undefined') {
            const pathname = window.location.pathname;
            return getSelectedKey(pathname);
        }
        return '/admin'; // fallback for server-side
    };

    const selectedKey = currentPath ? getSelectedKey(currentPath) : getSelectedKeyFromBrowser();
    console.log('Sidebar rendered, currentPath:', currentPath, 'selectedKey:', selectedKey);
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
        <Sider
            collapsible
            defaultCollapsed={true}
            width={220}
            style={{ minHeight: '90vh', position: 'sticky', top: 0, zIndex: 1000, borderRight: '1px solid #f0f0f0' }}
            theme="light"
        >
            {/* Logo + Link to home */}
            <div style={{
                padding: '6px',
                textAlign: 'center',
                marginBottom: '8px'
            }}>
                <Link
                    href="/admin"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        textDecoration: "none",
                    }}
                >
                    <Image
                        src={logo}
                        alt="Skyhome CRM Logo"
                        width={65}
                        height={60}
                    />
                </Link>
            </div>
            <Menu
                theme="light"
                mode="inline"
                style={{ borderRight: 0 }}
                selectedKeys={[selectedKey]}
                items={menuItems.map((item) => ({
                    ...item,
                    label: <Link href={item.key}>{item.label}</Link>,
                }))}
            />
        </Sider>
    );
};
export default Sidebar;
