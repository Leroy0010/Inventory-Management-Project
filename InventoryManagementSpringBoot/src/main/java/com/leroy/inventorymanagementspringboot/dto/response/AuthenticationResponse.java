package com.leroy.inventorymanagementspringboot.dto.response;


import lombok.Data;

@Data
public class AuthenticationResponse {

    private String firstName;
    private String email;
    private String role;
    private Integer id;
    private String lastName;
}

