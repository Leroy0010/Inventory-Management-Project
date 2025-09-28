package com.leroy.inventorymanagementspringboot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import java.security.GeneralSecurityException;
import java.security.Security;

@Configuration
public class VapidConfig {

    @Value("${vapid.private.key:Unp26wQzoZWGzTGD_7o8Jjfve95oFRm5wt3jYS_hrZs}")
    private String vapidPrivateKey;

    @Value("${vapid.public.key:BEqA-s8JXB450K8KblHvwC0l2oOLviV7_zh8ntpmTzKoGv7vAASqTpbgoENGqLCL2wUrvSLopkLfOEabvH1XU_8}")
    private String vapidPublicKey;

    @Bean
    public PushService pushService() throws GeneralSecurityException {
        // Register BouncyCastle provider if not already registered
        if (Security.getProvider("BC") == null) {
            Security.addProvider(new BouncyCastleProvider());
        }

        return new PushService(vapidPublicKey, vapidPrivateKey);
    }
}
