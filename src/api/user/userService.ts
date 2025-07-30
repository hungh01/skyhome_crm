import { User } from "../../type/user/user";

// API base URL - adjust this to match your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
console.log('API_BASE_URL:', API_BASE_URL);

export interface UserFilters {
  search?: string;
  code?: string;
  createdAt?: string;
  rank?: string;
  address?: string;
  page?: number;
  pageSize?: number;
}

export interface UserListResponse {
  success: boolean;
  data: User[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Backend User structure (what the API actually returns)
export interface BackendUser {
  _id: string;
  phone: string;
  fullName: string;
  status: number;
  role: 'admin' | 'staff' | 'user' | 'ctv';
  address?: string;
  age?: number;
  gender?: number;
  referralCode?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Transform backend user to CRM user format
function transformBackendUserToCRMUser(backendUser: BackendUser): User {
  return {
    id: backendUser._id,
    customerName: backendUser.fullName,
    customerCode: backendUser.referralCode || `KH${backendUser._id.slice(-6)}`,
    age: backendUser.age || 0,
    gender: backendUser.gender === 1 ? 'Male' : backendUser.gender === 2 ? 'Female' : 'Other',
    referralCode: backendUser.referralCode || '',
    phoneNumber: backendUser.phone,
    dateOfBirth: '', // Not available in backend
    cardHolderName: backendUser.fullName, // Use fullName as fallback
    bankName: '', // Not available in backend
    bankAccountNumber: '', // Not available in backend
    address: backendUser.address || '',
    createdAt: backendUser.createdAt,
    image: backendUser.image || '',
    rank: 0 // Default rank, can be extended based on business logic
  };
}

export class UserService {
  private static async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log('Making API request to:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`,
      },
      ...options,
    });

    console.log('API response status:', response.status);
    console.log('API response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async getUsers(filters: UserFilters = {}): Promise<UserListResponse> {
    const queryParams = new URLSearchParams();

    // Add filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/users?${queryParams.toString()}`;

    try {
      const response = await this.makeRequest<{
        success: boolean;
        data: BackendUser[];
        pagination: {
          total: number;
          page: number;
          pageSize: number;
          totalPages: number;
        };
      }>(endpoint);

      // Transform backend users to CRM user format
      const transformedUsers = response.data.map(transformBackendUserToCRMUser);

      return {
        success: response.success,
        data: transformedUsers,
        pagination: response.pagination
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<User> {
    try {
      const response = await this.makeRequest<BackendUser>(`/users/${id}`);
      return transformBackendUserToCRMUser(response);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Mock data fallback in case API is not available
  static getMockUsers(): User[] {
    return [
      {
        id: '1',
        customerName: 'Nguyễn Văn A',
        customerCode: 'KH001',
        age: 28,
        gender: 'Male',
        referralCode: 'GT123',
        phoneNumber: '0901234567',
        dateOfBirth: '1996-01-15',
        cardHolderName: 'Nguyễn Văn A',
        bankName: 'Vietcombank',
        bankAccountNumber: '0123456789',
        address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
        createdAt: '2025-07-01',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
        rank: 0,
      },
      {
        id: '2',
        customerName: 'Trần Thị B',
        customerCode: 'KH002',
        age: 32,
        gender: 'Female',
        referralCode: 'GT456',
        phoneNumber: '0912345678',
        dateOfBirth: '1992-03-22',
        cardHolderName: 'Trần Thị B',
        bankName: 'Techcombank',
        bankAccountNumber: '9876543210',
        address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
        createdAt: '2025-07-02',
        image: 'https://randomuser.me/api/portraits/women/2.jpg',
        rank: 1,
      },
    ];
  }
} 