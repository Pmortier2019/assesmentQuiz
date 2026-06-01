package com.assesspro.backend.entity;

import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(255) default 'USER'")
    @Builder.Default
    private Role role = Role.USER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Language preferredLanguage = Language.EN;

    @Column(nullable = false)
    @Builder.Default
    private int freeTestsUsed = 0;

    @Column(nullable = false)
    @Builder.Default
    private int xp = 0;

    // Career targeting — drives personalised recommendations
    private String targetRole;
    private String targetIndustry;
    private String targetCompany;
    private String level; // beginner / intermediate / advanced

    @Column(nullable = false, columnDefinition = "boolean default true")
    @Builder.Default
    private boolean emailVerified = false;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Subscription subscription;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * Set whenever the password changes. Any JWT issued before this moment is
     * rejected by {@code JwtAuthFilter}, so a password reset invalidates all
     * existing sessions. Null means "no cutoff" (legacy tokens stay valid).
     */
    private LocalDateTime passwordChangedAt;
}
