
---

## 📁 `javafx-frontend/README.md`

```markdown
# 🖥️ Inventory Management System - Frontend (JavaFX)

This is the JavaFX-based desktop frontend for the Inventory Management System. It consumes APIs from the Spring Boot backend and provides a clean, responsive user interface with role-based navigation, WebSocket notifications, and dynamic form rendering.

---

## 💻 Technologies Used

- **JavaFX 24**
- **Scene Builder**
- **Ikonli** (FontAwesome icons)
- **FormsFX**
- **ControlsFX**
- **WebSocket Client (Java)**
- **Ikonli** (FontAwesome icons)
- **FormsFX, ControlsFX**
- **WebSocket Client (Java)**

---

## 🧱 Project Structure
```text InventoryManagementFx/ ├── src/ │ └── main/ │ ├── java/ │ │ └── com/ │ │ └── leroy/ │ │ └── inventorymanagementfx/ │ │ ├── admin/ │ │ ├── staff/ │ │ ├── storekeeper/ │ │ │ ├── AuthService.java │ │ │ ├── GeneralNotificationService.java │ │ │ ├── NotificationService.java │ │ │ ├── NotificationStompClient.java │ │ │ ├── PasswordResetService.java │ │ │ └── RequestService.java │ │ ├── util/ │ │ ├── InventoryApplication.java │ │ └── module-info.java │ └── resources/ │ ├── com/ │ │ └── leroy/ │ │ └── fxml/ │ │ ├── admin/ │ │ ├── common/ │ │ ├── component/ │ │ ├── staff/ │ │ └── storekeeper/ │ │ └── main.fxml │ ├── static/ │ ├── styles/ │ ├── config.properties │ └── log4j2.xml ├── .gitignore └── build.gradle ``` 
