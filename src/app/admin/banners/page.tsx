"use client";

import { Card, Typography } from "antd";
import BannerList from "./components/BannerList";
import { BannersProvider } from "./provider/banner-provider";
import Header from "./components/Header";
import CreateBannerModal from "./components/CreateBannerModal";



export default function BannersPage() {
    return (
        <BannersProvider>
            <div style={{ padding: 24 }}>
                <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <Header />
                    <BannerList />
                    <CreateBannerModal />
                </Card>
            </div>
        </BannersProvider>
    );
}