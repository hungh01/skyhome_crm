'use client';

import { useAuth } from '@/app/storage/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuth } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuth) {
            router.replace('/login'); // 👈 redirect to login
        }

    }, [isAuth, router]);

    // Prevent flicker: only render children if authenticated
    if (!isAuth) {
        return null; // or loading spinner
    }

    return <>{children}</>;
}
