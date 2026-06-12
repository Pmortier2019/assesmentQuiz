package com.assesspro.backend.repository;

import com.assesspro.backend.entity.Subscription;
import com.assesspro.backend.entity.enums.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByUserId(Long userId);

    long countByStatus(SubscriptionStatus status);

    List<Subscription> findByUserIdIn(List<Long> userIds);
}
