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

        document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);

        // Also directly update the admin content element
        const adminContent = document.querySelector('.admin-content') as HTMLElement;
        if (adminContent) {
            adminContent.style.marginLeft = sidebarWidth;
            adminContent.style.width = `calc(100% - ${sidebarWidth})`;
        }

        // Force a layout recalculation
        void document.body.offsetHeight;
    }, [collapsed]);

    // Set initial sidebar width on component mount
    useEffect(() => {
        const initialWidth = '80px';
        document.documentElement.style.setProperty('--sidebar-width', initialWidth);

        // Also set initial styles for admin content
        const adminContent = document.querySelector('.admin-content') as HTMLElement;
        if (adminContent) {
            adminContent.style.marginLeft = initialWidth;
            adminContent.style.width = `calc(100% - ${initialWidth})`;
        }
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
            '/admin/wallets/affiliate',
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
                { key: '/admin/partners', icon: <TeamOutlined />, label: 'Quản lý cộng tác viên' }, // Changed from UserOutlined to TeamOutlined
                { key: '/admin/partners/groups', icon: <UserOutlined />, label: 'Quản lý nhóm' },
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
                { key: '/admin/wallets/affiliate', icon: <CustomerServiceOutlined />, label: 'Thu chi affiliate' },
                { key: '/admin/wallets/other', icon: <ExclamationCircleOutlined />, label: 'Thu chi khách' },
            ],
        },
        { key: '/admin/reports', icon: <FileOutlined />, label: 'Báo cáo' },
        { key: '/admin/notifications', icon: <NotificationOutlined />, label: 'Quản lý thông báo' },
        { key: '/admin/penalties', icon: <ExclamationCircleOutlined />, label: 'Quản lý lệnh phạt' },
    ];
    return (
        <div className="admin-sidebar" style={{ width: collapsed ? '80px' : '220px', transition: 'width 0.3s ease' }}>
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
                    transition: 'all 0.3s ease',
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
                    height: 'calc(100vh - 84px)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}>

                    {/* Custom trigger button positioned on the right side */}
                    <div
                        onClick={() => setCollapsed(!collapsed)}
                        style={{

                            right: '-2px',
                            width: collapsed ? '80px' : '220px',
                            height: '50px',
                            backgroundColor: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 1002,

                            transition: 'all 0.3s ease'

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
                            height: 'auto',
                            overflow: 'hidden'
                            , display: 'flex', flexDirection: 'column'
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
