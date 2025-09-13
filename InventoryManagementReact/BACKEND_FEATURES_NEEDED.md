# Backend Features Needed for Request Details Page

This document outlines the additional features that need to be implemented in the Spring Boot backend to support the full functionality of the Request Details page.

## Current Backend Support

The current `RequestResponseDto` supports:
- ✅ Basic request information (id, user_id, status, submittedAt)
- ✅ Request items (id, name, quantity)
- ✅ Approval information (approvedAt, approver)
- ✅ Fulfillment information (fulfilledAt, fulfiller)
- ✅ Status history (statusHistory array)

## Missing Features

### 1. Request Description and Notes

**Current State**: Not supported
**Needed Fields**:
```typescript
interface RequestResponseDto {
  // ... existing fields
  description?: string;        // Optional description of the request
  notes?: string;             // Optional notes from requester
}
```

**Backend Changes Needed**:
- Add `description` and `notes` fields to the `Request` entity
- Update DTOs to include these fields
- Update API endpoints to return these fields

### 2. Requester Information

**Current State**: Only returns `user_id`
**Needed Fields**:
```typescript
interface RequestResponseDto {
  // ... existing fields
  requester: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}
```

**Backend Changes Needed**:
- Include requester user details in the response
- Either join the User entity or fetch user details separately
- Update DTOs to include requester information

### 3. Request Priority

**Current State**: Not supported
**Needed Fields**:
```typescript
interface RequestResponseDto {
  // ... existing fields
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}
```

**Backend Changes Needed**:
- Add `priority` field to the `Request` entity
- Update DTOs to include priority
- Add priority validation and business logic

### 4. Request Type

**Current State**: Not supported
**Needed Fields**:
```typescript
interface RequestResponseDto {
  // ... existing fields
  type: 'INVENTORY_REQUEST' | 'APPROVAL_REQUEST' | 'TRANSFER_REQUEST';
}
```

**Backend Changes Needed**:
- Add `type` field to the `Request` entity
- Update DTOs to include type
- Add type validation and business logic

### 5. Item Pricing Information

**Current State**: Only supports item name and quantity
**Needed Fields**:
```typescript
interface RequestItemResponseDto {
  // ... existing fields
  sku?: string;              // Stock Keeping Unit
  unitPrice?: number;        // Price per unit
  totalPrice?: number;       // Total price for this item
  notes?: string;           // Item-specific notes
}
```

**Backend Changes Needed**:
- Add pricing fields to the `RequestItem` entity
- Update DTOs to include pricing information
- Add pricing calculation logic
- Consider if pricing should be stored or calculated from inventory items

### 6. Rejection Information

**Current State**: Not supported
**Needed Fields**:
```typescript
interface RequestResponseDto {
  // ... existing fields
  rejectedAt?: Date;         // When the request was rejected
  rejectionReason?: string;  // Reason for rejection
  rejectedBy?: UserResponseDto; // Who rejected the request
}
```

**Backend Changes Needed**:
- Add rejection fields to the `Request` entity
- Update DTOs to include rejection information
- Update rejection logic to store these fields

### 7. Enhanced Status History

**Current State**: Basic status history supported
**Improvements Needed**:
- Add more detailed status history entries
- Include comments/notes for each status change
- Add timestamps for all status changes

### 8. Request Title

**Current State**: Not supported
**Needed Fields**:
```typescript
interface RequestResponseDto {
  // ... existing fields
  title: string;             // Human-readable title for the request
}
```

**Backend Changes Needed**:
- Add `title` field to the `Request` entity
- Update DTOs to include title
- Add title validation and business logic

## Implementation Priority

### High Priority (Core Functionality)
1. **Requester Information** - Essential for user experience
2. **Request Description** - Important for context
3. **Rejection Information** - Critical for workflow

### Medium Priority (Enhanced UX)
4. **Request Title** - Improves readability
5. **Item Pricing** - Important for financial tracking
6. **Request Priority** - Useful for workflow management

### Low Priority (Nice to Have)
7. **Request Type** - Can be inferred from context
8. **Enhanced Status History** - Current implementation is sufficient

## Database Schema Changes

```sql
-- Add new columns to requests table
ALTER TABLE requests ADD COLUMN title VARCHAR(255);
ALTER TABLE requests ADD COLUMN description TEXT;
ALTER TABLE requests ADD COLUMN notes TEXT;
ALTER TABLE requests ADD COLUMN priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM';
ALTER TABLE requests ADD COLUMN type ENUM('INVENTORY_REQUEST', 'APPROVAL_REQUEST', 'TRANSFER_REQUEST') DEFAULT 'INVENTORY_REQUEST';
ALTER TABLE requests ADD COLUMN rejected_at TIMESTAMP NULL;
ALTER TABLE requests ADD COLUMN rejection_reason TEXT;
ALTER TABLE requests ADD COLUMN rejected_by_id BIGINT NULL;

-- Add new columns to request_items table
ALTER TABLE request_items ADD COLUMN sku VARCHAR(100);
ALTER TABLE request_items ADD COLUMN unit_price DECIMAL(10,2);
ALTER TABLE request_items ADD COLUMN total_price DECIMAL(10,2);
ALTER TABLE request_items ADD COLUMN notes TEXT;

-- Add foreign key for rejected_by
ALTER TABLE requests ADD CONSTRAINT fk_requests_rejected_by 
  FOREIGN KEY (rejected_by_id) REFERENCES users(id);
```

## API Endpoint Updates

Update the following endpoints to include the new fields:
- `GET /api/requests` - Include all new fields
- `GET /api/requests/{id}` - Include all new fields
- `POST /api/requests` - Accept new fields in request body
- `PUT /api/requests/approve` - Include rejection information

## Frontend Integration

Once these features are implemented in the backend:

1. **Uncomment the TODO sections** in `RequestDetails.tsx`
2. **Update the types** to match the new backend response
3. **Test the integration** with the new fields
4. **Remove the legacy interfaces** once backend is updated

## Testing

Ensure the following test cases are covered:
- Request creation with all new fields
- Request approval with rejection information
- Request listing with requester information
- Status history with detailed information
- Item pricing calculations
- Priority-based filtering and sorting
