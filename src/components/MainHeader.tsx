
import { Header } from "antd/es/layout/layout";
import Image from "next/image";

import user from "@/public/user.png";
import { Dropdown } from "antd";

export default function MainHeader() {
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
                      src={user}
                      alt="User"
                      width={32}
                      height={32}
                      style={{ borderRadius: "50%", marginRight: 8 }}
                    />
                    <span>User Name</span>
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
              },
            ],
          }}
          trigger={["click"]}
        >
          <div style={{ cursor: "pointer" }}>
            <Image
              src={user}
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
