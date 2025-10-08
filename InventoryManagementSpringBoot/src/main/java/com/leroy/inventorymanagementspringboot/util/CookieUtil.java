package com.leroy.inventorymanagementspringboot.util;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;


@Component
public class CookieUtil {

    @Value("${jwt.cookie.name:jwt}")
    private String jwtCookieName;

    @Value("${jwt.refresh.cookie.name:refreshToken}")
    private String refreshTokenCookieName;

    @Value("${jwt.cookie.domain:}")
    private String cookieDomain;

    @Value("${jwt.cookie.path:/}")
    private String cookiePath;

    @Value("${jwt.cookie.secure:true}")
    private boolean cookieSecure;

    @Value("${jwt.cookie.http-only:true}")
    private boolean cookieHttpOnly;

    @Value("${jwt.cookie.same-site:None}")
    private String cookieSameSite;

    private final Logger logger = LogManager.getLogger(CookieUtil.class);

    /**
     * Create an HTTP-only cookie for JWT token using manual Set-Cookie header
     */
    public void createJwtCookie(HttpServletResponse response, String token, int maxAge) {
        validateToken(token);

        logger.info("Creating JWT Cookie - Domain: {}, Path: {}, Secure: {}, HttpOnly: {}, SameSite: {}, MaxAge: {}",
                cookieDomain, cookiePath, cookieSecure, cookieHttpOnly, cookieSameSite, maxAge);

        String cookieHeader = buildCookieHeader(jwtCookieName, token, maxAge);
        response.addHeader("Set-Cookie", cookieHeader);

        logger.debug("Set-Cookie header: {}", cookieHeader);
    }

    /**
     * Create an HTTP-only cookie for refresh token
     */
    public void createRefreshTokenCookie(HttpServletResponse response, String refreshToken, int maxAge) {
        validateToken(refreshToken);

        logger.info("Creating Refresh Token Cookie - Domain: {}, Path: {}, Secure: {}, HttpOnly: {}, SameSite: {}, MaxAge: {}",
                cookieDomain, cookiePath, cookieSecure, cookieHttpOnly, cookieSameSite, maxAge);

        String cookieHeader = buildCookieHeader(refreshTokenCookieName, refreshToken, maxAge);
        response.addHeader("Set-Cookie", cookieHeader);

        logger.debug("Set-Cookie header: {}", cookieHeader);
    }

    /**
     * Build consistent Set-Cookie header
     */
    private String buildCookieHeader(String name, String value, int maxAge) {
        StringBuilder header = new StringBuilder();
        header.append(name).append("=").append(value)
                .append("; Max-Age=").append(maxAge)
                .append("; Path=").append(cookiePath);

        if (cookieHttpOnly) {
            header.append("; HttpOnly");
        }

        if (cookieSameSite != null && !cookieSameSite.isEmpty()) {
            header.append("; SameSite=").append(cookieSameSite);
        }

        if (cookieSecure) {
            header.append("; Secure");
        }

        if (cookieDomain != null && !cookieDomain.trim().isEmpty()) {
            header.append("; Domain=").append(cookieDomain.trim());
        }

        return header.toString();
    }

    /**
     * Clear JWT cookie
     */
    public void clearJwtCookie(HttpServletResponse response) {
        logger.info("Clearing JWT cookie");
        String clearHeader = buildClearCookieHeader(jwtCookieName);
        response.addHeader("Set-Cookie", clearHeader);
    }

    /**
     * Clear refresh token cookie
     */
    public void clearRefreshTokenCookie(HttpServletResponse response) {
        logger.info("Clearing refresh token cookie");
        String clearHeader = buildClearCookieHeader(refreshTokenCookieName);
        response.addHeader("Set-Cookie", clearHeader);
    }

    /**
     * Build cookie clearing header
     */
    private String buildClearCookieHeader(String name) {
        StringBuilder header = new StringBuilder();
        header.append(name).append("=deleted")
                .append("; Max-Age=0")
                .append("; Path=").append(cookiePath);

        if (cookieHttpOnly) {
            header.append("; HttpOnly");
        }

        if (cookieSameSite != null && !cookieSameSite.isEmpty()) {
            header.append("; SameSite=").append(cookieSameSite);
        }

        if (cookieSecure) {
            header.append("; Secure");
        }

        if (cookieDomain != null && !cookieDomain.trim().isEmpty()) {
            header.append("; Domain=").append(cookieDomain.trim());
        }

        return header.toString();
    }

    /**
     * Clear all authentication cookies
     */
    public void clearAllAuthCookies(HttpServletResponse response) {
        clearJwtCookie(response);
        clearRefreshTokenCookie(response);
        logger.info("Cleared all authentication cookies");
    }

    /**
     * Get JWT token from cookie
     */
    public Optional<String> getJwtFromCookie(HttpServletRequest request) {
        return getCookieValue(request, jwtCookieName);
    }

    /**
     * Get refresh token from cookie
     */
    public Optional<String> getRefreshTokenFromCookie(HttpServletRequest request) {
        return getCookieValue(request, refreshTokenCookieName);
    }

    /**
     * Get cookie value by name
     */
    private Optional<String> getCookieValue(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return Optional.empty();
        }

        return Arrays.stream(cookies)
                .filter(cookie -> cookieName.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }

    /**
     * Validate token is not null or empty
     */
    private void validateToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token cannot be null or empty");
        }
    }

    // Temporary debug method in CookieUtil
    @PostConstruct
    public void debugProperties() {
        logger.debug("JWT Cookie Name: {}", jwtCookieName);
        logger.debug("Refresh Cookie Name: {}", refreshTokenCookieName);
        logger.debug("Cookie Domain: '{}'", cookieDomain);
        logger.debug("Cookie Path: {}", cookiePath);
        logger.debug("Cookie Secure: {}", cookieSecure);
        logger.debug("Cookie HttpOnly: {}", cookieHttpOnly);
        logger.debug("Cookie SameSite: {}", cookieSameSite);
    }
}