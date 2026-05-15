package com.assesspro.backend.entity;

import com.assesspro.backend.entity.enums.AssessmentCategory;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.TestType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "assessment_tests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Language language = Language.EN;

    @Column(nullable = false)
    @Builder.Default
    private boolean isFree = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean isGeneratedByAI = false;

    private int estimatedTimeMinutes;

    // Categorisation — drives recommendations and filtering
    @Enumerated(EnumType.STRING)
    private AssessmentCategory category;

    private String subcategory;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "test_target_roles", joinColumns = @JoinColumn(name = "test_id"))
    @Column(name = "role")
    @Builder.Default
    private List<String> targetRoles = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "test_target_industries", joinColumns = @JoinColumn(name = "test_id"))
    @Column(name = "industry")
    @Builder.Default
    private List<String> targetIndustries = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "test_recommended_companies", joinColumns = @JoinColumn(name = "test_id"))
    @Column(name = "company")
    @Builder.Default
    private List<String> recommendedForCompanies = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "test_skills_measured", joinColumns = @JoinColumn(name = "test_id"))
    @Column(name = "skill")
    @Builder.Default
    private List<String> skillsMeasured = new ArrayList<>();

    @OneToMany(mappedBy = "assessmentTest", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
