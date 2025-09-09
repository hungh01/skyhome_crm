'use client';

import { Button, Card } from "antd";
import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import CreateUser from "./components/CreateUser";
import ListUser from "./components/ListUser";
import { customerListApi } from "@/api/user/customer-api";
import { PAGE_SIZE } from "@/common/page-size";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { Customer } from "@/type/user/customer/customer";

export default function CustomersPage() {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState<DetailResponse<Customer[]>>();
    const [searchCustomerName, setSearchCustomerName] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [searchCustomerCode, setSearchCustomerCode] = useState("");
    const [searchCreatedAt, setSearchCreatedAt] = useState("");

    const [page, setPage] = useState(1);

    // Internal search states for immediate UI updates
    const [searchCodeInput, setSearchCodeInput] = useState("");
    const [searchAddressInput, setSearchAddressInput] = useState("");
    const [searchCustomerNameInput, setSearchCustomerNameInput] = useState("");


    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await customerListApi(
                page,
                PAGE_SIZE,
                searchCustomerCode,
                searchCreatedAt,
                searchCustomerName,
                searchAddress,
            );
            if ('data' in res) {
                setData(res);
            } else {
                console.error("Failed to fetch customers:", res);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search functions
    const debouncedSearchCode = useCallback(
        debounce((value: string) => {
            setSearchCustomerCode(value);
            setPage(1); // Reset to first page when searching
        }, 500),
        []
    );

    const debouncedSearchAddress = useCallback(
        debounce((value: string) => {
            setSearchAddress(value);
            setPage(1); // Reset to first page when searching
        }, 500),
        []
    );

    const debouncedSearchCustomerName = useCallback(
        debounce((value: string) => {
            setSearchCustomerName(value);
            setPage(1); // Reset to first page when searching
        }, 500),
        []
    );

    // Handle input changes with immediate UI update and debounced API call
    const handleCodeSearch = (value: string) => {
        setSearchCodeInput(value);
        debouncedSearchCode(value);
    };

    const handleAddressSearch = (value: string) => {
        setSearchAddressInput(value);
        debouncedSearchAddress(value);
    };

    const handleCustomerNameSearch = (value: string) => {
        setSearchCustomerNameInput(value);
        debouncedSearchCustomerName(value);
    };

    useEffect(() => {
        fetchCustomers();
    }, [
        page,
        searchCustomerName,
        searchAddress,
        searchCustomerCode,
        searchCreatedAt
    ]);
    return (
        <>
            <CreateUser open={open} setOpen={setOpen} fetchCustomers={fetchCustomers} />
            <div style={{ padding: 24 }}>
                <Card style={{ marginBottom: 16, borderRadius: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <h1 style={{ margin: 0 }}>
                                Quản lý khách hàng
                            </h1>
                            <p style={{ color: 'gray', fontSize: '12px', margin: 0 }}>
                                Quản lý và theo dõi khách hàng trong hệ thống, bao gồm thông tin cá nhân, lịch sử giao dịch và các hoạt động khác.
                            </p>
                        </div>
                        <Button type="primary" onClick={() => setOpen(true)}>+ Thêm khách hàng</Button>
                    </div>
                </Card>
                <ListUser
                    data={data}
                    loading={loading}
                    page={page}
                    setPage={setPage}
                    searchCustomerName={searchCustomerNameInput}
                    setSearchCustomerName={handleCustomerNameSearch}
                    searchAddress={searchAddressInput}
                    setSearchAddress={handleAddressSearch}
                    searchCustomerCode={searchCodeInput}
                    setSearchCustomerCode={handleCodeSearch}
                    searchCreatedAt={searchCreatedAt}
                    setSearchCreatedAt={setSearchCreatedAt}
                />
            </div>
        </>
    );
}