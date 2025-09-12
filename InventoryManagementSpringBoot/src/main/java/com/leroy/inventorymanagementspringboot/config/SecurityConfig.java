package com.leroy.inventorymanagementspringboot.config;

import com.leroy.inventorymanagementspringboot.security.JwtAuthenticationFilter;
import com.leroy.inventorymanagementspringboot.security.OAuth2AuthenticationSuccessHandler;
import com.leroy.inventorymanagementspringboot.security.OAuth2AuthenticationFailureHandler;
import com.leroy.inventorymanagementspringboot.service.CustomUserDetailService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private final CustomUserDetailService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final OAuth2AuthenticationSuccessHandler oauth2SuccessHandler;
    private final OAuth2AuthenticationFailureHandler oauth2FailureHandler;

    private static final Logger logger = LogManager.getLogger(SecurityConfig.class);

    public SecurityConfig(CustomUserDetailService userDetailsService, 
                         JwtAuthenticationFilter jwtAuthFilter,
                         OAuth2AuthenticationSuccessHandler oauth2SuccessHandler,
                         OAuth2AuthenticationFailureHandler oauth2FailureHandler) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthFilter = jwtAuthFilter;
        this.oauth2SuccessHandler = oauth2SuccessHandler;
        this.oauth2FailureHandler = oauth2FailureHandler;
    }

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
    public CsrfTokenRepository csrfTokenRepository() {
        CookieCsrfTokenRepository tokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        tokenRepository.setCookiePath("/");
        tokenRepository.setCookieName("XSRF-TOKEN");
        tokenRepository.setHeaderName("X-XSRF-TOKEN");
        return tokenRepository;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost:5173", "https://*.vercel.app", "https://*.netlify.app"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("X-XSRF-TOKEN"));
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CORS configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // CSRF protection with proper configuration
                .csrf(csrf -> csrf
                        .csrfTokenRepository(csrfTokenRepository())
                        .ignoringRequestMatchers("/api/auth/login", "/api/auth/google", "/api/auth/refresh", "/api/auth/logout", "/oauth2/**", "/login/oauth2/**")
                )
                
                // OAuth2 configuration
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/oauth2/authorization/google")
                        .successHandler(oauth2SuccessHandler)
                        .failureHandler(oauth2FailureHandler)
                )
                
                // Authorization rules
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/oauth2/**").permitAll()
                        .requestMatchers("/login/oauth2/**").permitAll()
                        .requestMatchers("/api/departments/**").hasAnyAuthority("ADMIN", "STOREKEEPER")
                        .requestMatchers("/api/offices/**").hasAnyAuthority("ADMIN", "STOREKEEPER")
                        .requestMatchers("/api/users/**").hasAnyAuthority("ADMIN", "STOREKEEPER")
                        .requestMatchers("/api/reports/**").hasAnyAuthority("ADMIN", "STOREKEEPER")
                        .anyRequest().authenticated()
                )
                
                // Session management
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // Security headers
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.deny())
                        .contentTypeOptions(contentTypeOptions -> {})
                        .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                                .maxAgeInSeconds(31536000)
                        )
                        .referrerPolicy(referrerPolicy -> referrerPolicy.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                )
                
                // Exception handling
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((HttpServletRequest request, HttpServletResponse response, org.springframework.security.core.AuthenticationException authException) -> {
                            try {
                                response.setContentType("application/json");
                                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"Authentication required\"}");
                            } catch (IOException e) {
                                logger.error("Error writing authentication error response", e);
                            }
                        })
                        .accessDeniedHandler((HttpServletRequest request, HttpServletResponse response, org.springframework.security.access.AccessDeniedException accessDeniedException) -> {
                            try {
                                response.setContentType("application/json");
                                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                                response.getWriter().write("{\"error\":\"Forbidden\",\"message\":\"Access denied\"}");
                            } catch (IOException e) {
                                logger.error("Error writing access denied response", e);
                            }
                        })
                )
                
                // Authentication provider and filters
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // New Bean for OAuth2 Authentication Failure Handler
    @Bean
    public AuthenticationFailureHandler oauth2AuthenticationFailureHandler() {
        return (request, response, exception) -> {
            logger.error("OAuth2 Login Failure: {}\n{}", exception.getMessage(), Arrays.toString(exception.getStackTrace()));
            System.err.println("OAuth2 Login Failure: " + exception.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "OAuth2 Login Failed: " + exception.getMessage());
        };
    }
}
