"use client";
import { mockReviews } from "@/api/mock-reviews";
import Reviews from "./components/Reviews";


export default function CustomerServicePage() {
    return (
        <div style={{ padding: 24 }}>
            <Reviews reviews={mockReviews} />
        </div>
    );
}