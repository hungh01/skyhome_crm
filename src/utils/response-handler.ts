import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { ErrorResponse } from "@/type/error";

// Type guard để check xem response có phải là ErrorResponse không
export const isErrorResponse = (response: unknown): response is ErrorResponse => {
    return (
        typeof response === 'object' &&
        response !== null &&
        'error' in response &&
        typeof (response as ErrorResponse).error === 'string'
    );
};

// Type guard để check xem response có phải là DetailResponse không
export const isDetailResponse = <T>(response: unknown): response is DetailResponse<T> => {
    return (
        typeof response === 'object' &&
        response !== null &&
        'data' in response
    );
};

// Helper function để handle response
export const handleApiResponse = <T>(
    response: DetailResponse<T> | ErrorResponse,
    onSuccess: (data: T) => void,
    onError: (error: string) => void
) => {
    if (isErrorResponse(response)) {
        onError(response.error);
    } else if (isDetailResponse<T>(response)) {
        onSuccess(response.data);
    } else {
        onError('Unknown response format');
    }
};
