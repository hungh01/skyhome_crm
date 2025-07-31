import { Pagination } from "@/type/other/pagination";
import { Collaborator } from "./collaborator";

export interface CollaboratorListResponse {
    data: Collaborator[];
    pagination: Pagination;
}