package kickerConnect.repositories;

import kickerConnect.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    User findByEmail(String email);
    Optional<User> findByConfirmationToken(String confirmationToken);
    User findByResetPasswordToken(String resetPasswordToken);
    @Query("SELECT u FROM User u JOIN u.availableDates ad WHERE ad >= :startDate AND ad <= :endDate")
    List<User> findAvailableUsers(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}
