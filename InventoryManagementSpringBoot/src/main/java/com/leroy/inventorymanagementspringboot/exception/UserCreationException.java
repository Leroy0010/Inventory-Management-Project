package com.leroy.inventorymanagementspringboot.exception;

public class UserCreationException extends RuntimeException{
    public  UserCreationException(String message){
        super(message);
    }
}
