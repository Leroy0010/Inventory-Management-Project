// Settings Types for User Preferences and Configuration
import { getCurrentDateISO } from '../utils/dateUtils';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr' | 'de';
export type Timezone = string;
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
export type TimeFormat = '12h' | '24h';

export type NotificationFrequency =
    | 'immediate'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'never';
export type NotificationChannel = 'email' | 'push' | 'in_app';

export type DashboardLayout = 'compact' | 'comfortable' | 'spacious';
export type TablePageSize = 10 | 25 | 50 | 100;
export type ReportFormat = 'pdf' | 'excel' | 'csv';

export type PrivacyLevel = 'public' | 'department' | 'private';
export type DataSharing = 'none' | 'analytics' | 'full';

export type SessionTimeout = 15 | 30 | 60 | 120 | 240; // minutes
export type TwoFactorMethod = 'email' | 'sms' | 'app' | 'none';

// General Settings
export interface GeneralSettings {
    theme: Theme;
    language: Language;
    timezone: Timezone;
    dateFormat: DateFormat;
    timeFormat: TimeFormat;
    autoSave: boolean;
    confirmActions: boolean;
}

// Notification Settings
export interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    inAppNotifications: boolean;
    requestUpdates: NotificationFrequency;
    systemAlerts: NotificationFrequency;
    reportReady: NotificationFrequency;
    weeklyDigest: boolean;
    quietHours: {
        enabled: boolean;
        start: string; // HH:MM format
        end: string; // HH:MM format
    };
    channels: {
        [key in NotificationChannel]: boolean;
    };
}

// Privacy Settings
export interface PrivacySettings {
    profileVisibility: PrivacyLevel;
    activityTracking: boolean;
    dataSharing: DataSharing;
    analyticsOptIn: boolean;
    marketingEmails: boolean;
    showOnlineStatus: boolean;
    allowDirectMessages: boolean;
}

// Application Settings
export interface ApplicationSettings {
    dashboardLayout: DashboardLayout;
    defaultPageSize: TablePageSize;
    autoRefresh: boolean;
    refreshInterval: number; // seconds
    showTutorials: boolean;
    compactMode: boolean;
    sidebarCollapsed: boolean;
    reportFormat: ReportFormat;
    exportLocation: string;
    autoExport: boolean;
}

// Security Settings
export interface SecuritySettings {
    twoFactorEnabled: boolean;
    twoFactorMethod: TwoFactorMethod;
    sessionTimeout: SessionTimeout;
    loginNotifications: boolean;
    passwordExpiry: number; // days
    requirePasswordChange: boolean;
    trustedDevices: boolean;
    apiAccess: boolean;
}

// Advanced Settings
export interface AdvancedSettings {
    apiKey: string;
    webhookUrl: string;
    integrations: {
        slack: boolean;
        teams: boolean;
        email: boolean;
    };
    debugMode: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
    cacheEnabled: boolean;
    cacheTimeout: number; // minutes
    experimentalFeatures: boolean;
}

// Complete Settings Object
export interface UserSettings {
    general: GeneralSettings;
    notifications: NotificationSettings;
    privacy: PrivacySettings;
    application: ApplicationSettings;
    security: SecuritySettings;
    advanced: AdvancedSettings;
    lastUpdated: string;
    version: string;
}

// Settings Categories
export type SettingsCategory =
    | 'general'
    | 'notifications'
    | 'privacy'
    | 'application'
    | 'security'
    | 'advanced';

// Settings Tab Configuration
export interface SettingsTab {
    id: SettingsCategory;
    label: string;
    description: string;
    icon: string;
    permissions: string[];
    component: React.ComponentType<any>;
}

// Settings Form Props
export interface SettingsFormProps {
    settings: Partial<UserSettings>;
    onUpdate: (category: SettingsCategory, settings: Partial<any>) => void;
    isLoading?: boolean;
    errors?: Record<string, string>;
}

// Settings Validation
export interface SettingsValidation {
    [key: string]: {
        required?: boolean;
        min?: number;
        max?: number;
        pattern?: RegExp;
        custom?: (value: any) => string | null;
    };
}

// Default Settings
export const DEFAULT_SETTINGS: UserSettings = {
    general: {
        theme: 'system',
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        autoSave: true,
        confirmActions: true,
    },
    notifications: {
        emailNotifications: true,
        pushNotifications: true,
        inAppNotifications: true,
        requestUpdates: 'immediate',
        systemAlerts: 'immediate',
        reportReady: 'immediate',
        weeklyDigest: true,
        quietHours: {
            enabled: false,
            start: '22:00',
            end: '08:00',
        },
        channels: {
            email: true,
            push: true,
            in_app: true,
        },
    },
    privacy: {
        profileVisibility: 'department',
        activityTracking: true,
        dataSharing: 'analytics',
        analyticsOptIn: true,
        marketingEmails: false,
        showOnlineStatus: true,
        allowDirectMessages: true,
    },
    application: {
        dashboardLayout: 'comfortable',
        defaultPageSize: 25,
        autoRefresh: true,
        refreshInterval: 30,
        showTutorials: true,
        compactMode: false,
        sidebarCollapsed: false,
        reportFormat: 'pdf',
        exportLocation: 'downloads',
        autoExport: false,
    },
    security: {
        twoFactorEnabled: false,
        twoFactorMethod: 'email',
        sessionTimeout: 60,
        loginNotifications: true,
        passwordExpiry: 90,
        requirePasswordChange: false,
        trustedDevices: true,
        apiAccess: false,
    },
    advanced: {
        apiKey: '',
        webhookUrl: '',
        integrations: {
            slack: false,
            teams: false,
            email: true,
        },
        debugMode: false,
        logLevel: 'info',
        cacheEnabled: true,
        cacheTimeout: 15,
        experimentalFeatures: false,
    },
    lastUpdated: getCurrentDateISO(),
    version: '1.0.0',
};
