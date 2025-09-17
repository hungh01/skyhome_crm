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
    GiftOutlined,
    PictureOutlined,
    CustomerServiceOutlined,
    NotificationOutlined,
    LeftOutlined,
    RightOutlined,
    SettingOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';

const Sidebar = () => {
    const currentPath = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKeys] = useState<string[]>([]);

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
            '/admin/collaborator/leaders',
            '/admin/collaborator/groups',
            '/admin/services/businessservices',
            '/admin/wallets/equipment',
            '/admin/wallets/other',
            '/admin/collaborators/groups'
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


    const selectedKey = currentPath ? getSelectedKey(currentPath) : getSelectedKeyFromBrowser();
    // Use state-managed openKeys instead of auto-calculated ones
    // const openKeys = currentPath ? getOpenKeys(currentPath) : [];
    const menuItems = [
        { key: '/admin', icon: <PieChartOutlined />, label: 'Dashboard' },
        {
            key: 'user-management',
            icon: <UserOutlined />, // Changed from TeamOutlined to UserOutlined
            label: 'Quản lý người dùng',
            children: [
                { key: '/admin/customers', icon: <TeamOutlined />, label: 'Quản lý khách hàng' },
                { key: '/admin/collaborators', icon: <TeamOutlined />, label: 'Quản lý CTV' },
                { key: '/admin/collaborators/groups', icon: <UserOutlined />, label: 'Quản lý nhóm' },
                //{ key: '/admin/applications', icon: <AppstoreOutlined />, label: 'Đơn ứng tuyển' },
                // { key: '/admin/penalties', icon: <ExclamationCircleOutlined />, label: 'Lệnh phạt' },
            ],
        },
        { key: '/admin/orders', icon: <GiftOutlined />, label: 'Quản lý đơn hàng' },
        {
            key: '/admin/servicecategories',
            icon: <CustomerServiceOutlined />,
            label: 'Quản lý dịch vụ',
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
        // {
        //     key: 'wallets', icon: <WalletOutlined />, label: 'Quản lý sổ quỹ',
        //     children: [
        //         { key: '/admin/wallets', icon: <AppstoreOutlined />, label: 'Thu chi vật tư' },
        //         { key: '/admin/wallets/other', icon: <ExclamationCircleOutlined />, label: 'Thu chi khác' },
        //     ],
        // },
        { key: '/admin/settings', icon: <SettingOutlined />, label: 'Cài đặt thông số' },
    ];
    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            width={collapsed ? 80 : 220}
            trigger={null}
            theme="light"
            style={{ borderRight: '1px solid #d9d9d9ff' }}
        >
            {/* Logo + Link to home */}
            <div style={{
                padding: '6px',
                textAlign: 'center',
                marginBottom: '8px',
                position: 'sticky',
                top: 0,
                zIndex: 1001
            }}>
                <Link
                    href="/admin"
                    style={{
                        display: "flex",
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

                {/* Custom trigger button positioned on the right side */}

                <div style={{
                    height: 'calc(60vh)',  // Adjust height to fit within viewport
                    alignContent: 'center'
                }}>
                    <div
                        style={{ height: '50px', alignContent: 'center', cursor: 'pointer' }}
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? <RightOutlined style={{ color: "gray", fontSize: "20px" }} /> : <LeftOutlined style={{ color: "gray", fontSize: "20px" }} />}
                    </div>
                    <Menu
                        theme="light"
                        mode="inline"
                        style={{
                            borderRight: 0,
                            fontSize: '12px',
                            flex: 1,
                            overflow: 'auto',
                            textAlign: 'left',
                        }}

                        selectedKeys={[selectedKey]}
                        openKeys={openKeys}
                        onOpenChange={setOpenKeys}
                        items={menuItems.map((item) => {
                            if (item.children) {
                                return {
                                    ...item,
                                    children: item.children.map((child) => ({
                                        ...child,
                                        label: <Link href={child.key} >{child.label}</Link>,
                                    })),
                                };
                            }
                            return {
                                ...item,
                                label: <Link href={item.key} style={{ display: 'block', textAlign: 'left' }}>{item.label}</Link>,
                            };
                        })}
                    />
                </div>
            </div>

        </Sider>
    );
};
export default Sidebar;
