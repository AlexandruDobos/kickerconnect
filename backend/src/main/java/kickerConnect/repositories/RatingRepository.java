package kickerConnect.repositories;

import kickerConnect.dtos.RatingDTO;
import kickerConnect.entities.Rating;
import kickerConnect.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Integer> {
    List<Rating> findByRatedUser(User ratedUser);
    Optional<Rating> findByRatingUserAndRatedUser(User ratingUser, User ratedUser);
}
