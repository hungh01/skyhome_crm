'use client';
import { Area } from "@/type/area/area";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { ServiceCategory } from "@/type/services/service-category";
import { Group } from "@/type/user/collaborator/group";
import { debounce, set } from "lodash";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";



interface GroupCollaboratorProviderType {
    data: DetailResponse<Group[]> | undefined;
    setData: (data: DetailResponse<Group[]>) => void;

    openCreateGroupModal: boolean;
    setOpenCreateGroupModal: (open: boolean) => void;


    editingGroup: Group | undefined;
    setEditingGroup: (group: Group | undefined) => void;

    searchName: string;
    setSearchName: (name: string) => void;
    debouncedSearchName: string;
    setDebouncedSearchName: (name: string) => void;

    selectedServices: string[];
    setSelectedServices: (services: string[]) => void;
    selectedAreas: string[];
    setSelectedAreas: (areas: string[]) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    page: number;
    setPage: (page: number) => void;

    handleEditGroup: (group: Group) => void;
    handleCloseEditModal: () => void;

    openAcceptModal: boolean;
    setOpenAcceptModal: (open: boolean) => void;
    message: string;
    setMessage: (message: string) => void;
    partnerIdToDelete: string | undefined;
    setPartnerIdToDelete: (partnerId: string | undefined) => void;
    currentGroupId: string | undefined;
    setCurrentGroupId: (groupId: string | undefined) => void;

    services: ServiceCategory[];
    setServices: (services: ServiceCategory[]) => void;
    areas: Area[];
    setAreas: (areas: Area[]) => void;

    // Modals for add member, delete member/group, update status
    addMemberModalOpen: boolean;
    setAddMemberModalOpen: (open: boolean) => void;
    selectedGroup: Group | null;
    setSelectedGroup: (group: Group | null) => void;
    actionType: 'delete-member' | 'delete-group' | 'update-status' | null;
    setActionType: (actionType: 'delete-member' | 'delete-group' | 'update-status' | null) => void;
    statusToUpdate: string | null;
    setStatusToUpdate: (status: string | null) => void;

    //

    handleOpenAcceptModal: (message: string, partnerId: string) => void;
    handleCloseAcceptModal: () => void;

    handleOpenAddMemberModal: (group: Group) => void;
    handleCloseAddMemberModal: () => void;

    handleOpenDeleteModal: (groupId: string) => void;
    handleCloseDeleteModal: () => void;

    handleOpenUpdateStatusModal: (groupId: string, status: string) => void;
    handleCloseUpdateStatusModal: () => void;
}

const GroupCollaboratorContext = createContext<GroupCollaboratorProviderType | undefined>(undefined);


export function CollaboratorGroupProvider({ children }: { children: ReactNode }) {

    const [data, setData] = useState<DetailResponse<Group[]>>();
    const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false);

    const [editingGroup, setEditingGroup] = useState<Group | undefined>();

    //filter group list
    const [searchName, setSearchName] = useState("");
    const [debouncedSearchName, setDebouncedSearchName] = useState("");
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);


    const [openAcceptModal, setOpenAcceptModal] = useState(false);
    const [message, setMessage] = useState("");
    const [partnerIdToDelete, setPartnerIdToDelete] = useState<string>();
    const [currentGroupId, setCurrentGroupId] = useState<string>();

    // Add member modal states
    const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [actionType, setActionType] = useState<'delete-member' | 'delete-group' | 'update-status' | null>(null);
    const [statusToUpdate, setStatusToUpdate] = useState<string | null>(null);

    const [services, setServices] = useState<ServiceCategory[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);


    // Debounced search effect
    const debouncedSearchCustomerName = useCallback(
        debounce((value: string) => {
            setDebouncedSearchName(value);
            setPage(1);
        }, 500),
        []
    );

    useEffect(() => {
        if (debouncedSearchName !== searchName) {
            debouncedSearchCustomerName(searchName);
        }
    }, [searchName]);

    const handleEditGroup = (group: Group) => {
        setEditingGroup(group);
        setOpenCreateGroupModal(true);
    };


    const handleCloseEditModal = () => {
        setOpenCreateGroupModal(false);
        setEditingGroup(undefined);
    };



    const values = {
        data,
        setData,
        openCreateGroupModal,
        setOpenCreateGroupModal,
        editingGroup,
        setEditingGroup,
        searchName,
        setSearchName,
        debouncedSearchName,
        setDebouncedSearchName,
        selectedServices,
        setSelectedServices,
        selectedAreas,
        setSelectedAreas,
        statusFilter,
        setStatusFilter,
        page,
        setPage,
        handleEditGroup,
        handleCloseEditModal,

        openAcceptModal,
        setOpenAcceptModal,
        message,
        setMessage,
        partnerIdToDelete,
        setPartnerIdToDelete,
        currentGroupId,
        setCurrentGroupId,

        services,
        setServices,
        areas,
        setAreas,

        addMemberModalOpen,
        setAddMemberModalOpen,
        selectedGroup,
        setSelectedGroup,
        actionType,
        setActionType,
        statusToUpdate,
        setStatusToUpdate,

        handleOpenAcceptModal: (message: string, partnerId: string) => {
            setMessage(message);
            setPartnerIdToDelete(partnerId);
            setOpenAcceptModal(true);
        },

        handleCloseAcceptModal: () => {
            setOpenAcceptModal(false);
            setMessage("");
            setPartnerIdToDelete(undefined);
            setCurrentGroupId(undefined);
        },

        handleOpenAddMemberModal: (group: Group) => {
            setSelectedGroup(group);
            setAddMemberModalOpen(true);
        },
        handleCloseAddMemberModal: () => {
            setSelectedGroup(null);
            setAddMemberModalOpen(false);
        },

        handleOpenDeleteModal: (groupId: string) => {
            setCurrentGroupId(groupId);
            setActionType('delete-group');
            setOpenAcceptModal(true);
            setMessage("Bạn có chắc chắn muốn xoá nhóm cộng tác viên này?");
        },
        handleCloseDeleteModal: () => {
            setMessage("");
            setPartnerIdToDelete(undefined);
            setCurrentGroupId(undefined);
            setActionType(null);
            setStatusToUpdate(null);
            setOpenAcceptModal(false);
        },

        handleOpenUpdateStatusModal: (groupId: string, status: string) => {
            setCurrentGroupId(groupId);
            setStatusToUpdate(status);
            setActionType('update-status');
            setOpenAcceptModal(true);
            setMessage(`Bạn có chắc chắn muốn cập nhật trạng thái nhóm cộng tác viên này thành "${status}"?`);
        },
        handleCloseUpdateStatusModal: () => {
            setCurrentGroupId(undefined);
            setStatusToUpdate(null);
            setActionType(null);
            setOpenAcceptModal(false);
            setMessage("");
        },

    };
    return (
        <GroupCollaboratorContext.Provider value={values}>
            {children}
        </GroupCollaboratorContext.Provider>
    );
}

export function useGroupCollaboratorContext() {
    const context = useContext(GroupCollaboratorContext);
    if (context === undefined) {
        throw new Error("useGroupCollaboratorContext must be used within a GroupCollaboratorProvider");
    }
    return context;
}
