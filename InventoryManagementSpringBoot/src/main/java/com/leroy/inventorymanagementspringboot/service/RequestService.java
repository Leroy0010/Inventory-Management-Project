package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.annotation.Auditable;
import com.leroy.inventorymanagementspringboot.dto.request.CreateRequestDto;
import com.leroy.inventorymanagementspringboot.dto.request.ApproveRequestDto;
import com.leroy.inventorymanagementspringboot.dto.request.RequestFulfilmentDto;
import com.leroy.inventorymanagementspringboot.dto.request.RequestItemDto;
import com.leroy.inventorymanagementspringboot.dto.response.RequestResponseDto;
import com.leroy.inventorymanagementspringboot.entity.*;
import com.leroy.inventorymanagementspringboot.enums.AuditAction;
import com.leroy.inventorymanagementspringboot.enums.NotificationType;
import com.leroy.inventorymanagementspringboot.mapper.RequestMapper;
import com.leroy.inventorymanagementspringboot.repository.*;
import com.leroy.inventorymanagementspringboot.servicei.RequestServiceInterface;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional; // Import Optional
import java.util.stream.Collectors;

/**
 * Service class responsible for handling all business logic related to inventory requests.
 * This includes creating, approving, rejecting, fulfilling, and retrieving requests.
 * It interacts with various repositories and other services to manage request lifecycle,
 * inventory updates, status history, and notifications.
 */
@Service
@Transactional // Ensures that all methods within this service are executed within a transaction.
public class RequestService implements RequestServiceInterface {

    private final RequestMapper requestMapper;
    private final InventoryItemRepository inventoryItemRepository;
    private final RequestRepository requestRepository;
    private final RequestStatusRepository requestStatusRepository;
    private final InventoryIssuanceService inventoryIssuanceService;
    private final RequestStatusHistoryService requestStatusHistoryService;
    private final CartRepository cartRepository;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final Logger logger = LogManager.getLogger(RequestService.class);

    /**
     * Constructs a new RequestService with the necessary dependencies.
     * Spring's dependency injection framework automatically provides these beans.
     *
     * @param requestMapper Mapper for converting between Request entities and DTOs.
     * @param inventoryItemRepository Repository for managing InventoryItem entities.
     * @param requestRepository Repository for managing Request entities.
     * @param requestStatusRepository Repository for managing RequestStatus entities.
     * @param inventoryIssuanceService Service for handling inventory issuance logic.
     * @param requestStatusHistoryService Service for managing request status change history.
     * @param cartRepository Repository for managing Cart entities.
     * @param inventoryBatchRepository Repository for managing InventoryBatch entities.
     * @param notificationService Service for sending notifications.
     * @param userRepository Repository for managing User entities.
     * @param roleRepository Repository for managing Role entities.
     */
    public RequestService(RequestMapper requestMapper,
                          InventoryItemRepository inventoryItemRepository,
                          RequestRepository requestRepository,
                          RequestStatusRepository requestStatusRepository,
                          InventoryIssuanceService inventoryIssuanceService,
                          RequestStatusHistoryService requestStatusHistoryService,
                          CartRepository cartRepository, InventoryBatchRepository inventoryBatchRepository, NotificationService notificationService, UserRepository userRepository, RoleRepository roleRepository) {
        this.requestMapper = requestMapper;
        this.inventoryItemRepository = inventoryItemRepository;
        this.requestRepository = requestRepository;
        this.requestStatusRepository = requestStatusRepository;
        this.inventoryIssuanceService = inventoryIssuanceService;
        this.requestStatusHistoryService = requestStatusHistoryService;
        this.cartRepository = cartRepository;
        this.inventoryBatchRepository = inventoryBatchRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    /**
     * Creates a new inventory request based on the provided DTO and the authenticated user.
     * This method performs several checks including requester validity, item availability,
     * and insufficient stock before persisting the request. It also handles setting the initial
     * status to "PENDING" and logging the status change. Notifications are sent to the requester.
     *
     * @param requestDto The data transfer object containing details for the new request.
     * @param userDetails The Spring Security UserDetails of the authenticated user who is submitting the request.
     * @return A RequestResponseDto representing the newly created request.
     * @throws EntityNotFoundException if the requester user is not found.
     * @throws IllegalArgumentException if the request has no items, the "PENDING" status is not found,
     * or if there is insufficient stock for any requested item.
     * @throws RuntimeException if an inventory item specified in the request is not found.
     */
    @Override
    @Transactional // Ensures the entire method executes as a single transaction.
    @Auditable( // Custom annotation for auditing this action.
            action = AuditAction.CREATE,
            entityClass = Request.class
    )
    public RequestResponseDto createRequest(CreateRequestDto requestDto, UserDetails userDetails) {
        // Retrieve the requester user from the database based on their email (username).
        User requester = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("Invalid requester"));
        // This check is redundant with orElseThrow, but harmless.
        if (requester == null){
            throw new NullPointerException("Invalid Requester");
        }

        // Validate that the request contains at least one item.
        if (requestDto.getItems() == null || requestDto.getItems().isEmpty()) {
            throw new IllegalArgumentException("Request must contain at least one item.");
        }

        // Map the DTO to a Request entity and set the requester.
        Request request = requestMapper.toRequest(requestDto, requester);
        // Find the "PENDING" status from the database.
        RequestStatus pendingStatus = requestStatusRepository.findByName("PENDING")
                .orElseThrow(() -> new IllegalArgumentException("Request Status PENDING not found"));

        // Set the initial status and submission timestamp for the request.
        request.setRequestStatus(pendingStatus);
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        request.setSubmittedAt(timestamp);

        // Extract all item IDs from the request DTO.
        List<Integer> itemIds = requestDto.getItems().stream()
                .map(RequestItemDto::getItemId).toList();

        // Fetch all inventory items corresponding to the requested item IDs.
        List<InventoryItem> inventoryItems = inventoryItemRepository.findAllByIdIn(itemIds);

        // Perform stock availability checks for each requested item.
        for (RequestItemDto itemDto : requestDto.getItems()) {
            // Find the corresponding InventoryItem from the fetched list.
            InventoryItem item = inventoryItems.stream()
                    .filter(i -> i.getId() == itemDto.getItemId())
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Item not found: " + itemDto.getItemId()));

            // Notify if the stock of the item is low (logic handled within notificationService).
            notificationService.notifyLowStockIfNeeded(item);
            // Calculate the total available quantity for the item across all batches.
            // Assuming sumRemainingQuantityByItem returns 0 if no batches exist
            int availableQty = inventoryBatchRepository.sumRemainingQuantityByItem(item);

            // Check if the requested quantity exceeds the available stock.
            if (itemDto.getQuantity() > availableQty) {
                throw new IllegalArgumentException("Insufficient stock for item: " + item.getName());
            }
        }

        // Convert RequestItemDto objects to RequestItem entities and link them to the request.
        List<RequestItem> requestItems = requestDto.getItems().stream().map(itemDto ->{
            InventoryItem inventoryItem = inventoryItems
                    .stream()
                    .filter(item -> item.getId() == itemDto.getItemId())
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Inventory item not found: " + itemDto.getItemId()));

            RequestItem requestItem = new RequestItem();
            requestItem.setItem(inventoryItem);
            requestItem.setQuantity(itemDto.getQuantity());
            requestItem.setRequest(request); // Associate the request item with the request.
            return requestItem;
        }).toList();

        // Set the collection of request items for the request. Using HashSet for unique items.
        request.setItems(new HashSet<>(requestItems));

        // Notify the requester about the successful submission of their request.
        notificationService
                .notifyWithRequest(requester, "Request Submission", "Your request has been successfully submitted.", NotificationType.NEW_REQUEST, request, timestamp);

        // Log the initial status change (PENDING) in the request's history.
        requestStatusHistoryService.saveStatusChange(request, pendingStatus, requester, timestamp);

        // Save the new request to the database and return its DTO representation.
        return requestMapper.toRequestResponseDto(requestRepository.save(request));
    }


    /**
     * Approves or rejects an inventory request.
     * This method ensures that only PENDING requests can be acted upon.
     * It updates the request status, sets the approver and approval timestamp if approved,
     * logs the status change, and sends a notification to the original requester.
     *
     * @param dto The data transfer object containing the request ID and approval decision.
     * @param userDetails The Spring Security UserDetails of the authenticated user performing the approval/rejection.
     * @return A RequestResponseDto representing the updated request.
     * @throws EntityNotFoundException if the approver user is not found.
     * @throws IllegalArgumentException if the request is not found or the target status (APPROVED/REJECTED) is not found.
     * @throws IllegalStateException if the request is not in PENDING status.
     */
    @Override
    @Transactional // Ensures the entire method executes as a single transaction.
    @Auditable( // Custom annotation for auditing this action.
            action = AuditAction.REQUEST_APPROVAL_DECISION,
            entityClass = Request.class,
            context = "Request approval or rejection",
            logBefore = true // Log audit event before method execution.
    )
    public RequestResponseDto approveOrRejectRequest(ApproveRequestDto dto, UserDetails userDetails) {
        // Retrieve the approver user from the database.
        User approver = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        // Retrieve the request by its ID.
        Request request = requestRepository.findById(dto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        // Only allow status change if the request is PENDING
        if (!request.getRequestStatus().getName().equals("PENDING")) {
            throw new IllegalStateException("Request is not in PENDING status and cannot be approved/rejected.");
        }

        RequestStatus status;
        // Determine the new status based on the approval decision.
        if (dto.isApprove()) {
            status = requestStatusRepository.findByName("APPROVED")
                    .orElseThrow(() -> new IllegalArgumentException("Request Status APPROVED not found"));
        } else {
            status = requestStatusRepository.findByName("REJECTED")
                    .orElseThrow(() -> new IllegalArgumentException("Request Status REJECTED not found"));
        }

        // Set the new status for the request.
        request.setRequestStatus(status);

        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        // If approved, set the approval timestamp and the approver.
        if (dto.isApprove()) {
            request.setApprovedAt(timestamp);
            request.setApprover(approver);
        }

        // Log the status change in the request's history.
        requestStatusHistoryService.saveStatusChange(request, status, approver, timestamp);

        // Notify the original requester about the approval or rejection.
        notificationService
                .notifyWithRequest(
                        request.getUser(), // The original requester.
                        dto.isApprove() ? "Request Approval": "Request Rejection", // Notification title.
                        dto.isApprove() ?
                                "Your request has been approved by your inventory manager, " + approver.getFullName()
                                :
                                "Your request has been rejected by your inventory manager, " + approver.getFullName(),
                        dto.isApprove() ?
                                NotificationType.REQUEST_APPROVED : NotificationType.REQUEST_REJECTED, // Notification type.
                        request, timestamp);
        // Save the updated request to the database.
        Request updated = requestRepository.save(request);
        // Return the DTO representation of the updated request.
        return requestMapper.toRequestResponseDto(updated);
    }

    /**
     * Fulfills an approved inventory request.
     * This method ensures that only APPROVED requests can be fulfilled.
     * It updates the request status to "FULFILLED", processes each request item for issuance,
     * sets the fulfiller and fulfillment timestamp, and sends a notification to the requester.
     *
     * @param dto The data transfer object containing the request ID and fulfillment status.
     * @param userDetails The Spring Security UserDetails of the authenticated user performing the fulfillment.
     * @return A RequestResponseDto representing the fulfilled request.
     * @throws EntityNotFoundException if the fulfiller user is not found.
     * @throws IllegalArgumentException if the request is not found, the "FULFILLED" status is not found,
     * or if fulfillment is not set to true.
     * @throws IllegalStateException if the request is not in APPROVED status.
     */
    @Override
    @Transactional // Ensures the entire method executes as a single transaction.
    public RequestResponseDto fulfillRequest(RequestFulfilmentDto dto, UserDetails userDetails) {
        // Retrieve the fulfiller user from the database.
        User fulfiller = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        // Retrieve the request by its ID.
        Request request = requestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        // Only allow fulfillment if the request is APPROVED
        if (!request.getRequestStatus().getName().equals("APPROVED")) {
            throw new IllegalStateException("Request is not in APPROVED status and cannot be fulfilled.");
        }

        RequestStatus status;
        // Determine the new status. Currently, only full fulfillment is supported.
        if (dto.isFulfilled()) {
            status = requestStatusRepository.findByName("FULFILLED")
                    .orElseThrow(() -> new IllegalArgumentException("Request Status FULFILLED not found"));
        } else {
            // This case implies partial fulfillment or other states not yet implemented.
            throw new IllegalArgumentException("Fulfillment must be true for now, or define a 'PARTIAL' status.");
        }

        // Set the new status for the request.
        request.setRequestStatus(status);

        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        // If fulfilled, process each item and set fulfillment details.
        if (dto.isFulfilled()) {
            for (RequestItem requestItem : request.getItems()) {
                // Delegate to InventoryIssuanceService to handle the actual stock deduction.
                inventoryIssuanceService.fulfillRequestItem(requestItem, request, fulfiller);
            }
            request.setFulfilledAt(timestamp); // Set the fulfillment timestamp.
            request.setFulfiller(fulfiller);   // Set the user who fulfilled the request.
        }

        // Notify the requester that the request has been fulfilled.
        notificationService.notifyWithRequest(
                request.getApprover(), // The original requester.
                "Request Fulfilled",
                "The request with (ID: " + dto.getRequestId() + ") has been fulfilled by " + fulfiller.getFullName(),
                NotificationType.REQUEST_FULFILLED,
                request, timestamp
        );

        // Log the status change in the request's history.
        requestStatusHistoryService.saveStatusChange(request,status, fulfiller, timestamp);

        // Save the updated request to the database and return its DTO representation.
        return requestMapper.toRequestResponseDto(requestRepository.save(request));
    }

    /**
     * Submits the items currently in a user's cart as a new inventory request.
     * This method validates cart contents, checks stock availability for each item,
     * clears the cart upon successful submission, sets the request status to "PENDING",
     * and sends notifications to both the requester and the relevant storekeeper.
     *
     * @param userDetails The Spring Security UserDetails of the authenticated user whose cart is being submitted.
     * @return A RequestResponseDto representing the newly created request from the cart.
     * @throws EntityNotFoundException if the user is not found.
     * @throws IllegalArgumentException if the cart is not found, the cart is empty,
     * the "PENDING" status is not found, or there is insufficient stock.
     */
    @Override
    @Transactional // Ensures the entire method executes as a single transaction.
    @Auditable( // Custom annotation for auditing this action.
            action = AuditAction.CREATE,
            entityClass = Request.class
    )
    public RequestResponseDto submitCartAsRequest(UserDetails userDetails) {
        // Retrieve the user from the database.
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        // Retrieve the user's cart.
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        // Validate that the cart is not empty.
        if (cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        List<RequestItem> requestItems = new ArrayList<>();

        // Iterate through cart items to perform stock checks and prepare request items.
        for (CartItem cartItem : cart.getItems()) {
            InventoryItem item = cartItem.getInventoryItem();
            // Calculate total available quantity for the item across all batches.
            int availableQty = item.getBatches().stream()
                    .mapToInt(InventoryBatch::getRemainingQuantity)
                    .sum();

            // Check for insufficient stock.
            if (cartItem.getQuantity() > availableQty) {
                throw new IllegalArgumentException("Not enough stock for item: " + item.getName());
            }

            // Create a new RequestItem from the CartItem.
            RequestItem requestItem = new RequestItem();
            requestItem.setItem(item);
            requestItem.setQuantity(cartItem.getQuantity());
            requestItems.add(requestItem);
        }

        // Find the "PENDING" status.
        RequestStatus pendingStatus = requestStatusRepository.findByName("PENDING")
                .orElseThrow(() -> new IllegalArgumentException("Request Status PENDING not found"));

        // Create a new Request entity.
        Request request = new Request();
        request.setUser(user); // Set the requester.
        request.setItems(new HashSet<>(requestItems)); // Set the items for the request.
        request.setSubmittedAt(new Timestamp(System.currentTimeMillis())); // Set submission timestamp.
        request.setRequestStatus(pendingStatus); // Set initial status to PENDING.
        requestItems.forEach(i -> i.setRequest(request)); // Link each request item back to the request.

        cart.getItems().clear(); // Clear the cart after submission to prevent resubmission of same items.


        // Find a storekeeper in the same department as the user to notify
        // Assuming findByDepartmentAndRole returns Optional<User> for robustness

        // Save the newly created request to the database.
        var savedRequest = requestRepository.save(request);

        // Map the saved request to a DTO for the response.
        var response = requestMapper.toRequestResponseDto(savedRequest);
        // Log the initial status change in the request's history.
        requestStatusHistoryService.saveStatusChange(savedRequest, pendingStatus, user, request.getSubmittedAt());

        // Attempt to find a storekeeper in the user's department to notify about the new request.
        // User's department is obtained via their office, as staff users don't have a direct department field.
        Optional<User> storekeeperOptional = userRepository.findByDepartmentAndRole(user.getOffice().getDepartment(), roleRepository.findByName("STOREKEEPER").orElseThrow());

        if (storekeeperOptional.isPresent()) {
            User storekeeper = storekeeperOptional.get();
            // Notify the storekeeper about the new request.
            notificationService.notifyWithRequest(
                    storekeeper,
                    "New Request Received",
                    user.getFullName() + " has submitted a new request",
                    NotificationType.NEW_REQUEST,
                    request, request.getSubmittedAt()
            );
        } else {
            // Log a warning if no storekeeper is found for the department.
            logger.warn("No storekeeper found in department {} to notify for new request.", user.getOffice().getDepartment().getName());
        }

        // Notify the requester about the successful submission of their request.
        notificationService
                .notifyWithRequest(user, "Request Submission", "Your request has been successfully submitted.", NotificationType.NEW_REQUEST, request, request.getSubmittedAt());

        return response;
    }

    /**
     * Fetches requests relevant to the authenticated user based on their role.
     * - STAFF users see requests they submitted.
     * - STOREKEEPER users see requests submitted by anyone in their department.
     *
     * @param userDetails The Spring Security UserDetails of the authenticated user.
     * @return A list of RequestResponseDto objects.
     * @throws EntityNotFoundException if the user is not found in the database.
     * @throws IllegalStateException if a storekeeper user does not have an associated department.
     */
    @Override
    public List<RequestResponseDto> getUserRequests(UserDetails userDetails) {
        // 1. Fetch the User entity, eagerly loading role, department, and office.department
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userDetails.getUsername()));

        List<Request> requests;

        // 2. Determine request fetching logic based on user role
        if (user.getRole() != null && "STOREKEEPER".equalsIgnoreCase(user.getRole().getName())) {
            // For Storekeepers: Fetch requests from their department
            Department storekeeperDepartment = user.getDepartment();

            if (storekeeperDepartment == null) {
                // Important: A storekeeper *should* always have a department.
                // Log this as a configuration error or return an empty list.
                throw new IllegalStateException("Department not found");
            }

            // Use the new custom query to fetch requests for the storekeeper's department
            requests = requestRepository.findRequestsForDepartment(storekeeperDepartment);
        } else {
            // For STAFF and other roles: Fetch requests submitted by themselves
            requests = requestRepository.findByUser(user);
        }

        // 3. Map the fetched Request entities to DTOs and return
        return requests.stream()
                .map(requestMapper::toRequestResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single request by its ID, performing authorization checks based on the current user's role.
     * A user can view a request if they are the requester, approver, fulfiller, or a storekeeper.
     *
     * @param id The ID of the request to retrieve.
     * @param userDetails The Spring Security UserDetails of the authenticated user attempting to view the request.
     * @return A RequestResponseDto representing the retrieved request.
     * @throws EntityNotFoundException if the current user is not found.
     * @throws IllegalArgumentException if the request with the given ID is not found.
     * @throws SecurityException if the current user is not authorized to view the request.
     */
    @Override
    public RequestResponseDto getRequestById(Long id, UserDetails userDetails) {
        // Retrieve the current authenticated user.
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("Current user not found."));

        // Retrieve the request by its ID.
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Request with ID " + id + " not found."));

        // Authorization check:
        // Check if the current user is the original requester.
        boolean isRequester = request.getUser().getId() == currentUser.getId();
        // Check if the current user is the approver of this request.
        boolean isApprover = request.getApprover() != null && request.getApprover().getId() == currentUser.getId();
        // Check if the current user is the fulfiller of this request.
        boolean isFulfiller = request.getFulfiller() != null && request.getFulfiller().getId() == currentUser.getId();
        // Corrected: Based on your User entity and Admin role clarification
        // Check if the current user has the "STOREKEEPER" role.
        boolean isStorekeeper = currentUser.getRole().getName().equals("STOREKEEPER");

        // Admin is explicitly excluded from viewing requests based on your clarification
        // If the user is none of the authorized roles, throw a SecurityException.
        if (!isRequester && !isApprover && !isFulfiller && !isStorekeeper) {
            throw new SecurityException("User is not authorized to view this request.");
        }

        // Ensure all lazy-loaded collections are initialized before mapping to DTO.
        // This prevents LazyInitializationException when the DTO mapper tries to access them.
        request.getItems().size(); // Forces loading of request items.
        request.getStatusHistory().size(); // Forces loading of status history.

        // Map the request entity to a DTO and return.
        return requestMapper.toRequestResponseDto(request);
    }
}
