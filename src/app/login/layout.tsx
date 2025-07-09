
import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { Montserrat } from 'next/font/google';



const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: "Login | Skyhome CRM",
    description: "Sign in to your Skyhome CRM account.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            className={montserrat.className}
            style={{
                margin: 0,
                padding: 0,
                fontFamily: montserrat.style.fontFamily,
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#fbf8ce",
            }}
        >
            <div
                style={{
                    display: "flex",
                    width: "900px",
                    height: "500px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 0 40px rgba(0,0,0,0.1)",
                    background: "#fff",
                }}
            >
                {/* Left side */}
                <div
                    style={{
                        flex: 1,
                        background: "linear-gradient(135deg, #fcda00, #f6ec1b)",
                        color: "white",
                        padding: "40px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Image src="/meo.png" alt="Skyhome CRM Logo" width={311} height={211} style={{ margin: "20px" }} />
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", textAlign: "center" }}>Welcome back!</h1>
                </div>

                {/* Right side - Login Form */}
                <div
                    style={{
                        flex: 1,
                        background: "#fff",
                        padding: "48px 32px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <div style={{ textAlign: "center", }}>
                        <Image src="/logo-company.svg" alt="Skyhome CRM Logo" height={80} width={300} style={{ margin: 0 }} />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
