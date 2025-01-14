package kickerConnect.services.impls;

import jakarta.transaction.Transactional;
import kickerConnect.dtos.RatingDTO;
import kickerConnect.entities.Rating;
import kickerConnect.entities.User;
import kickerConnect.exceptions.NotFoundException;
import kickerConnect.repositories.RatingRepository;
import kickerConnect.repositories.UserRepository;
import kickerConnect.services.RatingService;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.simp.user.UserRegistryMessageHandler;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RatingServiceImpl implements RatingService {

    private ModelMapper modelMapper;
    private UserRepository userRepository;
    private RatingRepository ratingRepository;

    public RatingServiceImpl(ModelMapper modelMapper, UserRepository userRepository, RatingRepository ratingRepository) {
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
        this.ratingRepository = ratingRepository;
    }

    @Override
    public List<RatingDTO> getUserRatings(Integer userId) throws NotFoundException {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found!"));
        List<Rating> ratings = ratingRepository.findByRatedUser(user);
        return ratings.stream()
                .map(rating -> modelMapper.map(rating, RatingDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public RatingDTO addRating(Integer ratingUserId, Integer ratedUserId, double stars, String comment) throws NotFoundException {
        System.out.println("Am intrat aici");
        Optional<User> ratingUserOptional = userRepository.findById(ratingUserId);
        User ratingUser = ratingUserOptional.orElseThrow(() -> new NotFoundException("User not found!"));

        Optional<User> ratedUserOptional = userRepository.findById(ratedUserId);
        User ratedUser = ratedUserOptional.orElseThrow(() -> new NotFoundException("User not found!"));


        Rating rating = new Rating();
        rating.setRatingUser(ratingUser);
        rating.setRatedUser(ratedUser);
        rating.setStars(stars);
        rating.setComment(comment);
        rating.setRatingDate(LocalDateTime.now());

        ratingRepository.save(rating);

        updateUserStars(ratedUser);

        return this.modelMapper.map(rating, RatingDTO.class);
    }

    @Override
    public RatingDTO editRating(Integer ratingUserId, Integer ratedUserId, double stars, String comment) throws NotFoundException {
        System.out.println("Am intrat în editRating");

        Optional<User> ratingUserOptional = userRepository.findById(ratingUserId);
        if (!ratingUserOptional.isPresent()) {
            System.out.println("Rating user not found: " + ratingUserId);
            throw new NotFoundException("User not found!");
        }
        User ratingUser = ratingUserOptional.get();

        Optional<User> ratedUserOptional = userRepository.findById(ratedUserId);
        if (!ratedUserOptional.isPresent()) {
            System.out.println("Rated user not found: " + ratedUserId);
            throw new NotFoundException("User not found!");
        }
        User ratedUser = ratedUserOptional.get();

        Optional<Rating> ratingOptional = ratingRepository.findByRatingUserAndRatedUser(ratingUser, ratedUser);
        if (!ratingOptional.isPresent()) {
            System.out.println("Rating not found for users: " + ratingUserId + " -> " + ratedUserId);
            throw new NotFoundException("Rating not found!");
        }
        Rating rating = ratingOptional.get();

        rating.setStars(stars);
        rating.setComment(comment);
        ratingRepository.save(rating);

        updateUserStars(ratedUser);

        return this.modelMapper.map(rating, RatingDTO.class);
    }

    private void updateUserStars(User user) throws NotFoundException {
        List<Rating> ratings = ratingRepository.findByRatedUser(user);
        double averageStars = Math.round(ratings.stream()
                .mapToDouble(Rating::getStars)
                .average()
                .orElse(0.0));

        user.setStars(averageStars);
        userRepository.save(user);
    }
}
