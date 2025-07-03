
import { Header } from "antd/es/layout/layout";
import Image from "next/image";

import user from "@/public/user.png";

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
        <Image
          src={user}
          alt="User"
          width={32}
          height={32}
          style={{ borderRadius: "50%" }}
        />
      </div>
    </Header>
  );
}
