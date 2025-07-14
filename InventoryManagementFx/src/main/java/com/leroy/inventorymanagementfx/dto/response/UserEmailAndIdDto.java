package com.leroy.inventorymanagementfx.dto.response;



/**
 * DTO for user ID and Name, used for populating user selection.
 */
public class UserEmailAndIdDto {
    private Integer id;
    private String email;

    // Default constructor for Jackson
    public UserEmailAndIdDto() {
    }


    public UserEmailAndIdDto(Integer id, String email) {
        this.id = id;
        this.email = email;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return email;
    }
}
