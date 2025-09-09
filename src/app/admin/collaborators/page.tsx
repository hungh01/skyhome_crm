'use client';

import { Button, Card, Form } from "antd";
import { useCallback, useEffect, useState } from "react";
import CollaboratorList from "./components/CollaboratorList";
import CreateCollaborator from "./components/CreateCollaborator";
import { collaboratorAreasApi, collaboratorListApi, collaboratorServicesApi, createCollaboratorApi } from "@/api/user/collaborator-api";
import { notify } from "@/components/Notification";
import { Collaborator, CollaboratorFormData } from "@/type/user/collaborator/collaborator";
import { Area } from "@/type/area/area";
import { ServiceCategory } from "@/type/services/service-category";
import { isDetailResponse } from "@/utils/response-handler";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { PAGE_SIZE } from "@/common/page-size";
import { debounce } from "lodash";
import dayjs, { Dayjs } from "dayjs";


export default function CollaboratorsPage() {

    const [open, setOpen] = useState(false);

    const [form] = Form.useForm();

    const [dataFilter, setDataFIlter] = useState<{
        areas: Area[];
        services: ServiceCategory[];
    }>({
        areas: [],
        services: []
    });


    const [data, setData] = useState<DetailResponse<Collaborator[]> | null>(null);



    const [page, setPage] = useState(1);
    const [searchName, setSearchName] = useState("");
    const [debouncedSearchName, setDebouncedSearchName] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchAreas, setSearchAreas] = useState<string[]>([]);
    const [searchActiveDate, setSearchActiveDate] = useState<Dayjs | null>(null);
    const [searchServices, setSearchServices] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState("");

    // Create debounced function using lodash
    const debouncedSetSearchName = useCallback(
        debounce((value: string) => {
            setDebouncedSearchName(value);
            setPage(1); // Reset to first page when search changes
            setIsSearching(false); // End loading when debounce completes
        }, 500), // 500ms delay
        []
    );

    // Handle search name change
    const handleSearchNameChange = useCallback((value: string) => {
        setSearchName(value);
        if (value === "") {
            // If clearing the search, immediately update and stop loading
            setDebouncedSearchName("");
            setIsSearching(false);
            setPage(1);
        } else if (value !== debouncedSearchName) {
            setIsSearching(true); // Start loading when user types
        }
        debouncedSetSearchName(value);
    }, [debouncedSetSearchName, debouncedSearchName]);

    const fetchCollaborators = useCallback(async () => {
        const response = await collaboratorListApi(
            page,
            PAGE_SIZE,
            searchActiveDate ? dayjs(searchActiveDate).format('YYYY-MM-DD') : '',
            debouncedSearchName,
            searchAreas,
            searchServices,
            statusFilter
        );
        if (isDetailResponse(response)) {
            setData(response);
        } else {
            console.error("Failed to fetch collaborators:", response);
        }
    }, [page, searchActiveDate, debouncedSearchName, searchAreas, searchServices, statusFilter]);


    useEffect(() => {
        fetchCollaborators();
    }, [page, debouncedSearchName, searchAreas, searchActiveDate, searchServices, statusFilter]);


    const handleFinish = async (values: CollaboratorFormData) => {
        try {
            const result = await createCollaboratorApi(values);
            if (result && ('data' in result)) {
                setOpen(false);
                form.resetFields();
                fetchCollaborators();
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Tạo cộng tác viên thành công.',
                });
            } else {
                notify({
                    type: 'error',
                    message: 'Thông báo',
                    description: (result && 'message' in result ? result.message : 'Có lỗi xảy ra khi tạo cộng tác viên, vui lòng thử lại sau.'),
                });
            }
        } catch {
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra khi tạo cộng tác viên, vui lòng thử lại sau.',
            });
        }
    };

    useEffect(() => {
        const fetchServicesAndAreas = async () => {
            try {
                const [areasRes, servicesRes] = await Promise.all([
                    collaboratorAreasApi(),
                    collaboratorServicesApi()
                ]);
                setDataFIlter({
                    areas: Array.isArray(areasRes.data) ? areasRes.data : [],
                    services: Array.isArray(servicesRes.data) ? servicesRes.data : []
                });
            } catch (error) {
                console.error("Error fetching services or areas:", error);
                setDataFIlter({
                    areas: [],
                    services: []
                });
            }
        }
        fetchServicesAndAreas();
    }, []);


    return (
        <div style={{ padding: 24 }}>
            <CreateCollaborator form={form} open={open} setOpen={setOpen} handleFinish={handleFinish} areas={dataFilter.areas} services={dataFilter.services} />
            <Card style={{ marginBottom: 16, borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <h1 style={{ margin: 0 }}>
                            Quản lý cộng tác viên
                        </h1>
                        <p style={{ color: 'gray', fontSize: '12px', margin: 0 }}>
                            Quản lý và theo dõi cộng tác viên trong hệ thống, bao gồm thông tin cá nhân, lịch sử giao dịch và các hoạt động khác.
                        </p>
                    </div>
                    <Button type="primary" onClick={() => setOpen(true)}>+ Thêm CTV</Button>
                </div>
            </Card>
            <CollaboratorList
                areas={dataFilter.areas}
                serviceCategories={dataFilter.services}
                data={data}
                setData={setData}
                searchName={searchName}
                handleSearchNameChange={handleSearchNameChange}
                isSearching={isSearching}
                page={page}
                setPage={setPage}
                searchAreas={searchAreas}
                setSearchAreas={setSearchAreas}
                searchActiveDate={searchActiveDate}
                setSearchActiveDate={setSearchActiveDate}
                searchServices={searchServices}
                setSearchServices={setSearchServices}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />
        </div>
    );
}
