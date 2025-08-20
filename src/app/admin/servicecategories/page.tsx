'use client';
import { Button, Card } from "antd";
import ServiceList from "./components/ServiceCategoryList";

import { useRouter } from "next/navigation";

export default function ServicesPage() {
    const router = useRouter();

    return (
        <div style={{ padding: 24 }}>
            <ServiceList />
        </div>
    );
}