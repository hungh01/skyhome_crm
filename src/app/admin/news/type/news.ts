
enum NewsCategory {
    NEWS = 'Tin tức',
    PROMOTION = 'Khuyến mãi',
    SERVICE = 'Dịch vụ',
    GUIDE = 'Hướng dẫn',
    ABOUT = 'Giới thiệu',
    FAQ = 'Câu hỏi thường gặp',
}

export enum NewsStatus {
    ACTIVE = 'Hoạt động',
    INACTIVE = 'Không hoạt động',
    DRAFT = 'Bản nháp',
    PUBLISHED = 'Đã xuất bản',
}

export interface News {
    _id: number;
    title: string;
    shortDescription: string;
    content: string;
    category: NewsCategory;
    position: number;
    imageUrl: string | File;
    publishedAt: Date;
    author: string;
    status: NewsStatus;
    createdAt?: string;
}

export type NewsRequest = Partial<News>;
