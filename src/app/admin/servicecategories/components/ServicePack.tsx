import { Service } from "@/type/services/services";
import { Card, Typography, Button } from "antd";
import { Image } from "antd";

const { Title } = Typography;

interface ServicePackProps {
    servicePack: Service;
    onEdit?: () => void;
}

export default function ServicePackComponent({ servicePack, onEdit }: ServicePackProps) {
    return (
        <Card
            style={{
                width: '250px',
                height: 'auto',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #e8e8e8',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: '24px 16px'
            }}
        >

            <div>
                {/* Header with service title */}
                <div style={{
                    backgroundColor: '#fadb14',
                    color: '#333',
                    padding: '8px 0',
                    borderRadius: '8px 8px 0 0',
                    margin: '-20px -14px 14px -14px',
                    fontSize: '14px',
                    fontWeight: 600
                }}>
                    Gói dịch vụ
                </div>

                {/* Service icon and air flow */}
                <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    border: '1px solid #e8e8e8'
                }}>
                    <div style={{ marginBottom: '8px' }}>
                        {servicePack.thumbnail ? (
                            <Image src={servicePack.thumbnail} alt="Service Icon" />
                        ) : (
                            <div style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                margin: '0 auto',
                                color: '#999',
                                fontSize: '12px'
                            }}>
                                Không có ảnh
                            </div>
                        )}
                    </div>
                </div>

                {/* Service name */}
                <Title level={5} style={{
                    margin: '8px 0',
                    color: '#333',
                    fontSize: '16px',
                    fontWeight: 600
                }}>
                    {servicePack.name || 'Tên dịch vụ'}
                </Title>

                {/* number of people */}
                <div style={{
                    margin: '8px 0',
                    color: '#666',
                    fontSize: '14px'
                }}>
                    {servicePack.numberOfCollaborators || 1} CTV
                </div>

                {/* Service description */}
                <div style={{
                    margin: '0px 0',
                    color: '#666',
                    fontSize: '10px'
                }}>
                    {servicePack.description || 'Không có mô tả'}
                </div>


                {/* Service price */}
                <Title level={5} style={{
                    margin: '8px 0',
                    color: '#52c41a',
                    fontSize: '14px',
                    fontWeight: 600
                }}>
                    {servicePack.price?.toLocaleString('vi-VN') || '0'} VNĐ
                </Title>

                {/* Duration */}
                <div style={{
                    margin: '8px 0',
                    color: '#666',
                    fontSize: '14px'
                }}>
                    Thời gian: {servicePack.durationMinutes || 0} phút
                </div>

                {/* Edit button */}
                <Button
                    size="small"
                    onClick={onEdit}
                    style={{ marginTop: '8px' }}
                >
                    Chỉnh sửa
                </Button>
            </div>

            {/* CSS Animation for air flow */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); opacity: 0.7; }
                    50% { transform: translateY(-5px); opacity: 1; }
                }
            `}</style>
        </Card>
    );
}