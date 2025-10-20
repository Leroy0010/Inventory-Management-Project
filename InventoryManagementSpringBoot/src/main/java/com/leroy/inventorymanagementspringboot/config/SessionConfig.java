package com.leroy.inventorymanagementspringboot.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.session.jdbc.JdbcIndexedSessionRepository;
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;

@Configuration
@EnableJdbcHttpSession
public class SessionConfig {

//    @Bean
//    public JdbcIndexedSessionRepository sessionRepository(JdbcTemplate jdbcTemplate) {
//        return new JdbcIndexedSessionRepository(jdbcTemplate);
//    }
}
