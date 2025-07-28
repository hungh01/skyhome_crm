import { useState, useEffect, useCallback } from 'react';
import { UserService, UserFilters } from '../api/user/userService';
import { User } from '../type/user';

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    current: number;
    pageSize: number;
    totalPages: number;
  };
  filters: UserFilters;
  fetchUsers: (filters?: UserFilters) => Promise<void>;
  setFilters: (filters: UserFilters) => void;
  refreshUsers: () => Promise<void>;
}

export const useUsers = (initialFilters: UserFilters = {}): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<UserFilters>({
    page: 1,
    pageSize: 10,
    ...initialFilters,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
    totalPages: 0,
  });

  const fetchUsers = useCallback(async (newFilters?: UserFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtersToUse = newFilters || filters;
      const response = await UserService.getUsers(filtersToUse);
      
      setUsers(response.data);
      setPagination({
        total: response.pagination.total,
        current: response.pagination.page,
        pageSize: response.pagination.pageSize,
        totalPages: response.pagination.totalPages,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      
      // Fallback to mock data
      const mockUsers = UserService.getMockUsers();
      setUsers(mockUsers);
      setPagination({
        total: mockUsers.length,
        current: 1,
        pageSize: 10,
        totalPages: Math.ceil(mockUsers.length / 10),
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = useCallback((newFilters: UserFilters) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const refreshUsers = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers();
  }, [filters, fetchUsers]);

  return {
    users,
    loading,
    error,
    pagination,
    filters,
    fetchUsers,
    setFilters,
    refreshUsers,
  };
}; 