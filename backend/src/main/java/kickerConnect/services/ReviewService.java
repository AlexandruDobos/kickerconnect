package kickerConnect.services;

import kickerConnect.dtos.GroupDTO;
import kickerConnect.dtos.ReviewDTO;
import kickerConnect.entities.Review;
import kickerConnect.exceptions.BadRequestException;
import kickerConnect.exceptions.NotFoundException;

import java.util.List;

public interface ReviewService {
    ReviewDTO createReview(ReviewDTO reviewDTO) throws BadRequestException, NotFoundException;

    ReviewDTO getReview(Integer reviewId) throws BadRequestException, NotFoundException;

    List<ReviewDTO> getAllReviews();

    ReviewDTO updateReview(Integer reviewId, ReviewDTO reviewDTO) throws NotFoundException, BadRequestException;

    ReviewDTO deleteReview(Integer reviewId) throws NotFoundException, BadRequestException;

    List<ReviewDTO> getReviewsForEvent(Integer eventId);

    List<ReviewDTO> getReviewsForGroup(Integer groupId);

}
