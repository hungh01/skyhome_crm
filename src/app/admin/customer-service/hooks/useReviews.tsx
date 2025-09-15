import { useCallback, useEffect, useState } from "react";
import { getReviews, getReviewStats } from "../api/review-api";

import { stat } from "@/type/review/review";
import { Order } from "@/type/order/order";
import { useReviewContext } from "../provider/review-provider";





export function useReviews() {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<stat[]>([]);
    const [reviews, setReviews] = useState<Order[]>([]);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 0 });

    const { page, selectedRating } = useReviewContext();

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true);
            const [statsResponse, reviewsResponse] = await Promise.all([
                getReviewStats(),
                getReviews(page, 10, selectedRating || undefined),
            ]);
            if ('data' in statsResponse) {
                setStats(statsResponse.data);
            }
            if ('data' in reviewsResponse) {
                setReviews(reviewsResponse.data);
                setPagination(
                    reviewsResponse.pagination || { page: 1, pageSize: 10, total: 0, totalPages: 0 }
                );
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    }, [setReviews, setStats, selectedRating]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    return {
        stats,
        pagination,
        reviews,
        loading,
    };

}

