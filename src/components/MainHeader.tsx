'use client';
import { Header } from "antd/es/layout/layout";
import Image from "next/image";

import { Button, Dropdown } from "antd";
import { useAuth } from "@/storage/auth-context";
import { logOutApi } from "@/api/auth/auth-api";
import { isDetailResponse } from "@/utils/response-handler";
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useRouter } from "next/navigation";

export default function MainHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    const res = await logOutApi();
    if (isDetailResponse(res)) {
      logout();
      window.location.href = "/login";
    } else {
      console.error("Logout failed:", res.error);
    }
  };

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffff",
        position: "relative",
        borderBottom: "1px solid #e8e8e8",
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
      </div>
      {/* User Avatar menu */}
      <div
        style={{
          marginRight: "16px",
          display: "flex",
          alignItems: "center",
          right: 0,
          position: "absolute",
        }}
      >
        <Dropdown
          menu={{
            items: [
              {
                key: 'user-info',
                disabled: true,
                label: (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Image
                      src="/user.png"
                      alt="User"
                      width={32}
                      height={32}
                      style={{ borderRadius: "50%", marginRight: 8 }}
                    />
                    <span>{user?.fullName}</span>
                  </div>
                ),
              },
              {
                type: 'divider',
              },
              {
                key: 'profile',
                label: 'Profile',
              },
              {
                key: 'settings',
                label: 'Settings',
              },
              {
                type: 'divider',
              },
              {
                key: 'logout',
                label: 'Logout',
                onClick: handleLogout
              },
            ],
          }}
          trigger={["click"]}
        >
          <div style={{ cursor: "pointer" }}>
            <Image
              src="/user.png"
              alt="User"
              width={32}
              height={32}
              style={{ borderRadius: "50%" }}
            />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}
