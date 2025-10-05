package com.leroy.inventorymanagementspringboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

/**
 * JDBC Session Configuration for PostgreSQL
 * 
 * This configuration enables JDBC-based session storage using PostgreSQL
 * database.
 * Sessions are stored in the spring_session table which is automatically
 * created.
 * 
 * Benefits over in-memory sessions:
 * - Sessions persist across application restarts
 * - OAuth2 authorization requests are properly maintained
 * - Better for production environments
 */
@Configuration
@EnableJdbcHttpSession(maxInactiveIntervalInSeconds = 1800) // 30 minutes
public class JdbcSessionConfig {

    /**
     * Configure cookie serializer for cross-domain OAuth2 support
     * 
     * @return CookieSerializer with proper settings for HTTPS and cross-domain
     */
    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();

        // Cookie settings for OAuth2 cross-domain support
        serializer.setCookieName("JSESSIONID");
        serializer.setUseHttpOnlyCookie(true);
        serializer.setUseSecureCookie(true);
        serializer.setSameSite("None");
        serializer.setCookieMaxAge(1800); // 30 minutes
        serializer.setCookiePath("/");

        // Domain setting (will be set via environment variable)
        String cookieDomain = System.getenv("COOKIE_DOMAIN");
        if (cookieDomain != null && !cookieDomain.isEmpty()) {
            serializer.setDomainNamePattern(cookieDomain);
        }

        return serializer;
    }
}

