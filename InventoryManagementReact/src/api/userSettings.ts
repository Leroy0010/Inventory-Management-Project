import { api } from './client';
import type { UserSettings } from '../types/settings';

export interface UserSettingsResponse {
    id: number;
    userId: number;
    userEmail: string;
    userName: string;
    theme: string;
    language: string;
    timezone?: string;
    autoSave: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    inAppNotifications: boolean;
    profileVisibility: string;
    activityTracking: boolean;
    marketingEmails: boolean;
    dashboardLayout: string;
    defaultPageSize: number;
    autoRefresh: boolean;
    refreshInterval: number;
    reportFormat: string;
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    loginNotifications: boolean;
    // Advanced settings
    apiKey?: string;
    webhookUrl?: string;
    slackIntegration: boolean;
    teamsIntegration: boolean;
    emailIntegration: boolean;
    debugMode: boolean;
    logLevel: string;
    cacheEnabled: boolean;
    cacheTimeout: number;
    experimentalFeatures: boolean;
    smsNotifications: boolean;
    desktopNotifications: boolean;
    createdAt: string;
    updatedAt: string;
    version: string;
}

export interface SettingsExistsResponse {
    exists: boolean;
}

export interface SettingsExportResponse {
    settings: UserSettingsResponse;
}

export interface SettingsStatsResponse {
    totalUsers: number;
    themes: Record<string, number>;
    languages: Record<string, number>;
    notifications: Record<string, number>;
}

export interface BulkUpdateResponse {
    updated: number;
    failed: number;
    message: string;
}

class UserSettingsApi {
    private static readonly BASE_URL = '/settings';

    /**
     * Get current user's settings
     */
    static async getUserSettings(): Promise<UserSettingsResponse> {
        try {
            console.log('Fetching user settings...');
            const response = await api.get<UserSettingsResponse>(this.BASE_URL);
            console.log('User settings fetched successfully:', response);
            return response;
        } catch (error) {
            console.error('Error fetching user settings:', error);
            throw error;
        }
    }

    /**
     * Get user settings by ID (admin/storekeeper only)
     */
    static async getUserSettingsById(
        userId: number
    ): Promise<UserSettingsResponse> {
        try {
            console.log(`Fetching settings for user ID: ${userId}`);
            const response = await api.get<UserSettingsResponse>(
                `${this.BASE_URL}/user/${userId}`
            );
            console.log('User settings fetched successfully:', response);
            return response;
        } catch (error) {
            console.error(`Error fetching settings for user ${userId}:`, error);
            throw error;
        }
    }

    /**
     * Create or update user settings
     */
    static async saveUserSettings(
        settings: Partial<UserSettingsResponse>
    ): Promise<UserSettingsResponse> {
        try {
            console.log('Saving user settings:', settings);
            const response = await api.post<UserSettingsResponse>(
                this.BASE_URL,
                settings
            );
            console.log('User settings saved successfully:', response);
            return response;
        } catch (error) {
            console.error('Error saving user settings:', error);
            throw error;
        }
    }

    /**
     * Update specific settings category
     */
    static async updateSettingsCategory(
        category: string,
        categorySettings: Record<string, any>
    ): Promise<UserSettingsResponse> {
        try {
            console.log(`Updating ${category} settings:`, categorySettings);
            const response = await api.patch<UserSettingsResponse>(
                `${this.BASE_URL}/${category}`,
                categorySettings
            );
            console.log(`${category} settings updated successfully:`, response);
            return response;
        } catch (error) {
            console.error(`Error updating ${category} settings:`, error);
            throw error;
        }
    }

    /**
     * Reset user settings to defaults
     */
    static async resetToDefaults(): Promise<UserSettingsResponse> {
        try {
            console.log('Resetting user settings to defaults...');
            const response = await api.post<UserSettingsResponse>(
                `${this.BASE_URL}/reset`
            );
            console.log('User settings reset successfully:', response);
            return response;
        } catch (error) {
            console.error('Error resetting user settings:', error);
            throw error;
        }
    }

    /**
     * Delete user settings
     */
    static async deleteUserSettings(): Promise<void> {
        try {
            console.log('Deleting user settings...');
            await api.delete(this.BASE_URL);
            console.log('User settings deleted successfully');
        } catch (error) {
            console.error('Error deleting user settings:', error);
            throw error;
        }
    }

    /**
     * Check if user has settings
     */
    static async hasUserSettings(): Promise<boolean> {
        try {
            console.log('Checking if user has settings...');
            const response = await api.get<SettingsExistsResponse>(
                `${this.BASE_URL}/exists`
            );
            console.log('Settings existence check result:', response.exists);
            return response.exists;
        } catch (error) {
            console.error('Error checking if user has settings:', error);
            throw error;
        }
    }

    /**
     * Get settings statistics (admin only)
     */
    static async getSettingsStatistics(): Promise<SettingsStatsResponse> {
        try {
            console.log('Fetching settings statistics...');
            const response = await api.get<SettingsStatsResponse>(
                `${this.BASE_URL}/stats`
            );
            console.log('Settings statistics fetched successfully:', response);
            return response;
        } catch (error) {
            console.error('Error fetching settings statistics:', error);
            throw error;
        }
    }

    /**
     * Bulk update settings for multiple users (admin only)
     */
    static async bulkUpdateSettings(
        bulkUpdateRequest: Record<string, any>
    ): Promise<BulkUpdateResponse> {
        try {
            console.log('Performing bulk update:', bulkUpdateRequest);
            const response = await api.post<BulkUpdateResponse>(
                `${this.BASE_URL}/bulk`,
                bulkUpdateRequest
            );
            console.log('Bulk update completed:', response);
            return response;
        } catch (error) {
            console.error('Error performing bulk update:', error);
            throw error;
        }
    }

    /**
     * Export user settings
     */
    static async exportUserSettings(): Promise<UserSettingsResponse> {
        try {
            console.log('Exporting user settings...');
            const response = await api.get<SettingsExportResponse>(
                `${this.BASE_URL}/export`
            );
            console.log(
                'User settings exported successfully:',
                response.settings
            );
            return response.settings;
        } catch (error) {
            console.error('Error exporting user settings:', error);
            throw error;
        }
    }

    /**
     * Import user settings
     */
    static async importUserSettings(importData: {
        settings: UserSettingsResponse;
    }): Promise<UserSettingsResponse> {
        try {
            console.log('Importing user settings:', importData);
            const response = await api.post<UserSettingsResponse>(
                `${this.BASE_URL}/import`,
                importData
            );
            console.log('User settings imported successfully:', response);
            return response;
        } catch (error) {
            console.error('Error importing user settings:', error);
            throw error;
        }
    }
}

export default UserSettingsApi;
