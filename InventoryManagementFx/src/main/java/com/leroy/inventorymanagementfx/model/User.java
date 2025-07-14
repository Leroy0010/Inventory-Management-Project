package com.leroy.inventorymanagementfx.model;

import javafx.beans.property.IntegerProperty;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;

public class User {
    private final StringProperty name = new SimpleStringProperty();
    private final StringProperty email = new SimpleStringProperty();
    private final IntegerProperty age = new SimpleIntegerProperty();

    // Default constructor
    public User() {
        this("", "", 0);
    }

    // Full constructor
    public User(String name, String email, int age) {
        this.name.set(name);
        this.email.set(email);
        this.age.set(age);
    }

    // Name property methods
    public String getName() {
        return name.get();
    }

    public void setName(String name) {
        this.name.set(name);
    }

    public StringProperty nameProperty() {
        return name;
    }

    // Email property methods
    public String getEmail() {
        return email.get();
    }

    public void setEmail(String email) {
        this.email.set(email);
    }

    public StringProperty emailProperty() {
        return email;
    }

    // Age property methods
    public int getAge() {
        return age.get();
    }

    public void setAge(int age) {
        this.age.set(age);
    }

    public IntegerProperty ageProperty() {
        return age;
    }

    @Override
    public String toString() {
        return "User{" +
                "name=" + getName() +
                ", email=" + getEmail() +
                ", age=" + getAge() +
                '}';
    }
}