
import { useCustomerData } from "../hooks/useCustomerData";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/Error";
import PeopleInfor from "@/components/people/PeopleInfor";
import { PeopleInfoType } from "@/type/user/people-info";

export function CustomerInfo({ customerId }: { customerId: string }) {

    const { customer, loading, refetch } = useCustomerData(customerId);


    if (loading) {
        return <Loading />;
    }

    if (!customer) {
        return <ErrorMessage message="Không tìm thấy thông tin khách hàng" />;
    }
    return (
        <>
            {/* User Info Sidebar: 30% */}
            <PeopleInfor userInfor={{
                ...customer?.userId,
                code: customer?.code || '',
                referralCode: customer?.referralCode || '',
            } as PeopleInfoType} refetch={refetch} />
        </>
    );
}
