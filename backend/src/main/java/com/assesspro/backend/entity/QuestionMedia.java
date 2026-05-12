package com.assesspro.backend.entity;

import com.assesspro.backend.entity.enums.MediaType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "question_media")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MediaType mediaType;

    // Media files are NOT stored as binary in the DB.
    // Store only the URL pointing to the asset on S3 / Cloudinary.
    // TODO: When media upload is implemented, generate pre-signed S3 URLs here.
    @Column(nullable = false)
    private String url;

    private String altText;
    private String caption;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
