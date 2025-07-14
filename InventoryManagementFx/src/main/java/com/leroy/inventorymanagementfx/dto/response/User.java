package com.leroy.inventorymanagementfx.dto.response;


// This class mimics relevant parts of your backend's User entity for mapping
public class User {
    private int id; // Assuming ID is a Long in backend User
    private String firstName;
    private String lastName;
    private String email; // Might be useful for debugging or other purposes
    private String officeName;
    private boolean active;


    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }
        
    

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOfficeName() {
        return officeName;
    }

    public void setOfficeName(String officeName) {
        this.officeName = officeName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
    
    public String toString(){
        return "Id: " + getId() + " , Office: " + getOfficeName();
    }
}
