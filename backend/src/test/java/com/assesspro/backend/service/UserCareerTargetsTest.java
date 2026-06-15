package com.assesspro.backend.service;

import com.assesspro.backend.dto.CareerTargetsRequest;
import com.assesspro.backend.entity.User;
import com.assesspro.backend.repository.TestResultRepository;
import com.assesspro.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * A returning user fills in their career targets once during onboarding. A later
 * partial update must not wipe the fields it doesn't mention, otherwise the user
 * loses their {@code targetRole} and gets bounced back into onboarding on the
 * next login.
 */
class UserCareerTargetsTest {

    private UserService serviceFor(User user) {
        UserRepository userRepository = mock(UserRepository.class);
        when(userRepository.findById(user.getId())).thenReturn(java.util.Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(returnsFirstArg());
        TestResultRepository resultRepository = mock(TestResultRepository.class);
        when(resultRepository.findCreatedAtByUserIdOrderByDesc(any()))
                .thenReturn(java.util.Collections.emptyList());
        return new UserService(userRepository, resultRepository, null, null, null, null, null);
    }

    @Test
    void partialUpdateKeepsExistingRoleAndIndustry() {
        User user = User.builder()
                .id(1L).email("a@b.com").name("Ada")
                .targetRole("Software Engineering")
                .targetIndustry("Technology")
                .targetCompany("Google")
                .level("intermediate")
                .build();

        // Only the company changes.
        CareerTargetsRequest req = new CareerTargetsRequest();
        req.setTargetCompany("Amazon");

        serviceFor(user).updateCareerTargets(1L, req);

        assertThat(user.getTargetRole()).isEqualTo("Software Engineering");
        assertThat(user.getTargetIndustry()).isEqualTo("Technology");
        assertThat(user.getTargetCompany()).isEqualTo("Amazon");
        assertThat(user.getLevel()).isEqualTo("intermediate");
    }

    @Test
    void fullUpdateSetsEveryField() {
        User user = User.builder().id(1L).email("a@b.com").name("Ada").build();

        CareerTargetsRequest req = new CareerTargetsRequest();
        req.setTargetRole("Finance");
        req.setTargetIndustry("Finance");
        req.setTargetCompany("Goldman Sachs");
        req.setLevel("advanced");

        serviceFor(user).updateCareerTargets(1L, req);

        assertThat(user.getTargetRole()).isEqualTo("Finance");
        assertThat(user.getTargetIndustry()).isEqualTo("Finance");
        assertThat(user.getTargetCompany()).isEqualTo("Goldman Sachs");
        assertThat(user.getLevel()).isEqualTo("advanced");
    }
}
