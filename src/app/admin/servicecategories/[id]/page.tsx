'use client';

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Card,
    Button,
    Typography,
    Row,
    Col,
} from "antd";
import {
    ToolOutlined,
    ArrowLeftOutlined,
    PlusOutlined
} from "@ant-design/icons";
import { Service, ServiceRequest } from "@/type/services/services";

import ServicePackComponent from "../components/ServicePack";
import OptionalServiceComponent from "../components/OptionalService";
import { getServicesByCategoryId, createService, updateService } from "@/api/service/service-api";
import { isDetailResponse } from "@/utils/response-handler";
import AddServicePackModal from "../components/AddServicePackModal";
import { notify } from "@/components/Notification";

const { Title, Text } = Typography;

export default function DetailServiceCategory() {
    const params = useParams();
    const router = useRouter();
    const serviceCategoryId = params.id as string;

    // State management
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    console.log('selectedService:', selectedService);
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const response = await getServicesByCategoryId(serviceCategoryId);
                if (isDetailResponse(response)) {
                    setServices(response.data);
                    // Auto select first service if exists
                    if (response.data.length > 0) {
                        setSelectedService(response.data[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [serviceCategoryId]);

    const handleServiceClick = (service: Service) => {
        setSelectedService(service);
    };

    const handleEditService = (service: Service) => {
        setEditingService(service);
        setIsAddModalVisible(true);
    };

    const handleAddServicePack = async (newServicePack: Service) => {
        try {
            if (editingService) {
                // Update existing service using API
                const updateData: Partial<Service> = {
                    name: newServicePack.name,
                    description: newServicePack.description || '',
                    thumbnail: newServicePack.thumbnail || '',
                    price: newServicePack.price || 0,
                    durationMinutes: newServicePack.durationMinutes || 60,
                    numberOfCollaborators: newServicePack.numberOfCollaborators || 1,
                };

                const response = await updateService(editingService._id, updateData);

                if (isDetailResponse(response)) {
                    const updatedService = response.data;

                    setServices(prev => prev.map(s =>
                        s._id === editingService._id ? updatedService : s
                    ));

                    if (selectedService?._id === editingService._id) {
                        setSelectedService(updatedService);
                    }

                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Cập nhật dịch vụ thành công!',
                    });
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Có lỗi xảy ra khi cập nhật dịch vụ!',
                    });
                }

                setEditingService(null);
            } else {
                // Create new service using API
                const createData: Partial<ServiceRequest> = {
                    name: newServicePack.name,
                    description: newServicePack.description || '',
                    thumbnail: newServicePack.thumbnail || '',
                    numberOfCollaborators: newServicePack.numberOfCollaborators || 1,
                    durationMinutes: newServicePack.durationMinutes || 60,
                    price: newServicePack.price || 0,
                    status: true,
                    serviceCategory: serviceCategoryId,
                };

                const response = await createService(createData);

                if (isDetailResponse(response)) {
                    const newService = response.data;

                    setServices(prev => [...prev, newService]);
                    setSelectedService(newService);

                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Tạo dịch vụ thành công!',
                    });
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Có lỗi xảy ra khi tạo dịch vụ!',
                    });
                }
            }
        } catch (error) {
            console.error('Error saving service:', error);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: `Có lỗi xảy ra khi ${editingService ? 'cập nhật' : 'tạo'} dịch vụ!`,
            });
        }

        setIsAddModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsAddModalVisible(false);
        setEditingService(null);
    };

    const updateSelectedService = (updateFn: (service: Service) => Service) => {
        if (!selectedService) return;

        setServices(prev => prev.map(s =>
            s._id === selectedService._id
                ? updateFn(s)
                : s
        ));
        const updatedService = updateFn(selectedService);
        setSelectedService(updatedService);
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
            <Row gutter={24}>
                <Col span={24}>
                    <Card style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div>
                                    <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                                        <ToolOutlined /> Chi tiết danh mục dịch vụ
                                    </Title>
                                </div>
                            </div>
                            <Text type="secondary">
                                Quản lý thông tin chi tiết và thiết bị của dịch vụ
                            </Text>
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginTop: '16px' }}>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.back()}
                            >
                                Quay lại
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>

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
                        {/* Equipment Management */}
                        {/* <Col xs={24} lg={12}>
                            <EquipmentCommponent
                                equipment={selectedService.equipments || []}
                                setServiceData={updateSelectedService}
                            />
                        </Col> */}
                        {/* Optional Services Management */}
                        <Col xs={24} lg={24}>
                            <OptionalServiceComponent
                                optionalServices={selectedService.optionalServices || []}
                                setServiceData={updateSelectedService}
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
            <AddServicePackModal
                visible={isAddModalVisible}
                onCancel={handleModalCancel}
                onSuccess={handleAddServicePack}
                serviceToEdit={editingService}
            />
        </div>
    );
}
