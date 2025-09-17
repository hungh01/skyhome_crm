import { Spin } from "antd";

export default function Loading() {
    return (
        <div className="loading-container">
            <Spin size="large" />
        </div>
    );
}