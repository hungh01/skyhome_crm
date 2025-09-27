'use client';

import { useParams } from "next/navigation";
import { useState } from "react";
import {
    Button,
    Typography,
    Row,
    Col,
} from "antd";
import {

    PlusOutlined
} from "@ant-design/icons";
import { Service } from "@/type/services/services";

import ServicePackComponent from "./components/service-list/ServicePack";
import OptionalServiceComponent from "./components/optional-services/OptionalService";
import { updateService } from "@/api/service/service-api";
import { isDetailResponse } from "@/utils/response-handler";
import { notify } from "@/components/Notification";
import { useGetServiceList } from "./hooks/use-service-list";
import { useServiceContext } from "./providers/service-provider";
import Header from "./components/header";
import AddServiceModal from "./components/service-list/add-service";

const { Title, Text } = Typography;

export default function DetailServiceCategory() {
    const params = useParams();

    const serviceCategoryId = params.id as string;

    const { loading, services, selectedService, refetch } = useGetServiceList(serviceCategoryId);
    const { setSelectedService } = useServiceContext();
    // State management

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const handleServiceClick = (service: Service) => {
        setSelectedService(service);
    };

    const handleEditService = (service: Service) => {
        setEditingService(service);
        setIsAddModalVisible(true);
    };

    const handleAddServicePack = async () => {
        await refetch();
        setIsAddModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsAddModalVisible(false);
        setEditingService(null);
    };

    const handleToggleActive = async (serviceId: string, isActive: boolean) => {
        try {
            const response = await updateService(serviceId, { isActive });

            if (isDetailResponse(response)) {
                await refetch();
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: `${isActive ? 'Hiện' : 'Ẩn'} dịch vụ thành công!`,
                });
            } else {
                notify({
                    type: 'error',
                    message: 'Thông báo',
                    description: 'Có lỗi xảy ra khi cập nhật trạng thái dịch vụ!',
                });
            }
        } catch (error) {
            console.error('Error toggling active status:', error);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra khi cập nhật trạng thái dịch vụ!',
            });
        }
    };

    const handleToggleDeleted = async (serviceId: string, isDeleted: boolean) => {
        try {
            const response = await updateService(serviceId, { isDeleted });

            if (isDetailResponse(response)) {
                await refetch();
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: `${isDeleted ? 'Xóa' : 'Khôi phục'} dịch vụ thành công!`,
                });
            } else {
                notify({
                    type: 'error',
                    message: 'Thông báo',
                    description: 'Có lỗi xảy ra khi cập nhật trạng thái xóa!',
                });
            }
        } catch (error) {
            console.error('Error toggling deleted status:', error);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra khi cập nhật trạng thái xóa!',
            });
        }
    };

    if (loading) {
        return (
            <div style={{ padding: "24px", textAlign: 'center' }}>
                <Text>Đang tải dữ liệu dịch vụ...</Text>
            </div>
        );
    }

    return (
        <div style={{ padding: "24px", background: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header */}
            <Header />
            {/* Service List */}
            <Row gutter={[24, 24]} justify="center" style={{ marginBottom: '24px' }}>
                {services.map((service) => (
                    <Col key={service._id}>
                        <div
                            onClick={() => handleServiceClick(service)}
                            style={{
                                cursor: 'pointer',
                                border: selectedService?._id === service._id ? '3px solid #1890ff' : '3px solid transparent',
                                borderRadius: '12px',
                                transition: 'all 0.3s ease',
                                transform: selectedService?._id === service._id ? 'scale(1.02)' : 'scale(1)'
                            }}
                        >
                            <ServicePackComponent
                                servicePack={service}
                                onEdit={() => handleEditService(service)}
                                onToggleActive={(serviceId, isActive) => handleToggleActive(serviceId, isActive)}
                                onToggleDeleted={(serviceId, isDeleted) => handleToggleDeleted(serviceId, isDeleted)}
                            />
                        </div>
                    </Col>
                ))}
            </Row>

            {/* Add Service Pack Button */}
            <Row justify="center" style={{ marginBottom: '24px' }}>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddModalVisible(true)}
                        style={{
                            backgroundColor: '#52c41a',
                            borderColor: '#52c41a',
                            fontSize: '16px',
                            height: '40px',
                            padding: '0 24px'
                        }}
                    >
                        Thêm gói dịch vụ
                    </Button>
                </Col>
            </Row>

            {/* Equipment and Optional Services - Only show when service is selected */}
            {selectedService && (
                <>
                    <Row justify="center" style={{ marginBottom: '16px' }}>
                        <Col>
                            <Title level={3} style={{ color: '#1890ff', textAlign: 'center' }}>
                                Chi tiết dịch vụ: {selectedService.name}
                            </Title>
                        </Col>
                    </Row>

                    <Row gutter={24} justify="center">

                        {/* Optional Services Management */}
                        <Col xs={24} lg={24}>
                            <OptionalServiceComponent
                                serviceId={selectedService._id}
                            />
                        </Col>
                    </Row>
                </>
            )}

            {services.length === 0 && !loading && (
                <Row justify="center">
                    <Col>
                        <Text type="secondary" style={{ fontSize: '16px' }}>
                            Chưa có dịch vụ nào trong danh mục này. Hãy thêm dịch vụ mới!
                        </Text>
                    </Col>
                </Row>
            )}

            {/* Add/Edit Service Pack Modal */}
            <AddServiceModal
                visible={isAddModalVisible}
                onCancel={handleModalCancel}
                onSuccess={handleAddServicePack}
                serviceToEdit={editingService}
                serviceCategoryId={serviceCategoryId}

            />
        </div>
    );
}
