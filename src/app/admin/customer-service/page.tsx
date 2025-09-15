"use client";

import Reviews from "./components/Reviews";
import { ReviewContextProvider } from "./provider/review-provider";


export default function CustomerServicePage() {
    return (
        <ReviewContextProvider>
            <div style={{ padding: 24 }}>
                <Reviews />
            </div>
        </ReviewContextProvider>
    );
}