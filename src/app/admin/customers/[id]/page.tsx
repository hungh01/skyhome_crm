'use client';

import { useParams } from 'next/navigation';

import './styles/customer-detail.scss';
import Navbar from './components/navbar';
import { TabContentRenderer } from './components/tab-content';
import { CustomerInfo } from './components/customer-infor';


export default function CustomerDetailPage() {
    const params = useParams();
    const customerId = params.id as string;

    return (
        <div className="main-container">
            {/* Main Content: 70% */}
            <div className="content-section">
                {/* Tab Navigation */}
                <Navbar />

                {/* Tab Content */}
                <div className='tab-content'>
                    <TabContentRenderer customerId={customerId} />
                </div>
            </div>

            {/* User Info Sidebar: 30% */}
            <div className="sidebar-section">
                <CustomerInfo customerId={customerId} />
            </div>
        </div>
    );
}


