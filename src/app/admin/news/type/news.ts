
enum NewsCategory {
    NEWS = 'Tin tức',
    PROMOTION = 'Khuyến mãi',
    SERVICE = 'Dịch vụ',
    GUIDE = 'Hướng dẫn',
    ABOUT = 'Giới thiệu',
    FAQ = 'Câu hỏi thường gặp',
}

export interface News {
    _id: number;
    title: string;
    shortDescription: string;
    content: string;
    category: NewsCategory;
    position: number;
    imageUrl: string;
    publishedAt: Date;
    author: string;
    status: boolean;
    createdAt?: string;
}

export type NewsRequest = Partial<News>;
