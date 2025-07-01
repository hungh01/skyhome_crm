'use client';
import { useParams } from 'next/navigation';

export default function UserDetailPage() {

    const params = useParams();
    const id = params.id;

    return <div>User ID: {id}</div>;

}