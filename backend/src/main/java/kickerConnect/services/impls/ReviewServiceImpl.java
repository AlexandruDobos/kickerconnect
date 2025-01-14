package kickerConnect.services.impls;

import jakarta.transaction.Transactional;
import kickerConnect.dtos.ReviewDTO;
import kickerConnect.entities.Event;
import kickerConnect.entities.Group;
import kickerConnect.entities.Review;
import kickerConnect.entities.User;
import kickerConnect.exceptions.BadRequestException;
import kickerConnect.exceptions.NotFoundException;
import kickerConnect.repositories.EventRepository;
import kickerConnect.repositories.GroupRepository;
import kickerConnect.repositories.ReviewRepository;
import kickerConnect.repositories.UserRepository;
import kickerConnect.services.ReviewService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {
    private ReviewRepository reviewRepository;
    private UserRepository userRepository;
    private GroupRepository groupRepository;
    private EventRepository eventRepository;

    private ModelMapper modelMapper;

    public ReviewServiceImpl(ReviewRepository reviewRepository, UserRepository userRepository, GroupRepository groupRepository, EventRepository eventRepository, ModelMapper modelMapper) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.eventRepository = eventRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public ReviewDTO createReview(ReviewDTO reviewDTO) throws BadRequestException, NotFoundException {
        if (reviewDTO.getUsername() == null ) {
            throw new BadRequestException("Please provide user!");
        }
        Review review = this.modelMapper.map(reviewDTO, Review.class);
        review.setActive(true);
        reviewRepository.save(review);
        return this.modelMapper.map(review, ReviewDTO.class);
    }

    @Override
    public ReviewDTO getReview(Integer reviewId) throws NotFoundException {
        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);
        Review review = reviewOptional.orElseThrow(() -> new NotFoundException("Review not found!"));

        return this.modelMapper.map(review, ReviewDTO.class);
    }

    @Override
    public List<ReviewDTO> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        List<ReviewDTO> reviewDTOS = new ArrayList<>();
        for(Review review : reviews){
            reviewDTOS.add(this.modelMapper.map(review, ReviewDTO.class));
        }
        return reviewDTOS;
    }

    @Override
    public List<ReviewDTO> getReviewsForEvent(Integer eventId) {
        List<Review> reviews = reviewRepository.findByEvent(eventId);
        List<ReviewDTO> reviewDTOS = new ArrayList<>();
        for(Review review : reviews){
            reviewDTOS.add(this.modelMapper.map(review, ReviewDTO.class));
        }
        System.out.println(reviewDTOS);
        return reviewDTOS;
    }

    @Override
    public List<ReviewDTO> getReviewsForGroup(Integer groupId) {
        List<Review> reviews = reviewRepository.findByGroup(groupId);
        List<ReviewDTO> reviewDTOS = new ArrayList<>();
        for(Review review : reviews){
            reviewDTOS.add(this.modelMapper.map(review, ReviewDTO.class));
        }
        return reviewDTOS;
    }

    @Override
    public ReviewDTO updateReview(Integer reviewId, ReviewDTO reviewDTO) throws NotFoundException {
        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);
        Review review = reviewOptional.orElseThrow(() -> new NotFoundException("Review not found."));
        if(reviewDTO.getStars()>0) review.setStars(reviewDTO.getStars());
        if(reviewDTO.getMessage()!=null) review.setMessage(reviewDTO.getMessage());
        if(reviewDTO.getDate()!=null) review.setDate(reviewDTO.getDate());
        return this.modelMapper.map(review, ReviewDTO.class);
    }

    @Override
    public ReviewDTO deleteReview(Integer reviewId) throws NotFoundException {
        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);
        Review review = reviewOptional.orElseThrow(() -> new NotFoundException("Review not found."));
        review.setActive(false);
        return this.modelMapper.map(review, ReviewDTO.class);
    }


}
