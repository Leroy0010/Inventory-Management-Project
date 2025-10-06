package com.leroy.inventorymanagementspringboot.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

    @Value("${jwt.cookie.same-site:Strict}")
    private String cookieSameSite;

    /**
     * Create an HTTP-only cookie for JWT token
     */
    public void createJwtCookie(HttpServletResponse response, String token, int maxAge) {
        Cookie cookie = new Cookie(jwtCookieName, token);
        cookie.setMaxAge(maxAge);
        cookie.setPath(cookiePath);
        cookie.setHttpOnly(cookieHttpOnly);
        cookie.setSecure(cookieSecure);

        if (!cookieDomain.isEmpty()) {
            cookie.setDomain(cookieDomain);
        }

        // Build Set-Cookie header with conditional attributes
        StringBuilder header = new StringBuilder();
        header.append(jwtCookieName).append("=").append(token)
                .append("; Max-Age=").append(maxAge)
                .append("; Path=").append(cookiePath)
                .append("; SameSite=").append(cookieSameSite)
                .append("; HttpOnly");

        if (cookieSecure) {
            header.append("; Secure");
        }

        if (!cookieDomain.isEmpty()) {
            header.append("; Domain=").append(cookieDomain);
        }

        response.addHeader("Set-Cookie", header.toString());
    }

    /**
     * Create an HTTP-only cookie for refresh token
     */
    public void createRefreshTokenCookie(HttpServletResponse response, String refreshToken, int maxAge) {
        Cookie cookie = new Cookie(refreshTokenCookieName, refreshToken);
        cookie.setMaxAge(maxAge);
        cookie.setPath(cookiePath);
        cookie.setHttpOnly(cookieHttpOnly);
        cookie.setSecure(cookieSecure);

        if (!cookieDomain.isEmpty()) {
            cookie.setDomain(cookieDomain);
        }

        // Build Set-Cookie header with conditional attributes
        StringBuilder header = new StringBuilder();
        header.append(refreshTokenCookieName).append("=").append(refreshToken)
                .append("; Max-Age=").append(maxAge)
                .append("; Path=").append(cookiePath)
                .append("; SameSite=").append(cookieSameSite)
                .append("; HttpOnly");

        if (cookieSecure) {
            header.append("; Secure");
        }

        if (!cookieDomain.isEmpty()) {
            header.append("; Domain=").append(cookieDomain);
        }

        response.addHeader("Set-Cookie", header.toString());
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
        if (request.getCookies() == null) {
            return Optional.empty();
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> cookieName.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }

    /**
     * Clear JWT cookie
     */
    public void clearJwtCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(jwtCookieName, null);
        cookie.setMaxAge(0);
        cookie.setPath(cookiePath);
        cookie.setHttpOnly(cookieHttpOnly);
        cookie.setSecure(cookieSecure);

        if (!cookieDomain.isEmpty()) {
            cookie.setDomain(cookieDomain);
        }

        response.addCookie(cookie);
    }

    /**
     * Clear refresh token cookie
     */
    public void clearRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(refreshTokenCookieName, null);
        cookie.setMaxAge(0);
        cookie.setPath(cookiePath);
        cookie.setHttpOnly(cookieHttpOnly);
        cookie.setSecure(cookieSecure);

        if (!cookieDomain.isEmpty()) {
            cookie.setDomain(cookieDomain);
        }

        response.addCookie(cookie);
    }

    /**
     * Clear all authentication cookies
     */
    public void clearAllAuthCookies(HttpServletResponse response) {
        clearJwtCookie(response);
        clearRefreshTokenCookie(response);
    }
}
