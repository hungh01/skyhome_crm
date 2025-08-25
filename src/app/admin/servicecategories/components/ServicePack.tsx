import { Service } from "@/type/services/services";
import { Card, Typography, Button, Tooltip, Space, Modal } from "antd";
import { Image } from "antd";
import { EditOutlined, EyeOutlined, EyeInvisibleOutlined, DeleteOutlined, UndoOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Title } = Typography;

interface ServicePackProps {
    servicePack: Service;
    onEdit?: () => void;
    onToggleActive?: (serviceId: string, isActive: boolean) => void;
    onToggleDeleted?: (serviceId: string, isDeleted: boolean) => void;
}

export default function ServicePackComponent({
    servicePack,
    onEdit,
    onToggleActive,
    onToggleDeleted
}: ServicePackProps) {
    const [isActiveModalVisible, setIsActiveModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const handleActiveConfirm = () => {
        onToggleActive?.(servicePack._id, !servicePack.isActive);
        setIsActiveModalVisible(false);
    };

    const handleDeleteConfirm = () => {
        onToggleDeleted?.(servicePack._id, !servicePack.isDeleted);
        setIsDeleteModalVisible(false);
    };

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
                    {servicePack.name}
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

                {/* Service description */}
                <Title level={5} style={{
                    margin: '8px 0',
                    color: '#333',
                    fontSize: '16px',
                    fontWeight: 600
                }}>
                    {servicePack.description || 'Không có mô tả'}
                </Title>

                {/* number of people */}
                <div style={{
                    margin: '8px 0',
                    color: '#666',
                    fontSize: '12px'
                }}>
                    {servicePack.numberOfCollaborators || 1} CTV
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

                {/* Action buttons */}
                <Space direction="horizontal" size="small" style={{ marginTop: '12px' }}>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="default"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={onEdit}
                        />
                    </Tooltip>

                    <Tooltip title={servicePack.isActive ? "Ẩn dịch vụ" : "Hiện dịch vụ"}>
                        <Button
                            type={servicePack.isActive ? "default" : "dashed"}
                            size="small"
                            icon={servicePack.isActive ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            onClick={() => setIsActiveModalVisible(true)}
                            style={{
                                color: servicePack.isActive ? '#ff4d4f' : '#52c41a',
                                borderColor: servicePack.isActive ? '#ff4d4f' : '#52c41a'
                            }}
                        />
                    </Tooltip>

                    <Tooltip title={servicePack.isDeleted ? "Khôi phục" : "Xóa"}>
                        <Button
                            type={servicePack.isDeleted ? "primary" : "default"}
                            size="small"
                            icon={servicePack.isDeleted ? <UndoOutlined /> : <DeleteOutlined />}
                            onClick={() => setIsDeleteModalVisible(true)}
                            danger={!servicePack.isDeleted}
                            style={servicePack.isDeleted ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : {}}
                        />
                    </Tooltip>
                </Space>
            </div>

            {/* CSS Animation for air flow */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); opacity: 0.7; }
                    50% { transform: translateY(-5px); opacity: 1; }
                }
            `}</style>

            {/* Active Status Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                        Xác nhận thay đổi trạng thái
                    </div>
                }
                open={isActiveModalVisible}
                onOk={handleActiveConfirm}
                onCancel={() => setIsActiveModalVisible(false)}
                okText="Xác nhận"
                cancelText="Hủy"
                centered
            >
                <p>
                    Bạn có chắc chắn muốn <strong>{servicePack.isActive ? 'ẩn' : 'hiện'}</strong> dịch vụ{' '}
                    <strong>&quot;{servicePack.name}&quot;</strong> không?
                </p>
                {servicePack.isActive && (
                    <p style={{ color: '#ff4d4f', fontSize: '14px' }}>
                        ⚠️ Dịch vụ sẽ được ẩn khỏi danh sách hiển thị cho khách hàng.
                    </p>
                )}
            </Modal>

            {/* Delete Status Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                        {servicePack.isDeleted ? 'Xác nhận khôi phục' : 'Xác nhận xóa'}
                    </div>
                }
                open={isDeleteModalVisible}
                onOk={handleDeleteConfirm}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText="Xác nhận"
                cancelText="Hủy"
                centered
                okButtonProps={{
                    danger: !servicePack.isDeleted,
                    type: servicePack.isDeleted ? 'primary' : 'primary'
                }}
            >
                <p>
                    Bạn có chắc chắn muốn <strong>{servicePack.isDeleted ? 'khôi phục' : 'xóa'}</strong> dịch vụ{' '}
                    <strong>&quot;{servicePack.name}&quot;</strong> không?
                </p>
                {!servicePack.isDeleted && (
                    <p style={{ color: '#ff4d4f', fontSize: '14px' }}>
                        ⚠️ Dịch vụ sẽ bị xóa và không thể khôi phục được.
                    </p>
                )}
                {servicePack.isDeleted && (
                    <p style={{ color: '#52c41a', fontSize: '14px' }}>
                        ✅ Dịch vụ sẽ được khôi phục và hiển thị trở lại.
                    </p>
                )}
            </Modal>
        </Card>
    );
}