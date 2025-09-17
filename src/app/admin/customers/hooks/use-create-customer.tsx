import { createCustomerApi } from "@/api/user/customer-api";
import { notify } from "@/components/Notification";
import { User } from "@/type/user/user";
import { useState } from "react";
import { useCustomerList } from "./use-customer-list";


export function useCreateCustomer(handleResetForm: () => void) {

    const [loading, setLoading] = useState(false);
    const { refetch } = useCustomerList();

    const handleFinish = async (values: User) => {
        try {
            setLoading(true);
            const userData = await createCustomerApi(values);
            if (userData && 'data' in userData) {
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Thêm khách hàng thành công!',
                });
                refetch();
            } else {
                notify({
                    type: 'error',
                    message: 'Thông báo',
                    description: (userData && 'message' in userData ? userData.message : 'Có lỗi xảy ra khi thêm khách hàng, vui lòng thử lại sau.'),
                });
            }
        } catch (error) {
            console.error("Error creating user:", error);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Thêm khách hàng thất bại, vui lòng thử lại!',
            });
        } finally {
            setLoading(false);
            handleResetForm();
        }
    };
    return { handleFinish, loading };
}