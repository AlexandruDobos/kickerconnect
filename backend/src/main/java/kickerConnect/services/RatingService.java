package kickerConnect.services;

import kickerConnect.dtos.RatingDTO;
import kickerConnect.exceptions.NotFoundException;

import java.util.List;

public interface RatingService {

    RatingDTO addRating(Integer ratingUserId, Integer ratedUserId, double stars, String comment) throws NotFoundException;
    List<RatingDTO> getUserRatings(Integer userId) throws NotFoundException;

    RatingDTO editRating(Integer ratingUserId, Integer ratedUserId, double stars, String comment) throws NotFoundException;

}
