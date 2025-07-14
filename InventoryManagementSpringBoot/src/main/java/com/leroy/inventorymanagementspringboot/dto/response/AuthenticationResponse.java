package com.leroy.inventorymanagementspringboot.dto.response;


import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AuthenticationResponse {
    private String jwt;
    private Integer userId;
    private String email;
    private String firstName;
    private String role;

}



