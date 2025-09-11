# User Report Backend Implementation

## Overview

This document describes the implementation of the User Report feature in the Spring Boot backend. The feature allows storekeepers to view inventory usage reports for all staff members in their department, with search, sort, and filter capabilities.

## Key Design Decisions

### 1. Department-Based Filtering
- **Storekeepers** belong to a **Department**
- **Staff** belong to an **Office** which belongs to a **Department**
- User reports show staff from the same department as the storekeeper
- Display shows **Office Name** instead of Department Name (since all users are from the same department)

### 2. Data Structure
- **UserReportSummaryDto**: Contains user information and aggregated data
- **UserReportResponseDto**: Contains list of summaries plus totals
- **UserReportItemDto**: Individual inventory item details (existing)

## Implementation Details

### 1. New DTOs

#### UserReportSummaryDto
```java
public class UserReportSummaryDto {
    private Integer userId;
    private String userName;           // Full name (firstName + lastName)
    private String userEmail;
    private String officeName;         // Office name (not department)
    private Integer totalItemsReceived;
    private Integer totalQuantityReceived;
    private List<UserReportItemDto> items;
}
```

#### UserReportResponseDto
```java
public class UserReportResponseDto {
    private List<UserReportSummaryDto> summaries;
    private Integer totalUsers;
    private Integer totalItems;
    private Integer totalQuantity;
}
```

### 2. Repository Layer

#### New Query Methods in StockTransactionRepository

**getUserReportSummariesByDepartment()**
- Gets user summaries for all staff in a specific department
- Filters by year, search term, and sorting options
- Joins: StockTransaction → Request → User → Office
- Groups by user and aggregates quantities

**getUserReportItemsForUser()**
- Gets individual inventory items for a specific user
- Used to populate the items list in each summary

### 3. Service Layer

#### UserReportService Methods

**getDepartmentUserReport()**
- Gets reports for a specific department
- Calls repository to get summaries
- Fetches individual items for each user
- Calculates totals

**getAllUsersReport()**
- Gets reports for the current user's department
- Uses the current user's department ID
- Delegates to getDepartmentUserReport()

### 4. Controller Layer

#### New Endpoints

**GET /api/reports/user/all**
- Gets user reports for the current storekeeper's department
- Parameters: year, search, sortBy, sortOrder
- Returns: UserReportResponseDto

**GET /api/reports/user/department/{departmentId}**
- Gets user reports for a specific department
- Parameters: year, search, sortBy, sortOrder
- Returns: UserReportResponseDto

**POST /api/reports/user** (existing)
- Gets report for a specific user
- Maintains backward compatibility

### 5. Database Optimizations

#### New Indexes
- `idx_stock_transactions_user_report`: (transaction_type, transaction_date, related_request_id)
- `idx_requests_user_report`: (user_id)
- `idx_users_office_department`: (office_id, department_id)
- `idx_offices_department`: (department_id)

## API Usage Examples

### Get All Users Report
```http
GET /api/reports/user/all?year=2024&search=john&sortBy=userName&sortOrder=asc
Authorization: Bearer <token>
```

### Get Department Report
```http
GET /api/reports/user/department/1?year=2024&search=smith&sortBy=quantityReceived&sortOrder=desc
Authorization: Bearer <token>
```

## Response Format

```json
{
  "summaries": [
    {
      "userId": 1,
      "userName": "John Doe",
      "userEmail": "john.doe@company.com",
      "officeName": "IT Office",
      "totalItemsReceived": 15,
      "totalQuantityReceived": 150,
      "items": [
        {
          "inventoryCode": 1001,
          "inventoryName": "Laptop",
          "unit": "pcs",
          "quantityReceived": 5
        }
      ]
    }
  ],
  "totalUsers": 1,
  "totalItems": 15,
  "totalQuantity": 150
}
```

## Security

- All endpoints require `STOREKEEPER` authority
- Users can only see reports for their own department
- Search and filtering are performed at the database level

## Performance Considerations

1. **Database Indexes**: Added indexes for common query patterns
2. **Query Optimization**: Uses efficient JOINs and GROUP BY clauses
3. **Pagination**: Can be added in future iterations for large datasets
4. **Caching**: Can be implemented for frequently accessed data

## Migration

The implementation includes a new Liquibase migration file:
- `db.changelog-006-user-report-optimizations.yaml`
- Adds performance indexes
- No schema changes required

## Testing

### Unit Tests
- Test service methods with mock data
- Test repository queries
- Test controller endpoints

### Integration Tests
- Test full request/response cycle
- Test with real database
- Test security constraints

## Future Enhancements

1. **Pagination**: Add pagination for large result sets
2. **Caching**: Implement Redis caching for frequently accessed data
3. **Export**: Add PDF/Excel export functionality
4. **Real-time**: Add WebSocket updates for real-time data
5. **Analytics**: Add more detailed analytics and charts

## Error Handling

- Invalid department ID: Returns 400 Bad Request
- User not found: Returns 400 Bad Request
- Database errors: Returns 500 Internal Server Error
- Unauthorized access: Returns 403 Forbidden

## Monitoring

- Add logging for query performance
- Monitor database query execution times
- Track API usage and response times
- Set up alerts for slow queries
