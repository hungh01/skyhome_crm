
import { fetcher } from "../fetcher-api";
import { BACKEND_URL } from "@/common/api";
import { ListOrderDashboard } from "@/type/dashboard/listOrderDashboard";
import { ViewState } from "@/type/other/viewState";
import { TopCTV } from "@/type/dashboard/topCTV";
import { Revenue } from "@/type/dashboard/revenue";
import { ServiceOrder } from "@/type/dashboard/serviceOrder";
import { DashboardUser } from "@/type/dashboard/dasboardUser";
import { ErrorResponse } from "@/type/error";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { Order } from "@/type/order/order";

// Fetch total counts for various entities
// Total counts for users, collaborators, orders, and revenue

// Fetch total users
export const totalUserApi = () => {
    return fetcher<DetailResponse<{ totalCustomer: number }> | ErrorResponse>(`${BACKEND_URL}/customer_manager/total-customer`);
};
// Fetch total collaborators
export const totalCollaboratorApi = () => {
    return fetcher<DetailResponse<{ totalCollaborator: number }> | ErrorResponse>(`${BACKEND_URL}/collaborator_manager/total-collaborator`);
};

// Fetch total orders
export const totalOrdersApi = () => {
    return fetcher<DetailResponse<{ totalOrder: number }> | ErrorResponse>(`${BACKEND_URL}/order_manager/total`);
};

// Fetch total revenue
export const totalRevenueApi = () => {
    return fetcher<DetailResponse<{ totalRevenue: number }> | ErrorResponse>(`${BACKEND_URL}/order_manager/revenue/total`);
};

// Fetch dashboard data for various views
export const revenueDashboardApi = (type: ViewState) => {
    return fetcher<DetailResponse<Revenue[]> | ErrorResponse>(`${BACKEND_URL}/order_manager/revenue?type=${type}`);
};

// Fetch recent orders for the dashboard
export const recentOrdersApi = () => {
    return fetcher<DetailResponse<Order[]> | ErrorResponse>(`${BACKEND_URL}/order_manager/recent`);
};


export const topCTVApi = (type: ViewState) => {
    return fetcher<DetailResponse<TopCTV[]> | ErrorResponse>(`${BACKEND_URL}/order_manager/top3-collaborators?type=${type}`);
}

// Fetch service orders for the dashboard
export const serviceDashboardApi = (type: ViewState) => {
    return fetcher<DetailResponse<ServiceOrder[]> | ErrorResponse>(`${BACKEND_URL}/order_manager/count-by-category?type=${type}`);
}

// Fetch user dashboard data based on type
export const userDashboardApi = (type: ViewState) => {
    return fetcher<DetailResponse<DashboardUser[]> | ErrorResponse>(`${BACKEND_URL}/customer_manager/new-old-stats?type=${type}`);
};
