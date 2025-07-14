package com.leroy.inventorymanagementspringboot.controller;


import com.leroy.inventorymanagementspringboot.dto.request.AuthenticationRequest;
import com.leroy.inventorymanagementspringboot.dto.request.PasswordChangeRequest;
import com.leroy.inventorymanagementspringboot.dto.request.PasswordResetRequest;
import com.leroy.inventorymanagementspringboot.exception.InvalidTokenException;
import com.leroy.inventorymanagementspringboot.mapper.UserMapper;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.security.JwtUtil;
import com.leroy.inventorymanagementspringboot.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthenticationManager authenticationManager, UserDetailsService userDetailsService, JwtUtil jwtUtil, UserRepository userRepository, UserMapper userMapper, PasswordResetService passwordResetService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordResetService = passwordResetService;
    }


    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            final UserDetails userDetails = userDetailsService
                    .loadUserByUsername(request.getEmail());
            final String jwt = jwtUtil.generateToken(userDetails);
            var user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new BadCredentialsException("Invalid username or password"));
            var authResponse = userMapper.toAuthenticationResponse(user);
            authResponse.setJwt(jwt);
            return ResponseEntity.ok(authResponse);
        } catch (BadCredentialsException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Authentication error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody PasswordResetRequest request) {
        try {
            passwordResetService.createPasswordResetTokenForUser(request.getEmail());
            // Return a generic success message to prevent email enumeration attacks
            return ResponseEntity.ok("If an account with that email exists, a password reset link has been sent.");
        } catch (RuntimeException e) { // Catch the generic exception for non-existent users
            return ResponseEntity.ok("If an account with that email exists, a password reset link has been sent.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing request: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody PasswordChangeRequest request) {
        try {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok("Password has been reset successfully.");
        } catch (InvalidTokenException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error resetting password: " + e.getMessage());
        }
    }
}
