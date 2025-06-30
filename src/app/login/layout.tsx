
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | Skyhome CRM",
    description: "Sign in to your Skyhome CRM account.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            style={{
                margin: 0,
                padding: 0,
                fontFamily: "sans-serif",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #d5c5f1, #e8dffa)",
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
                        background: "linear-gradient(135deg, #6e51e2, #a076f9)",
                        color: "white",
                        padding: "40px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Welcome back!</h1>
                    <p style={{ marginTop: "12px", fontSize: "1rem", opacity: 0.9 }}>
                        You can sign in to access with your existing account.
                    </p>
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
                    {children}
                </div>
            </div>
        </div>
    );
}
