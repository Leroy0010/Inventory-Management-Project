import type { RequestStatus } from './request';
import type { UserResponseDto } from './user';

export interface RequestStatusHistoryDto {
    id: number;
    statusName: RequestStatus;
    changedBy: UserResponseDto;
    timestamp: string; // ISO string from LocalDateTime
}
