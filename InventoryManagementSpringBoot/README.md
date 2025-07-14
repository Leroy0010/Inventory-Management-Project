# 📦 Inventory Management System - Backend (Spring Boot)

This is the backend service for the Inventory Management System. It provides RESTful APIs for managing inventory, users, authentication, audit logs, notifications, and reporting. The system supports role-based access control, cost flow strategies (FIFO, Average Weighted), and inventory transaction auditing.

---

## 🚀 Technologies Used

- **Java 21**
  
- **Spring Boot 3.x**
- **Spring Security + JWT**
- **Spring Data JPA + Hibernate**
- **PostgreSQL**
- **Liquibase** (DB migrations)
- **Lombok**
- **WebSocket** (for real-time notifications)
- **Log4j2** (for advanced logging)
- **JUnit & Mockito** (for testing)

---

## 📁 Project Structure (Spring Boot Backend)

The project is structured for scalability, modularity, and clarity. Below is the layout:

```text src/
└── main/
├── java/
│ └── com.leroy.inventorymanagementspringboot/
│ ├── annotation/ # Custom annotations (e.g., @Auditable)
│ ├── aspect/ # AOP logging, auditing, etc.
│ ├── config/ # Configuration (Security, JWT, Swagger)
│ ├── controller/ # REST API endpoints
│ ├── converter/ # DTO <-> Entity converters
│ ├── dto/
│ │ ├── request/ # Request DTOs
│ │ ├── response/ # Response DTOs
│ │ └── websocket/ # WebSocket DTOs
│ ├── entity/ # JPA entities
│ ├── enums/ # Enum types
│ ├── exception/ # Exception handlers and classes
│ ├── job/ # Scheduled tasks
│ ├── mapper/ # MapStruct or manual mappers
│ ├── repository/ # Spring Data JPA repositories
│ ├── security/ # JWT filters, providers, user details
│ ├── service/ # Business logic implementations
│ ├── servicei/ # Service interfaces
│ ├── strategy/ # Inventory strategy (FIFO, Avg)
│ └── util/ # Utilities and helpers
│
└── resources/
├── application.yml # Spring Boot config
├── db.sql # Initial SQL
└── ...
docker/
├── Dockerfile                      # Docker container definition
├── compose.yaml                    # Docker Compose for multi-service setup
```
