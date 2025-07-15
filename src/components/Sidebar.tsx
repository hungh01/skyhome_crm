'use client';

import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { usePathname } from 'next/navigation';
import {
    PieChartOutlined,
    UserOutlined,
    FileOutlined,
    TeamOutlined,
    AppstoreOutlined,
    GiftOutlined,
    PictureOutlined,
    CustomerServiceOutlined,
    WalletOutlined,
    NotificationOutlined,
    ExclamationCircleOutlined,
    LeftOutlined,
    RightOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';



const Sidebar = () => {
    const currentPath = usePathname();
    const [collapsed, setCollapsed] = useState(true);

    useEffect(() => {
        const sidebarWidth = collapsed ? '80px' : '220px';

        // Use CSS custom property for better performance
        document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
    }, [collapsed]);

    // Set initial sidebar width on component mount
    useEffect(() => {
        const initialWidth = '80px';
        document.documentElement.style.setProperty('--sidebar-width', initialWidth);
    }, []);

    // Better logic for determining the active menu item
    const getSelectedKey = (pathname: string) => {
        // Handle exact matches first
        if (pathname === '/admin') return '/admin';

        if ([
            '/admin/partners/leaders',
            '/admin/partners/groups',
            '/admin/services/businessservices',
            '/admin/wallets/equipment',
            '/admin/wallets/other'
        ].includes(pathname)) {
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
            icon: <UserOutlined />, // Changed from TeamOutlined to UserOutlined
            label: 'Quản lý người dùng',
            children: [
                { key: '/admin/customers', icon: <TeamOutlined />, label: 'Quản lý khách hàng' },
                { key: '/admin/partners', icon: <TeamOutlined />, label: 'Quản lý cộng tác viên' },
                { key: '/admin/partners/groups', icon: <UserOutlined />, label: 'Quản lý nhóm' },
                { key: '/admin/applications', icon: <AppstoreOutlined />, label: 'Đơn ứng tuyển' },
                { key: '/admin/penalties', icon: <ExclamationCircleOutlined />, label: 'Lệnh phạt' },
            ],
        },
        { key: '/admin/orders', icon: <GiftOutlined />, label: 'Quản lý đơn hàng' },
        {
            key: 'services',
            icon: <CustomerServiceOutlined />,
            label: 'Quản lý dịch vụ',
            children: [
                { key: '/admin/services', icon: <AppstoreOutlined />, label: 'Khách hàng cá nhân' },
                { key: '/admin/services/businessservices', icon: <WalletOutlined />, label: 'Khách hàng doanh nghiệp' },
            ],
        },
        {
            key: 'promotions',
            icon: <NotificationOutlined />,
            label: 'Marketing',
            children: [
                { key: '/admin/promotions', icon: <GiftOutlined />, label: 'Khuyến mãi' },
                { key: '/admin/banners', icon: <PictureOutlined />, label: 'Banner' },
                { key: '/admin/news', icon: <FileOutlined />, label: 'Bài viết' },
            ],
        },
        { key: '/admin/customer-service', icon: <CustomerServiceOutlined />, label: 'CSKH' },
        {
            key: 'wallets', icon: <WalletOutlined />, label: 'Quản lý sổ quỹ',
            children: [
                { key: '/admin/wallets', icon: <AppstoreOutlined />, label: 'Thu chi vật tư' },
                { key: '/admin/wallets/other', icon: <ExclamationCircleOutlined />, label: 'Thu chi khác' },
            ],
        },
        { key: '/admin/reports', icon: <FileOutlined />, label: 'Báo cáo' },
        { key: '/admin/notifications', icon: <NotificationOutlined />, label: 'Quản lý thông báo' },
    ];
    return (
        <div className="admin-sidebar">
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                width={220}
                trigger={null}
                style={{
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    zIndex: 1000,
                    borderRight: '1px solid #f0f0f0',
                    overflow: 'hidden',
                    transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'width',
                }}
                theme="light"
            >
                {/* Logo + Link to home */}
                <div style={{
                    padding: '6px',
                    textAlign: 'center',
                    marginBottom: '8px',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#fff',
                    zIndex: 1001
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
                <div style={{
                    height: 'calc(100vh - 124px)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}>

                    {/* Custom trigger button positioned on the right side */}
                    <div
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            width: '100%',
                            height: '40px',
                            backgroundColor: '#fafafa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 1002,
                            borderBottom: '1px solid #f0f0f0',
                            transition: 'background-color 0.2s ease',
                            willChange: 'background-color'
                        }}
                    >
                        {collapsed ? <RightOutlined /> : <LeftOutlined />}
                    </div>
                    <Menu
                        theme="light"
                        mode="inline"
                        style={{
                            borderRight: 0,
                            fontSize: '12px',
                            flex: 1,
                            overflow: 'auto'
                        }}
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
                </div>

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
        </div>
    );
};
export default Sidebar;
