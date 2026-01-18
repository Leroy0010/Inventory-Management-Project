package com.leroy.inventorymanagementspringboot.config;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.leroy.inventorymanagementspringboot.security.JwtAuthenticationFilter;
import com.leroy.inventorymanagementspringboot.security.OAuth2AuthenticationFailureHandler;
import com.leroy.inventorymanagementspringboot.security.OAuth2AuthenticationSuccessHandler;
import com.leroy.inventorymanagementspringboot.service.CustomUserDetailService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    private final CustomUserDetailService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final OAuth2AuthenticationSuccessHandler oauth2SuccessHandler;
    private final OAuth2AuthenticationFailureHandler oauth2FailureHandler;

    private static final Logger logger = LogManager.getLogger(SecurityConfig.class);


    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @SuppressWarnings("deprecation")
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(authenticationProvider());
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow specific origins
        configuration.setAllowedOriginPatterns(List.of(
                frontendBaseUrl,
                "http://localhost:5173",
                "https://*.vercel.app",
                "https://*.netlify.app"));

        // Allow all HTTP methods including PATCH
        configuration.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));

        // Explicitly allow common headers including Content-Type
        configuration.setAllowedHeaders(List.of(
                "Accept",
                "Accept-Language",
                "Content-Language",
                "Content-Type",
                "Authorization", // CRITICAL for JWT
                "X-Requested-With",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers",
                "Cache-Control",
                "Pragma",
                "Expires",
                "Last-Modified",
                "If-Modified-Since",
                "X-XSRF-TOKEN"));

        // Allow credentials (necessary if you are using cookies/session, but still safe for JWT)
        configuration.setAllowCredentials(true);

        // Expose headers
        configuration.setExposedHeaders(List.of(
                "X-XSRF-TOKEN",
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials",
                "Access-Control-Allow-Headers",
                "Access-Control-Allow-Methods"));

        // Cache preflight for 1 hour
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        logger.info("CORS configuration applied:");
        logger.info("  Allowed Origins: {}", configuration.getAllowedOriginPatterns());
        logger.info("  Allowed Methods: {}", configuration.getAllowedMethods());
        logger.info("  Allowed Headers: {}", configuration.getAllowedHeaders());
        logger.info("  Allow Credentials: {}", configuration.getAllowCredentials());
        logger.info("  Exposed Headers: {}", configuration.getExposedHeaders());
        logger.info("  Max Age: {}", configuration.getMaxAge());

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CORS configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // CSRF protection disabled - using JWT tokens for authentication
                .csrf(AbstractHttpConfigurer::disable)

                // OAuth2 configuration
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/oauth2/authorization/google")
                        .successHandler(oauth2SuccessHandler)
                        .failureHandler(oauth2FailureHandler))

                // Authorization rules
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/actuator/health",
                                "/actuator/health/**",
                                "/actuator/info",
                                "/actuator/prometheus",
                                "/api/health/**",
                                "/health/**"
                        ).permitAll()
                        .requestMatchers("/api/auth/**", "/auth/**").permitAll()
                        .requestMatchers("/api/csrf-token").permitAll()
                        .requestMatchers("/api/cors-test/**").permitAll() // Allow CORS testing
                        .requestMatchers("/oauth2/**").permitAll()
                        .requestMatchers("/login/oauth2/**").permitAll()
                        .requestMatchers("/ws-notifications/**").permitAll() // Allow WebSocket connections
                        .requestMatchers("/api/cart/**").hasAuthority("STAFF")
                        .requestMatchers("/api/users/get-profile", "/api/users/update-profile",
                                "/api/users/change-password")
                        .authenticated()
                        .requestMatchers("/api/users/**").hasAnyAuthority("ADMIN", "STOREKEEPER")
                        .requestMatchers("/api/departments/**").hasAnyAuthority("ADMIN", "STOREKEEPER")
                        .requestMatchers("/api/offices/**").hasAnyAuthority("ADMIN", "STOREKEEPER")
                        .requestMatchers("/api/reports/**").hasAnyAuthority("ADMIN", "STOREKEEPER")
                        .anyRequest().authenticated())

                // Set session management to stateless (CRITICAL for JWT)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Add JWT filter before Spring Security checks username/password (CRITICAL)
                // We only need to add this filter once.
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                // Disable default Spring Security filters to avoid conflicts
                .httpBasic(AbstractHttpConfigurer::disable)
                // Security headers
                .headers(headers -> headers
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::deny)
                        .contentTypeOptions(contentTypeOptions -> {
                        })
                        .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                                .maxAgeInSeconds(31536000))
                        .referrerPolicy(referrerPolicy -> referrerPolicy
                                .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)))

                // Exception handling
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((HttpServletRequest request, HttpServletResponse response,
                                                   org.springframework.security.core.AuthenticationException authException) -> {
                            // This handler fires when a request comes in without authentication, or with bad credentials.
                            response.setContentType("application/json");
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter()
                                    .write("{\"error\":\"Unauthorized\",\"message\":\"Authentication required or token invalid\"}");
                        })
                        .accessDeniedHandler((HttpServletRequest request, HttpServletResponse response,
                                              org.springframework.security.access.AccessDeniedException accessDeniedException) -> {
                            response.setContentType("application/json");
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter().write("{\"error\":\"Forbidden\",\"message\":\"Access denied\"}");
                        }))

                // Authentication provider and filters
                .authenticationProvider(authenticationProvider());

        return http.build();
    }
}
