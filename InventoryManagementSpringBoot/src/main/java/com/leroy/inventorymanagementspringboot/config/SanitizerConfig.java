package com.leroy.inventorymanagementspringboot.config;

import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SanitizerConfig {

    @Bean
    public PolicyFactory plainTextPolicy() {
        // very strict: escape everything except plain text
        return new HtmlPolicyBuilder().toFactory();
    }

    @Bean
    public PolicyFactory formattingBlocksLinksPolicy() {
        // allow basic formatting, blocks, and links
        return Sanitizers.FORMATTING
                .and(Sanitizers.BLOCKS)
                .and(Sanitizers.LINKS);
    }

    @Bean
    public PolicyFactory formattingBlocksPolicy() {
        // allow basic formatting, and blocks
        return Sanitizers.FORMATTING
                .and(Sanitizers.BLOCKS);
    }

    @Bean
    public PolicyFactory formattingPolicy() {
        // allow basic formatting
        return Sanitizers.FORMATTING;
    }

    @Bean
    public PolicyFactory blocksPolicy() {
        // allow basic blocks
        return Sanitizers.BLOCKS;
    }


    @Bean
    public PolicyFactory linksPolicy() {
        // allow basic links
        return Sanitizers.LINKS;
    }
}

