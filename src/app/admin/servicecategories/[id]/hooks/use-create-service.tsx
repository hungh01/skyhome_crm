import { useState } from "react";



export const useCreateService = () => {
    const [loading, setLoading] = useState(false);
    const createService = async () => {
        setLoading(true);
        try {
            // Call your API to create the service here
            // await apiCreateService(values);
        } catch (error) {
            console.error("Error creating service:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        createService,
    };
}