package com.leroy.inventorymanagementspringboot.security;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementspringboot.dto.response.AuthenticationResponse;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.mapper.UserMapper;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final UserMapper userMapper;

    @Autowired
    public OAuth2AuthenticationSuccessHandler(UserRepository userRepository, JwtUtil jwtUtil, UserDetailsService userDetailsService, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userMapper = userMapper;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        Object principal = authentication.getPrincipal();
        String email = null;

        if (principal instanceof OidcUser oidcUser) {
            email = oidcUser.getEmail();
        } else if (principal instanceof OAuth2User oauth2User) {
            Map<String, Object> attributes = oauth2User.getAttributes();
            email = (String) attributes.get("email");
        }

        if (email != null) {
            Optional<User> userOptional = userRepository.findByEmail(email);
            User user;
            if (userOptional.isEmpty()) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid email or password");
                return;
            } else {
                user = userOptional.get();
            }

            // Load UserDetails for JWT generation
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            final String jwt = jwtUtil.generateToken(userDetails);
            var authResponse = userMapper.toAuthenticationResponse(user);
            authResponse.setJwt(jwt);

            response.setContentType("application/json");
            response.getWriter().write(objectMapper.writeValueAsString(authResponse));
            response.setStatus(HttpServletResponse.SC_OK);

        } else {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Could not retrieve user email from OAuth provider.");
        }
    }
}
