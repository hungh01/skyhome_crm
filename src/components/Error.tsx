export default function ErrorMessage({ message }: { message: string }) {
    return (
        <div className="error-message">
            <div>{message}</div>
        </div>
    );
}
