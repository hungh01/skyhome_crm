import { Order } from "@/type/order/order";
import { stat } from "@/type/review/review";
import { createContext, ReactNode, useContext, useState } from "react";


interface ReviewProviderType {
    page: number;
    setPage: (page: number) => void;
    selectedRating: number | null;
    setSelectedRating: (rating: number | null) => void;

    reviews: Order[];
    setReviews: (reviews: Order[]) => void;
    stats: stat[];
    setStats: (stats: stat[]) => void;
}

const ReviewProvider = createContext<ReviewProviderType | undefined>(undefined);


export function ReviewContextProvider({ children }: { children: ReactNode }) {
    const [reviews, setReviews] = useState<Order[]>([]);
    const [stats, setStats] = useState<stat[]>([]);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [page, setPage] = useState(1);

    return (
        <ReviewProvider.Provider
            value={{ reviews, setReviews, stats, setStats, selectedRating, setSelectedRating, page, setPage }}
        >
            {children}
        </ReviewProvider.Provider>
    );
}

export function useReviewContext() {
    const context = useContext(ReviewProvider);
    if (!context) {
        throw new Error("useReviewContext must be used within a ReviewProvider");
    }
    return context;
}