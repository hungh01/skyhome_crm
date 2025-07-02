
interface UserOrderProps {
    userId: string;
}

export default function LikeOrUlikeOfUser({ userId }: UserOrderProps) {

    return (
        <div style={{ padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 0 40px rgba(0,0,0,0.07)' }}>
            <h2>Like/Unlike of user</h2>
            <p>No found for this user.</p>
        </div>
    );
}