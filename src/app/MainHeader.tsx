import { Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import Image from "next/image";
import Link from "next/link";
import user from "@/public/user.png";
import icon from "@/public/icon.png";

export default function MainHeader() {
  return (
    <Header style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      {/* Logo + Link to home */}
      <Link
        href="/"
        style={{
          marginLeft: "16px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          left: 0,
          position: "absolute",
          textDecoration: "none",
        }}
      >
        <Image src={icon} alt="Skyhome CRM Logo" />
        <span style={{ color: "white" }}> Sky Home</span>
      </Link>

      {/* User Avatar menu - static (không dropdown) */}
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
