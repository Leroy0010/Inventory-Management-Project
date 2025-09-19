import { api, handleApiError } from './client';
import type { 
  Office, 
  CreateOfficeRequest, 
  UpdateOfficeRequest, 
  OfficeFilters,
  OfficeListResponse,
  CreateOfficeDto, 
  OfficeResponseDto 
} from '@/types/office';

// Office API functions based on Spring Boot OfficeController
export const officeApi = {
    // Get all offices for the current user's department
    getOffices: async (filters?: OfficeFilters): Promise<Office[]> => {
        try {
            const params = new URLSearchParams();
            if (filters?.search) params.append('search', filters.search);
            
            const queryString = params.toString();
            const url = queryString ? `/offices?${queryString}` : '/offices';
            
            return await api.get<Office[]>(url);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Get office by ID
    getOfficeById: async (id: number): Promise<Office> => {
        try {
            return await api.get<Office>(`/offices/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Get office names only
    getOfficeNames: async (): Promise<string[]> => {
        try {
            return await api.get<string[]>('/offices/names');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Create new office
    createOffice: async (office: CreateOfficeRequest): Promise<string> => {
        try {
            return await api.post<string>('/offices', office);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Update office
    updateOffice: async (id: number, office: UpdateOfficeRequest): Promise<Office> => {
        try {
            return await api.put<Office>(`/offices/${id}`, office);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Delete office
    deleteOffice: async (id: number): Promise<void> => {
        try {
            await api.delete(`/offices/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
