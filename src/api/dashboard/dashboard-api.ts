
import { fetcher } from "../fetcher-api";
import { BACKEND_URL } from "@/common/api";
import { ListOrderDashboard } from "@/type/dashboard/listOrderDashboard";
import { ViewState } from "@/type/other/viewState";
import { TopCTV } from "@/type/dashboard/topCTV";
import { Revenue } from "@/type/dashboard/revenue";
import { ServiceOrder } from "@/type/dashboard/serviceOrder";
import { DashboardUser } from "@/type/dashboard/dasboardUser";

// Fetch total counts for various entities
// Total counts for users, partners, orders, and revenue

// Fetch total users
export const totalUserApi = () => {
    return fetcher<{ totalCustomer: number }>(`${BACKEND_URL}/user/total`);
};
// Fetch total partners
export const totalPartnerApi = () => {
    return fetcher<{ totalPartner: number }>(`${BACKEND_URL}/ctv/total`);
};

// Fetch total orders
export const totalOrdersApi = () => {
    return fetcher<{ totalOrder: number }>(`${BACKEND_URL}/order/total`);
};

// Fetch total revenue
export const totalRevenueApi = () => {
    return fetcher<{ totalRevenue: number }>(`${BACKEND_URL}/order/revenue/total`);
};

// Fetch dashboard data for various views
export const revenueDashboardApi = (type: ViewState) => {
    return fetcher<Revenue[]>(`${BACKEND_URL}/order/revenue?type=${type}`);
};

// Fetch recent orders for the dashboard
export const recentOrdersApi = () => {
    return fetcher<ListOrderDashboard[]>(`${BACKEND_URL}/order/recent`);
};


export const topCTVApi = (type: ViewState) => {
    return fetcher<TopCTV[]>(`${BACKEND_URL}/ctv/top?type=${type}`);
}

// Fetch service orders for the dashboard
export const serviceDashboardApi = (type: ViewState) => {
    return fetcher<ServiceOrder[]>(`${BACKEND_URL}/order/count-by-category?type=${type}`);
}

// Fetch user dashboard data based on type
export const userDashboardApi = (type: ViewState) => {
    return fetcher<DashboardUser[]>(`${BACKEND_URL}/order/user-type-count?type=${type}`);
};
