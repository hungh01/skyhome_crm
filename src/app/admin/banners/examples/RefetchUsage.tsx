// Example usage of the refetch functionality

import { useBannerActions } from '../hooks/useBannerActions';
import { useBannerContext } from '../provider/banner-provider';

export function BannerCreateForm() {
    const { handleSaveBanner, loading } = useBannerActions();
    const { editingBanner, handleCloseModal } = useBannerContext();

    const onSubmit = async (formData: any) => {
        await handleSaveBanner(formData);
        // After successful save, the list will automatically refetch
    };

    return (
        <div>
            {/* Your form here */}
            {/* When form is submitted, it will automatically refetch the banner list */}
        </div>
    );
}

// Example usage for manual refetch
export function RefreshButton() {
    const { refetch } = useBannerContext();

    const handleRefresh = () => {
        if (refetch) {
            refetch();
        }
    };

    return (
        <button onClick={handleRefresh}>
            Refresh Banner List
        </button>
    );
}