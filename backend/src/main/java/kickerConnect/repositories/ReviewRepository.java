package kickerConnect.repositories;

import kickerConnect.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByEvent(int eventId);

    List<Review> findByGroup(int groupId);
}
