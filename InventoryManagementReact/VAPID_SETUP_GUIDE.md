# VAPID Keys Setup Guide

## 🔑 Your Generated VAPID Keys

**Public Key (Frontend):**

```
BEqA-s8JXB450K8KblHvwC0l2oOLviV7_zh8ntpmTzKoGv7vAASqTpbgoENGqLCL2wUrvSLopkLfOEabvH1XU_8
```

**Private Key (Backend):**

```
Unp26wQzoZWGzTGD_7o8Jjfve95oFRm5wt3jYS_hrZs
```

## 📋 Setup Instructions

### 1. Frontend Configuration (React)

#### Option A: Environment Variables (Recommended)

Create a `.env.local` file in the React project root:

```bash
# .env.local
VITE_VAPID_PUBLIC_KEY=BEqA-s8JXB450K8KblHvwC0l2oOLviV7_zh8ntpmTzKoGv7vAASqTpbgoENGqLCL2wUrvSLopkLfOEabvH1XU_8
```

#### Option B: Direct Code Update (Already Done)

The keys have been hardcoded in the service worker manager as fallback values.

### 2. Backend Configuration (Spring Boot)

#### Step 1: Add Dependencies

Add to `pom.xml`:

```xml
<dependency>
    <groupId>nl.martijndwars</groupId>
    <artifactId>web-push</artifactId>
    <version>5.1.1</version>
</dependency>
```

#### Step 2: Create VAPID Configuration

Create `src/main/java/com/leroy/inventorymanagementspringboot/config/VapidConfig.java`:

```java
package com.leroy.inventorymanagementspringboot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import nl.martijndwars.webpush.PushService;

@Configuration
public class VapidConfig {

    @Value("${vapid.private.key:Unp26wQzoZWGzTGD_7o8Jjfve95oFRm5wt3jYS_hrZs}")
    private String vapidPrivateKey;

    @Value("${vapid.public.key:BEqA-s8JXB450K8KblHvwC0l2oOLviV7_zh8ntpmTzKoGv7vAASqTpbgoENGqLCL2wUrvSLopkLfOEabvH1XU_8}")
    private String vapidPublicKey;

    @Bean
    public PushService pushService() {
        return new PushService(vapidPublicKey, vapidPrivateKey);
    }
}
```

#### Step 3: Add to application.yml

Add to `src/main/resources/application.yml`:

```yaml
vapid:
    private:
        key: Unp26wQzoZWGzTGD_7o8Jjfve95oFRm5wt3jYS_hrZs
    public:
        key: BEqA-s8JXB450K8KblHvwC0l2oOLviV7_zh8ntpmTzKoGv7vAASqTpbgoENGqLCL2wUrvSLopkLfOEabvH1XU_8
```

#### Step 4: Create Push Notification Service

Create `src/main/java/com/leroy/inventorymanagementspringboot/service/PushNotificationService.java`:

```java
package com.leroy.inventorymanagementspringboot.service;

import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class PushNotificationService {

    @Autowired
    private PushService pushService;

    @Autowired
    private ObjectMapper objectMapper;

    public void sendNotification(Subscription subscription, String title, String message) {
        try {
            String payload = objectMapper.writeValueAsString(Map.of(
                "title", title,
                "message", message,
                "url", "/notifications"
            ));

            pushService.send(subscription, payload);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

#### Step 5: Create Subscription Endpoint

Create `src/main/java/com/leroy/inventorymanagementspringboot/controller/PushNotificationController.java`:

```java
package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.service.PushNotificationService;
import nl.martijndwars.webpush.Subscription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class PushNotificationController {

    @Autowired
    private PushNotificationService pushNotificationService;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody SubscriptionRequest request) {
        // Store subscription in database
        // Return success response
        return ResponseEntity.ok().build();
    }

    @PostMapping("/test")
    public ResponseEntity<?> testNotification(@RequestBody SubscriptionRequest request) {
        Subscription subscription = new Subscription(
            request.getEndpoint(),
            request.getKeys().getP256dh(),
            request.getKeys().getAuth()
        );

        pushNotificationService.sendNotification(
            subscription,
            "Test Notification",
            "This is a test notification from the inventory management system"
        );

        return ResponseEntity.ok().build();
    }
}
```

### 3. Database Schema

Create a table to store push subscriptions:

```sql
CREATE TABLE push_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    endpoint TEXT NOT NULL,
    p256dh_key TEXT NOT NULL,
    auth_key TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4. Testing the Setup

#### Frontend Test:

1. Go to `/notification-test` page
2. Enable background notifications
3. Send test notification
4. Check browser console for subscription details

#### Backend Test:

1. Use the subscription data from frontend
2. Send a test notification via the `/api/notifications/test` endpoint
3. Verify notification appears

### 5. Security Considerations

- ✅ **Public Key**: Safe to expose in frontend code
- ❌ **Private Key**: NEVER expose in frontend, only use on server
- 🔒 **HTTPS Required**: Push notifications only work over HTTPS
- 🔐 **User Consent**: Always request permission before subscribing

### 6. Production Deployment

1. **Environment Variables**: Use environment variables for keys in production
2. **HTTPS**: Ensure your production domain uses HTTPS
3. **Database**: Store subscriptions securely in your database
4. **Monitoring**: Monitor push notification delivery rates
5. **Fallback**: Implement fallback mechanisms for failed notifications

## 🚀 Next Steps

1. Set up the backend push notification service
2. Test with real notifications
3. Integrate with your existing notification system
4. Deploy to production with HTTPS

## 📚 Additional Resources

- [Web Push Protocol](https://tools.ietf.org/html/rfc8030)
- [VAPID Specification](https://tools.ietf.org/html/rfc8292)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
