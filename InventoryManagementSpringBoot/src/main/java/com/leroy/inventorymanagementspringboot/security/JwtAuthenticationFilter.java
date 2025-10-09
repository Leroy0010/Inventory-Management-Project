package com.leroy.inventorymanagementspringboot.security;

import com.leroy.inventorymanagementspringboot.util.CookieUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final CookieUtil cookieUtil;

    private final Logger logger = LogManager.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String jwt = cookieUtil.getJwtFromCookie(request).orElse(null);
        if (jwt != null) {
            logger.debug("JWT token found in cookie");
        }

        if (jwt == null) {
            final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                jwt = authHeader.substring(7);
                logger.debug("JWT token found in Authorization header");
            }
        }

        if (jwt == null) {
            // logger.debug("No JWT token found in cookies or Authorization header");
            filterChain.doFilter(request, response);
            return;
        }

        // logger.debug("JWT Received: {}", jwt);

        try {
            final String userEmail = jwtUtil.extractUsername(jwt);
            logger.debug("Extracted username from JWT: {}", userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                logger.debug("Loading user details for: {}", userEmail);
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                logger.debug("User details loaded successfully for: {}", userEmail);
                // Corrected code snippet from your JwtAuthenticationFilter
                if (jwtUtil.isTokenValid(jwt, userDetails)) {
                    logger.debug("JWT is valid. Building SecurityContext for {}", userEmail);

                    var claims = jwtUtil.extractAllClaims(jwt);

                    // Correctly cast the roles to List<String> to provide type information
                    @SuppressWarnings("unchecked")
                    List<String> roles = (List<String>) claims.get("roles");

                    if (roles == null) {
                        logger.warn("No 'roles' claim found in JWT for user: {}", userEmail);
                        // Fallback to database authorities if roles are not present in the token
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    } else {
                        // Now the stream operations are type-safe
                        var authorities = roles.stream()
                                .map(SimpleGrantedAuthority::new)
                                .collect(Collectors.toList());

                        logger.debug("Authorities from JWT for {}: {}", userEmail, authorities);

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null, authorities);
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                } else {
                    logger.warn("JWT is invalid for user: {}. Will not set SecurityContext.", userEmail);
                }
            }
        } catch (Exception e) {
            logger.error("JWT authentication failed: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }
}