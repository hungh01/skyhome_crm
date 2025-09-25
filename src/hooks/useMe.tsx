'use client';


import { getMe } from "@/api/auth/auth-api";
import { useAuth } from "@/storage/auth-context";
import { isDetailResponse } from "@/utils/response-handler";
import { useCallback, useEffect } from "react";

export const useMe = () => {

    const { isLoading, setIsLoading, user, setUser, setIsAuth } = useAuth();
    const fetchMe = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getMe();
            if (isDetailResponse(response)) {
                setUser(response.data);
                setIsAuth(true);
            } else {
                setUser(null);
                setIsAuth(false);
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
            setUser(null);
            setIsAuth(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refetch = useCallback(() => {
        fetchMe();
    }, [fetchMe]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return {
        user,
        isLoading,
    };
};
