# 🧾 Inventory Management System

- - -
A robust **desktop inventory management application** built with:

* **📦 JavaFX (Frontend)** for the user interface
* **🧠 Spring Boot (Backend)** for business logic, REST APIs, WebSocket notifications, and persistence
* **🗄 PostgreSQL** for database storage

This system supports multi-role access (Admin, Staff, Storekeeper) with authentication, notifications, and reporting.

---;

## 🧠 Features

### ✅ Common Features

* Authentication (Login, Logout, Reset Password)
* Role-based access control (Admin, Storekeeper, Staff)
* Real-time notifications (WebSocket)
* Centralized logging and error handling

### 📦 Storekeeper

* Submit and fulfill inventory requests
* Track issued/received items
* Department-level inventory reports

### 👨‍💼 Admin

* Manage users - other admins and storekeepers, roles, and departments

### 👷 Staff

* Submit item requests
* View status history and messages
* Dashboard for request insights

---;

## 🧩 Project Structure

### 📁 Backend — `InventoryManagementSpringBoot`

```text
InventoryManagementSpringBoot
├── src
│   ├── main
│   │   ├── java/com.leroy.inventorymanagementspringboot
│   │   │   ├── annotation
│   │   │   ├── aspect
│   │   │   ├── config
│   │   │   ├── controller
│   │   │   ├── converter
│   │   │   ├── dto
│   │   │   │   ├── report
│   │   │   │   ├── request
│   │   │   │   ├── response
│   │   │   │   └── websocket
│   │   │   ├── entity
│   │   │   ├── enums
│   │   │   ├── exception
│   │   │   ├── job
│   │   │   ├── mapper
│   │   │   ├── repository
│   │   │   ├── security
│   │   │   ├── service
│   │   │   ├── servicei
│   │   │   ├── strategy
│   │   │   └── util
│   ├── resources
│   │   ├── application.yml
│   │   ├── logback.xml
│   │   └── static/
├── db.sql
├── Dockerfile
├── compose.yaml
└── build.gradle
- - -

---

### 🎨 Frontend — `InventoryManagementFx`

```text
InventoryManagementFx
├── src
│   └── main
│       ├── java/com.leroy.inventorymanagementfx
│       │   ├── admin
│       │   ├── staff
│       │   ├── storekeeper
│       │   │   ├── AuthService.java
│       │   │   ├── NotificationService.java
│       │   │   ├── PasswordResetService.java
│       │   │   └── RequestService.java
│       │   ├── util
│       │   ├── InventoryApplication.java
│       │   └── module-info.java
│       └── resources
│           ├── com.leroy.fxml
│           │   ├── admin
│           │   ├── common
│           │   ├── component
│           │   ├── staff
│           │   └── storekeeper
│           │       └── main.fxml
│           ├── static
│           ├── styles
│           ├── config.properties
│           └── log4j2.xml
├── build.gradle
```

---;

## 🚀 How to Run

### 📦 Backend (Spring Boot)

#### Prerequisites

* Java 21+
* Gradle 8+
* PostgreSQL (configured in `application.yml`)
* Docker (optional)

#### Run locally

```bash
# From project root
./gradlew bootRun
```

Or use Docker Compose:

```bash
docker-compose up --build
```

The API will be available at `http://localhost:8080`

---;

### 💻 Frontend (JavaFX)

#### Prerequisites (Frontend)

* JavaFX SDK 17+ or 24
* Gradle
* IntelliJ with JavaFX plugin recommended

#### Run in IntelliJ

1. Open `InventoryManagementFx`
2. Set VM options in Run Config:

```text
--module-path "path/to/javafx-sdk/lib" --add-modules javafx.controls,javafx.fxml
```

1. Run `InventoryApplication.java`
   Make sure icons and styles are on the classpath.

---;

## 🛠 Technologies Used

| Layer       | Tech Stack                                   |
| ----------- | -------------------------------------------- |
| Frontend    | JavaFX 17/24, FXML, Ikonli, Log4j2           |
| Backend     | Spring Boot 3, Spring Security, WebSocket    |
| DB          | PostgreSQL                                   |
| Build Tools | Gradle, Docker, Compose                      |
| Others      | Logback, ValidatorFX, TilesFX, Scene Builder |

---;

## 🔐 Security

* Passwords hashed using BCrypt
* JWT token support (future)
* Role-based method-level access
* CSRF Protection (Spring Security)

---;

## 📊 Reporting

* Strategy pattern for Inventory Summary (FIFO / Average Cost)
* Monthly/Yearly/Custom reports per department or item
* User-level report filters and audit logs

---;

## 🧪 Testing

* Unit tests with JUnit 5
* Spring Boot Integration tests
* Log4j2 test logging

---;

## 📦 Build & Package

### Backend

```bash
./gradlew clean build
```

### Frontend

```bash
./gradlew jlink
```

---;

## 📁 Deployment

* Use Docker Compose for PostgreSQL + Spring Boot
* Package JavaFX app with `jlink` for native-like experience

---;

## 🙌 Credits

Developed by **Leroy Dennis Aidoo**
Mentored, reviewed, and improved with ❤️ using Java best practices.

---;
