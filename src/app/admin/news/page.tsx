"use client";

import { Card } from "antd";
import NewsFeed from "./components/NewsFeed";

import Header from "./components/Header";
import Filter from "./components/Filter";

import { NewsProvider } from "./provider/news-provider";
import CreateNewsModal from "./components/CreateNewsModal";


export default function News() {
    return (
        <div style={{ padding: 24 }}>
            <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <NewsProvider>
                    <Header />
                    <Filter />
                    <NewsFeed />
                    <CreateNewsModal />
                </NewsProvider>
            </Card>
        </div>
    );
}