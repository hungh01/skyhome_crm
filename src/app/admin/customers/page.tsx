'use client';
import { Button, Card, Spin, Alert, message } from "antd";
import { useState, useEffect } from "react";
import CreateUser from "./components/CreateUser";
import ListUser from "./components/ListUser";
import { userListApi, UserListResponse } from "@/api/user-management/userlist";
import { mockUsers } from "@/api/mock-userlist";
import { User } from "@/type/user";

export default function CustomersPage() {
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUsingMockData, setIsUsingMockData] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response: UserListResponse = await userListApi();
            
            if (response.success && response.data) {
                setUsers(response.data);
                setIsUsingMockData(false);
            } else {
                throw new Error(response.message || 'API response indicates failure');
            }
        } catch (err) {
            console.error('Error fetching users from API:', err);
            setError('Failed to fetch users from API. Using mock data instead.');
            setUsers(mockUsers);
            setIsUsingMockData(true);
            message.warning('Using mock data due to API connection issues');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchUsers();
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '400px' 
                }}>
                    <Spin size="large" />
                </div>
            );
        }

        if (error && !isUsingMockData) {
            return (
                <Alert
                    message="API Connection Error"
                    description={error}
                    type="warning"
                    showIcon
                    action={
                        <button onClick={handleRefresh} style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: '#1890ff', 
                            cursor: 'pointer' 
                        }}>
                            Retry
                        </button>
                    }
                />
            );
        }

        return (
            <div>
                {isUsingMockData && (
                    <Alert
                        message="Using Mock Data"
                        description="The API is currently unavailable. Displaying mock data for demonstration purposes."
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                        action={
                            <button onClick={handleRefresh} style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: '#1890ff', 
                                cursor: 'pointer' 
                            }}>
                                Retry API
                            </button>
                        }
                    />
                )}
                
                <ListUser data={users} />
            </div>
        );
    };

    return (
        <>
            <CreateUser open={open} setOpen={setOpen} />
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

                {renderContent()}
            </div>
        </>
    );
}