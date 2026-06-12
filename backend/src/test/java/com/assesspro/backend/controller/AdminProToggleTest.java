package com.assesspro.backend.controller;

import com.assesspro.backend.entity.Subscription;
import com.assesspro.backend.entity.User;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.SubscriptionStatus;
import com.assesspro.backend.repository.SubscriptionRepository;
import com.assesspro.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies the admin Pro toggle: granting/revoking flips the user's
 * subscription status, the stats endpoint counts Pro users, and the users
 * endpoint exposes the {@code isPro} flag.
 */
@SpringBootTest
@ActiveProfiles("test")
class AdminProToggleTest {

    @Autowired
    private AdminController adminController;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    private Long userId;

    @BeforeEach
    void seed() {
        subscriptionRepository.deleteAll();
        userRepository.deleteAll();

        User user = userRepository.save(User.builder()
                .email("toggle@example.com").name("Toggle User")
                .preferredLanguage(Language.EN).freeTestsUsed(0).build());
        subscriptionRepository.save(Subscription.builder()
                .user(user).status(SubscriptionStatus.FREE).plan("FREE").build());
        userId = user.getId();
    }

    @Test
    void grantPro_setsActiveStatusAndCountsInStats() {
        adminController.setUserPro(userId, true);

        Subscription sub = subscriptionRepository.findByUserId(userId).orElseThrow();
        assertThat(sub.getStatus()).isEqualTo(SubscriptionStatus.ACTIVE);
        assertThat(sub.getPlan()).isEqualTo("PRO_MANUAL");

        assertThat(adminController.stats().getBody()).containsEntry("proUsers", 1L);
    }

    @Test
    void revokePro_setsFreeStatus() {
        adminController.setUserPro(userId, true);
        adminController.setUserPro(userId, false);

        Subscription sub = subscriptionRepository.findByUserId(userId).orElseThrow();
        assertThat(sub.getStatus()).isEqualTo(SubscriptionStatus.FREE);
        assertThat(adminController.stats().getBody()).containsEntry("proUsers", 0L);
    }

    @Test
    void adminUsers_exposesIsProFlag() {
        adminController.setUserPro(userId, true);

        List<Map<String, Object>> rows = adminController.adminUsers().getBody();
        assertThat(rows).isNotNull();
        assertThat(rows).anySatisfy(row -> {
            assertThat(row.get("email")).isEqualTo("toggle@example.com");
            assertThat(row.get("isPro")).isEqualTo(true);
        });
    }
}
