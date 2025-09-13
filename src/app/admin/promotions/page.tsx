
import CreatePromotionModal from "./component/CreatePromotionModal";
import Header from "./component/Header";
import PromotionList from "./component/PromotionList";
import { PromotionsProvider } from "./provider/promotions-provider";


export default function PromotionsPage() {
    return (
        <PromotionsProvider>
            <div style={{
                padding: 24,
            }}>
                <Header />
                <PromotionList />
                <CreatePromotionModal />
            </div>
        </PromotionsProvider>
    )
}