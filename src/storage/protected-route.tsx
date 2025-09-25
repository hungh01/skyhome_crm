'use client';

import Loading from '@/components/Loading';
import { useMe } from '@/hooks/useMe';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useMe();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/login');
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return <Loading />;
    }
    if (!isLoading && !user) {
        return null;
    }

    return <>{children}</>;
}
