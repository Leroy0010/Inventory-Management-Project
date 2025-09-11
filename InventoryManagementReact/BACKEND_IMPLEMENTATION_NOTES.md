# Backend Implementation Notes for User Report

## Current Spring Boot Implementation

The current Spring Boot implementation only supports:
- Getting user report for a specific user and year
- Endpoint: `POST /api/reports/user`
- Request: `UserReportRequest` with `userId` and `year`
- Response: `List<UserReportItemDto>`

## Required Backend Changes

To fully support the React frontend requirements, the following changes are needed:

### 1. New DTOs

```java
// UserReportSummaryDto.java
public class UserReportSummaryDto {
    private Integer userId;
    private String userName;
    private String userEmail;
    private String departmentName;
    private Integer totalItemsReceived;
    private Integer totalQuantityReceived;
    private List<UserReportItemDto> items;
    
    // constructors, getters, setters
}

// UserReportResponseDto.java
public class UserReportResponseDto {
    private List<UserReportSummaryDto> summaries;
    private Integer totalUsers;
    private Integer totalItems;
    private Integer totalQuantity;
    
    // constructors, getters, setters
}
```

### 2. New Controller Endpoints

```java
@RestController
@RequestMapping("/api/reports/user")
public class UserReportController {
    
    // Existing endpoint
    @PostMapping
    public ResponseEntity<List<UserReportItemDto>> getUserReport(@Valid @RequestBody UserReportRequest request);
    
    // New endpoints needed:
    
    // Get all users in a department with their report data
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<UserReportResponseDto> getDepartmentUserReport(
        @PathVariable Integer departmentId,
        @RequestParam(required = false) Integer year,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String sortBy,
        @RequestParam(required = false) String sortOrder
    );
    
    // Get all users with their report data (for storekeeper's department)
    @GetMapping("/all")
    public ResponseEntity<UserReportResponseDto> getAllUsersReport(
        @RequestParam(required = false) Integer year,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String sortBy,
        @RequestParam(required = false) String sortOrder
    );
}
```

### 3. New Repository Methods

```java
@Repository
public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
    
    // Existing method
    @Query("SELECT new com.leroy.inventorymanagementspringboot.dto.report.UserReportItemDto(...)")
    List<UserReportItemDto> getUserReportItems(@Param("userId") Integer userId, @Param("year") int year);
    
    // New methods needed:
    
    // Get all users in a department with their report data
    @Query("""
        SELECT new com.leroy.inventorymanagementspringboot.dto.report.UserReportSummaryDto(
            u.id,
            CONCAT(u.firstName, ' ', u.lastName),
            u.email,
            d.name,
            COUNT(DISTINCT st.inventoryItem.id),
            COALESCE(SUM(st.quantity), 0)
        )
        FROM StockTransaction st
        JOIN st.request r
        JOIN r.user u
        JOIN u.department d
        WHERE st.transactionType = 'RECEIVED'
          AND d.id = :departmentId
          AND (:year IS NULL OR EXTRACT(YEAR FROM st.transactionDate) = :year)
          AND (:search IS NULL OR LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :search, '%'))
                               OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))
        GROUP BY u.id, u.firstName, u.lastName, u.email, d.name
        ORDER BY 
            CASE WHEN :sortBy = 'userName' AND :sortOrder = 'asc' THEN CONCAT(u.firstName, ' ', u.lastName) END ASC,
            CASE WHEN :sortBy = 'userName' AND :sortOrder = 'desc' THEN CONCAT(u.firstName, ' ', u.lastName) END DESC,
            CASE WHEN :sortBy = 'quantityReceived' AND :sortOrder = 'asc' THEN COALESCE(SUM(st.quantity), 0) END ASC,
            CASE WHEN :sortBy = 'quantityReceived' AND :sortOrder = 'desc' THEN COALESCE(SUM(st.quantity), 0) END DESC,
            CASE WHEN :sortBy = 'inventoryCode' AND :sortOrder = 'asc' THEN u.id END ASC,
            CASE WHEN :sortBy = 'inventoryCode' AND :sortOrder = 'desc' THEN u.id END DESC
    """)
    List<UserReportSummaryDto> getDepartmentUserReportSummary(
        @Param("departmentId") Integer departmentId,
        @Param("year") Integer year,
        @Param("search") String search,
        @Param("sortBy") String sortBy,
        @Param("sortOrder") String sortOrder
    );
    
    // Get individual items for each user
    @Query("""
        SELECT new com.leroy.inventorymanagementspringboot.dto.report.UserReportItemDto(
            st.inventoryItem.id,
            st.inventoryItem.name,
            st.inventoryItem.unit,
            SUM(st.quantity)
        )
        FROM StockTransaction st
        JOIN st.request r
        WHERE st.transactionType = 'RECEIVED'
          AND r.user.id = :userId
          AND (:year IS NULL OR EXTRACT(YEAR FROM st.transactionDate) = :year)
        GROUP BY st.inventoryItem.id, st.inventoryItem.name, st.inventoryItem.unit
        ORDER BY st.inventoryItem.name
    """)
    List<UserReportItemDto> getUserReportItemsForUser(
        @Param("userId") Integer userId,
        @Param("year") Integer year
    );
}
```

### 4. New Service Methods

```java
@Service
public class UserReportService implements UserReportServiceInterface {
    
    // Existing method
    public List<UserReportItemDto> generateUserReport(UserReportRequest request);
    
    // New methods needed:
    
    public UserReportResponseDto getDepartmentUserReport(
        Integer departmentId, 
        Integer year, 
        String search, 
        String sortBy, 
        String sortOrder
    ) {
        // Get user summaries
        List<UserReportSummaryDto> summaries = stockTransactionRepository
            .getDepartmentUserReportSummary(departmentId, year, search, sortBy, sortOrder);
        
        // Get individual items for each user
        for (UserReportSummaryDto summary : summaries) {
            List<UserReportItemDto> items = stockTransactionRepository
                .getUserReportItemsForUser(summary.getUserId(), year);
            summary.setItems(items);
        }
        
        // Calculate totals
        int totalUsers = summaries.size();
        int totalItems = summaries.stream().mapToInt(UserReportSummaryDto::getTotalItemsReceived).sum();
        int totalQuantity = summaries.stream().mapToInt(UserReportSummaryDto::getTotalQuantityReceived).sum();
        
        return new UserReportResponseDto(summaries, totalUsers, totalItems, totalQuantity);
    }
    
    public UserReportResponseDto getAllUsersReport(
        Integer year, 
        String search, 
        String sortBy, 
        String sortOrder
    ) {
        // Get current user's department
        User currentUser = getCurrentUser();
        Department department = currentUser.getDepartment();
        
        return getDepartmentUserReport(department.getId(), year, search, sortBy, sortOrder);
    }
}
```

### 5. Security Considerations

- Ensure only storekeepers can access the new endpoints
- Add proper validation for search parameters
- Implement pagination for large datasets
- Add rate limiting to prevent abuse

### 6. Performance Optimizations

- Add database indexes on frequently queried columns
- Consider caching for frequently accessed data
- Implement pagination for large result sets
- Use database-level sorting instead of application-level sorting

## Implementation Priority

1. **High Priority**: Create the new DTOs and basic endpoints
2. **Medium Priority**: Implement search and sorting functionality
3. **Low Priority**: Add pagination and performance optimizations

## Testing

- Unit tests for new service methods
- Integration tests for new endpoints
- Performance tests for large datasets
- Security tests for access control
