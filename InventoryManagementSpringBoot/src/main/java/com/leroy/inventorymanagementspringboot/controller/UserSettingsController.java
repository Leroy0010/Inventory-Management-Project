package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.settings.UserSettingsDto;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.service.UserSettingsService;
import com.leroy.inventorymanagementspringboot.validation.SettingsValidator;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@Slf4j
@Validated
public class UserSettingsController {

    private final UserSettingsService userSettingsService;
    private final SettingsValidator settingsValidator;
    private final UserRepository userRepository;

    /**
     * Get current user's settings
     * Access: All authenticated users
     */
    @GetMapping
    public ResponseEntity<UserSettingsDto> getUserSettings(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Integer userId = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new EntityNotFoundException("User not found")).getId();
            log.debug("Getting settings for user ID: {}", userId);

            return userSettingsService.getUserSettings(userId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            log.warn("Invalid user ID in authentication: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error getting user settings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get user settings by user ID (admin only)
     * Access: ADMIN, STOREKEEPER roles only
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STOREKEEPER')")
    public ResponseEntity<UserSettingsDto> getUserSettingsById(
            @PathVariable Integer userId) {
        try {
            validateUserId(userId);
            log.debug("Getting settings for user ID: {} by admin", userId);

            return userSettingsService.getUserSettings(userId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            log.warn("Invalid user ID: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error getting user settings by ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create or update user settings
     * Access: All authenticated users
     */
    @PostMapping
    public ResponseEntity<UserSettingsDto> saveUserSettings(
            @Valid @RequestBody UserSettingsDto settingsDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Integer userId = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new EntityNotFoundException("User not found")).getId();
            log.debug("Saving settings for user ID: {}", userId);

            // Validate settings before saving
            List<String> validationErrors = settingsValidator.validateUserSettings(settingsDto);
            if (!validationErrors.isEmpty()) {
                log.warn("Validation errors for user {}: {}", userId, validationErrors);
                return ResponseEntity.badRequest().build();
            }

            UserSettingsDto savedSettings = userSettingsService.saveUserSettings(userId, settingsDto);
            return ResponseEntity.ok(savedSettings);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid user ID in authentication: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error saving user settings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update specific settings category
     * Access: All authenticated users
     */
    @PatchMapping("/{category}")
    public ResponseEntity<UserSettingsDto> updateSettingsCategory(
            @PathVariable String category,
            @RequestBody Map<String, Object> categorySettings,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Integer userId = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new EntityNotFoundException("User not found")).getId();
            log.debug("Updating {} settings for user ID: {}", category, userId);

            // Validate category settings
            List<String> validationErrors = settingsValidator.validateCategorySettings(category, categorySettings);
            if (!validationErrors.isEmpty()) {
                log.warn("Validation errors for category {}: {}", category, validationErrors);
                return ResponseEntity.badRequest().build();
            }

            UserSettingsDto updatedSettings = userSettingsService.updateSettingsCategory(
                    userId, category, categorySettings);
            return ResponseEntity.ok(updatedSettings);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid settings category: {}", category);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error updating settings category: {}", category, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Reset user settings to defaults
     * Access: All authenticated users
     */
    @PostMapping("/reset")
    public ResponseEntity<UserSettingsDto> resetToDefaults(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Integer userId = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new EntityNotFoundException("User not found")).getId();
            log.debug("Resetting settings to defaults for user ID: {}", userId);

            UserSettingsDto defaultSettings = userSettingsService.resetToDefaults(userId);
            return ResponseEntity.ok(defaultSettings);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid user ID in authentication: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error resetting user settings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete user settings
     * Access: All authenticated users (own settings only)
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteUserSettings(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Integer userId = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new EntityNotFoundException("User not found")).getId();
            log.debug("Deleting settings for user ID: {}", userId);

            userSettingsService.deleteUserSettings(userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.warn("Invalid user ID in authentication: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error deleting user settings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Check if user has settings
     * Access: All authenticated users
     */
    @GetMapping("/exists")
    public ResponseEntity<Map<String, Boolean>> hasUserSettings(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Integer userId = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new EntityNotFoundException("User not found")).getId();
            boolean exists = userSettingsService.hasUserSettings(userId);

            return ResponseEntity.ok(Map.of("exists", exists));
        } catch (IllegalArgumentException e) {
            log.warn("Invalid user ID in authentication: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error checking if user has settings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get settings statistics (admin only)
     * Access: ADMIN role only
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSettingsStatistics() {
        try {
            log.debug("Getting settings statistics for admin user");

            // This would be implemented to return statistics about user settings
            // For now, return a placeholder response
            Map<String, Object> stats = Map.of(
                    "totalUsers", 0,
                    "themes", Map.of(),
                    "languages", Map.of(),
                    "notifications", Map.of());

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error getting settings statistics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Bulk update settings for multiple users (admin only)
     * Access: ADMIN role only
     */
    @PostMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> bulkUpdateSettings(
            @RequestBody Map<String, Object> bulkUpdateRequest) {
        try {
            log.debug("Bulk update settings requested by admin");

            // This would be implemented for bulk operations
            // For now, return a placeholder response
            Map<String, Object> result = Map.of(
                    "updated", 0,
                    "failed", 0,
                    "message", "Bulk update not implemented yet");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error in bulk update settings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Export user settings
     * Access: All authenticated users
     */
    @GetMapping("/export")
    public ResponseEntity<Map<String, Object>> exportUserSettings(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Integer userId = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new EntityNotFoundException("User not found")).getId();
            log.debug("Exporting settings for user ID: {}", userId);

            return userSettingsService.getUserSettings(userId)
                    .map(settings -> ResponseEntity.ok(Map.<String, Object>of("settings", settings)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            log.warn("Invalid user ID in authentication: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error exporting user settings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Import user settings
     * Access: All authenticated users
     */
    @PostMapping("/import")
    public ResponseEntity<UserSettingsDto> importUserSettings(
            @RequestBody Map<String, Object> importData,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Integer userId = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new EntityNotFoundException("User not found")).getId();
            log.debug("Importing settings for user ID: {}", userId);

            // This would parse the import data and create/update settings
            // For now, return a placeholder response
            return ResponseEntity.badRequest().build();
        } catch (IllegalArgumentException e) {
            log.warn("Invalid user ID in authentication: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error importing user settings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ===== PRIVATE HELPER METHODS =====

    /**
     * Validate user ID parameter
     * 
     * @param userId User ID to validate
     * @throws IllegalArgumentException if user ID is invalid
     */
    private void validateUserId(Integer userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Invalid user ID: " + userId);
        }
    }

    /**
     * Check if user has permission to access another user's settings
     * 
     * @param targetUserId   Target user ID
     * @param currentUserId  Current user ID
     * @param authentication Authentication context
     * @return true if access is allowed
     */
    private boolean canAccessUserSettings(Integer targetUserId, Integer currentUserId, Authentication authentication) {
        // Users can always access their own settings
        if (targetUserId.equals(currentUserId)) {
            return true;
        }

        // Check if current user has admin or storekeeper role
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "ADMIN".equals(authority.getAuthority()) ||
                        "STOREKEEPER".equals(authority.getAuthority()));
    }
}
