// Simple test to verify JDBC session configuration
// This file will be deleted after testing

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;

@SpringBootApplication
@EnableJdbcHttpSession
public class TestJdbcSession {
    public static void main(String[] args) {
        System.setProperty("spring.profiles.active", "prod");
        System.setProperty("spring.datasource.url", "jdbc:h2:mem:testdb");
        System.setProperty("spring.datasource.username", "sa");
        System.setProperty("spring.datasource.password", "");
        System.setProperty("spring.datasource.driver-class-name", "org.h2.Driver");
        
        try {
            SpringApplication.run(TestJdbcSession.class, args);
            System.out.println("✅ JDBC Session configuration test PASSED");
            System.exit(0);
        } catch (Exception e) {
            System.err.println("❌ JDBC Session configuration test FAILED: " + e.getMessage());
            System.exit(1);
        }
    }
}

