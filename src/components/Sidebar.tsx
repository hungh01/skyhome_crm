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



const Sidebar = () => {
    const currentPath = usePathname();

    // Better logic for determining the active menu item
    const getSelectedKey = (pathname: string) => {
        // Handle exact matches first
        if (pathname === '/admin') return '/admin';

        if (['/admin/partners/leaders', '/admin/partners/groups'].includes(pathname)) {
            return pathname; // Return the exact path for these specific routes
        }


        // For nested routes, get the base admin path
        const pathSegments = pathname.split('/').filter(Boolean);

        if (pathSegments.length >= 2 && pathSegments[0] === 'admin') {
            return `/admin/${pathSegments[1]}`;
        }

        // Fallback
        return '/admin';
    };

    const getSelectedKeyFromBrowser = () => {
        if (typeof window !== 'undefined') {
            const pathname = window.location.pathname;
            return getSelectedKey(pathname);
        }
        return '/admin'; // fallback for server-side
    };

    // Get open keys for submenus
    const getOpenKeys = (pathname: string) => {
        if (pathname.startsWith('/admin/customers') ||
            pathname.startsWith('/admin/partners') ||
            pathname.startsWith('/admin/leaders') ||
            pathname.startsWith('/admin/groups')) {
            return ['user-management'];
        }
        return [];
    };

    const selectedKey = currentPath ? getSelectedKey(currentPath) : getSelectedKeyFromBrowser();
    const openKeys = currentPath ? getOpenKeys(currentPath) : [];
    const menuItems = [
        { key: '/admin', icon: <PieChartOutlined />, label: 'Dashboard' },
        {
            key: 'user-management',
            icon: <UserOutlined />,
            label: 'Quản lý người dùng',
            children: [
                { key: '/admin/customers', icon: <UserOutlined />, label: 'Quản lý khách hàng' },
                { key: '/admin/partners', icon: <TeamOutlined />, label: 'Quản lý cộng tác viên' },
                { key: '/admin/partners/groups', icon: <TeamOutlined />, label: 'Quản lý nhóm' },
            ],
        },
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
                        src="/Logo.png"
                        alt="Skyhome CRM Logo"
                        width={65}
                        height={60}
                        priority
                    />
                </Link>
            </div>
            <Menu
                theme="light"
                mode="inline"
                style={{ borderRight: 0, fontSize: '12px' }}
                selectedKeys={[selectedKey]}
                defaultOpenKeys={openKeys}
                items={menuItems.map((item) => {
                    if (item.children) {
                        return {
                            ...item,
                            children: item.children.map((child) => ({
                                ...child,
                                label: <Link href={child.key}>{child.label}</Link>,
                            })),
                        };
                    }
                    return {
                        ...item,
                        label: <Link href={item.key}>{item.label}</Link>,
                    };
                })}
            />
            <style jsx>{`
                :global(.ant-menu-item),
                :global(.ant-menu-submenu-title) {
                    font-size: 12px !important;
                }
                :global(.ant-menu-item-selected),
                :global(.ant-menu-submenu-selected) {
                    font-size: 12px !important;
                }
                :global(.ant-menu-submenu .ant-menu-item) {
                    font-size: 11px !important;
                }
            `}</style>
        </Sider>
    );
};
export default Sidebar;
