'use client';

import { useAuth } from '@/storage/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuth } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuth) {
            router.replace('/login');
        }
    }, [isAuth, router]);


    if (!isAuth) {
        return null;
    }


    return <>{children}</>;
}
