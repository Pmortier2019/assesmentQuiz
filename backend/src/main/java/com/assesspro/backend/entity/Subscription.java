package com.assesspro.backend.entity;

import com.assesspro.backend.entity.enums.SubscriptionStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SubscriptionStatus status = SubscriptionStatus.FREE;

    // Plan name, e.g. "FREE" or "PRO_MONTHLY"
    @Column(nullable = false)
    @Builder.Default
    private String plan = "FREE";

    private LocalDateTime startedAt;
    private LocalDateTime expiresAt;

    // TODO: Add stripeSubscriptionId and stripeCustomerId fields when Stripe is integrated
    // private String stripeSubscriptionId;
    // private String stripeCustomerId;
}
