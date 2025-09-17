'use client';

import CreateUser from "./components/CreateUser";
import ListUser from "./components/ListUser";
import Header from "./components/Header";
import { CustomerProvider } from "./provider/customer-provider";

export default function CustomersPage() {


    return (
        <div style={{ padding: 24 }}>
            <CustomerProvider>
                <Header />
                <ListUser />
                <CreateUser />
            </CustomerProvider>
        </div>

    );
}