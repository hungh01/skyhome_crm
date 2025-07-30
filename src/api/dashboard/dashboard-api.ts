import { CustomerListResponse } from "@/type/user/customer/customer-list-respone";
import { fetcher } from "../fetcher-api";
import { BACKEND_URL } from "@/common/api";
import { ListOrderDashboard } from "@/type/dashboard/listOrderDashboard";
import { ViewState } from "@/type/other/viewState";
import { TopCTV } from "@/type/dashboard/topCTV";
import { Revenue } from "@/type/dashboard/revenue";
import { ServiceOrder } from "@/type/dashboard/serviceOrder";
import { DashboardUser } from "@/type/dashboard/dasboardUser";

export const totalUserApi = () => {
    return fetcher<{ totalCustomer: number }>(`${BACKEND_URL}/users/total`);
};

export const totalPartnerApi = () => {
    return fetcher<{ totalPartner: number }>(`${BACKEND_URL}/ctv/total`);
};

export const totalOrdersApi = () => {
    return fetcher<{ totalOrder: number }>(`${BACKEND_URL}/order/total`);
};

export const totalRevenueApi = () => {
    return fetcher<{ totalRevenue: number }>(`${BACKEND_URL}/order/revenue/total`);
};

export const revenueDashboardApi = (type: ViewState) => {
    return fetcher<Revenue[]>(`${BACKEND_URL}/order/revenue?type=${type}`);
};

export const recentOrdersApi = () => {
    return fetcher<ListOrderDashboard[]>(`${BACKEND_URL}/order/recent`);
};

export const topCTVApi = (type: ViewState) => {
    return fetcher<TopCTV[]>(`${BACKEND_URL}/ctv/top?type=${type}`);
}

export const serviceDashboardApi = (type: ViewState) => {
    return fetcher<ServiceOrder[]>(`${BACKEND_URL}/order/count-by-category?type=${type}`);
}

export const userDashboardApi = (type: ViewState) => {
    return fetcher<DashboardUser[]>(`${BACKEND_URL}/order/user-type-count?type=${type}`);
};
