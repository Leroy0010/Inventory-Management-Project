package com.leroy.inventorymanagementfx.dto.response;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class AuthenticationResponse {

    private final String jwt;
    private final Integer userId;
    private final String email;
    private final String firstName;
    private final String role;

    @JsonCreator
    public AuthenticationResponse(
            @JsonProperty("jwt") String jwt,
            @JsonProperty("userId") Integer userId,
            @JsonProperty("email") String email,
            @JsonProperty("firstName") String firstName,
            @JsonProperty("role") String role) {
        this.jwt = jwt;
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.role = role;
    }

    public String getJwt() {
        return jwt;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getRole() {
        return role;
    }

    @Override
    public String toString() {
        return "AuthenticationResponse{" +
                "jwt='" + (jwt != null ? jwt.substring(0, Math.min(jwt.length(), 15)) + "..." : "null") + '\'' +
                ", userId=" + userId +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}

