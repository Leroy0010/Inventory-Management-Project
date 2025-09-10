import { api, handleApiError } from './client';
import type { CreateOfficeDto, OfficeResponseDto } from '@/types/office';

// Office API functions based on Spring Boot OfficeController
export const officeApi = {
    // Get all offices for the current user's department
    getOffices: async (): Promise<OfficeResponseDto[]> => {
        try {
            return await api.get<OfficeResponseDto[]>('/api/offices');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Get office names only
    getOfficeNames: async (): Promise<string[]> => {
        try {
            return await api.get<string[]>('/api/offices/names');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Create new office
    createOffice: async (office: CreateOfficeDto): Promise<OfficeResponseDto> => {
        try {
            return await api.post<OfficeResponseDto>('/api/offices', office);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
