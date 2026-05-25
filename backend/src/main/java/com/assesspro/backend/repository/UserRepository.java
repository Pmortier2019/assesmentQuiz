package com.assesspro.backend.repository;

import com.assesspro.backend.entity.User;
import com.assesspro.backend.entity.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByRole(Role role);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.subscription WHERE u.email = :email")
    Optional<User> findByEmailWithSubscription(@Param("email") String email);
}
