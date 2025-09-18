
import React from "react";

import "./styles/customer-detail.scss";
import { CustomerDetailProvider } from "./provider/customer-detail-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <CustomerDetailProvider>
            {children}
        </CustomerDetailProvider>
    );
}
