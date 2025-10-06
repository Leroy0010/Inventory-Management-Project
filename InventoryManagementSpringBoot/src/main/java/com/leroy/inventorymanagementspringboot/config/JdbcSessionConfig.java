package com.leroy.inventorymanagementspringboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

/**
 * JDBC Session Configuration for PostgreSQL
 * <p>
 * This configuration enables JDBC-based session storage using PostgreSQL
 * database.
 * Sessions are stored in the spring_session table which is automatically
 * created.
 * <p>
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

        // Cookie settings (configurable via environment variables)
        serializer.setCookieName("JSESSIONID");
        serializer.setUseHttpOnlyCookie(true);

        // Respect environment flags for dev/prod
        boolean secure = Boolean.parseBoolean(System.getenv().getOrDefault("COOKIE_SECURE", "true"));
        String sameSite = System.getenv().getOrDefault("COOKIE_SAME_SITE", "LAX");

        serializer.setUseSecureCookie(secure);
        serializer.setSameSite(sameSite);
        serializer.setCookieMaxAge(1800); // 30 minutes
        serializer.setCookiePath("/");

        // Domain setting (env-driven). If it's a plain hostname like 'localhost',
        // set as fixed domain; if it looks like a regex with capture groups, use
        // pattern.
        String cookieDomain = System.getenv("COOKIE_DOMAIN");
        if (cookieDomain != null && !cookieDomain.isEmpty()) {
            String trimmed = cookieDomain.trim();
            boolean looksLikeRegexWithGroup = trimmed.contains("(") && trimmed.contains(")");
            if (looksLikeRegexWithGroup) {
                serializer.setDomainNamePattern(trimmed);
            } else {
                serializer.setDomainName(trimmed);
            }
        }

        return serializer;
    }
}
