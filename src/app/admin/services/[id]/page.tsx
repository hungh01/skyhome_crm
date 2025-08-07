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
import { mockServices, mockBusinessServices } from "@/api/mock-services";
import { Service } from "@/type/services";
import { ServicePack } from "@/type/services/service-pack";
import ServicePackComponent from "../components/ServicePack";
import EquipmentCommponent from "../components/Equipment";
import OptionalServiceComponent from "../components/OptionalService";
import AddServicePackModal from "../components/AddServicePackModal";

const { Title, Text } = Typography;


export default function DetailServices() {
    const params = useParams();
    const router = useRouter();
    const serviceId = params.id as string;

    // Load service data from mock API
    const [serviceData, setServiceData] = useState<Service | null>(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    useEffect(() => {
        const allServices = [...mockServices, ...mockBusinessServices];
        const foundService = allServices.find(s => s._id === serviceId);
        if (foundService) {
            setServiceData(foundService);
        }
    }, [serviceId]);

    const handleAddServicePack = (newServicePack: ServicePack) => {
        if (!serviceData) return;

        setServiceData(prev => ({
            ...prev!,
            servicePacks: [...prev!.servicePacks, newServicePack]
        }));
    };

    if (!serviceData) {
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{}}>
                                    <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                                        <ToolOutlined /> Chi tiết dịch vụ: {serviceData.name}
                                    </Title>

                                </div>
                            </div>
                            <Text type="secondary">
                                Quản lý thông tin chi tiết và thiết bị của dịch vụ
                            </Text>
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
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
            {/* Service Information */}
            <Row gutter={[24, 24]} justify="center" style={{ marginBottom: '24px' }}>
                {serviceData.servicePacks.map((pack) => (
                    <Col key={pack.id}>
                        <ServicePackComponent servicePack={pack} />
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

            <Row gutter={24} justify="center">
                {/* Equipment Management */}
                <Col xs={24} lg={12}>

                    <EquipmentCommponent equipment={serviceData.equipment} setServiceData={setServiceData} />
                </Col>
                {/* Equipment Management */}
                <Col xs={24} lg={12}>
                    <OptionalServiceComponent optionalServices={serviceData.optionalServices} setServiceData={setServiceData} />
                </Col>
            </Row>

            {/* Add Service Pack Modal */}
            <AddServicePackModal
                visible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                onSuccess={handleAddServicePack}
            />

        </div>
    );
}
