package kickerConnect.apis;

import jakarta.validation.Valid;
import kickerConnect.dtos.GroupDTO;
import kickerConnect.dtos.ReviewDTO;
import kickerConnect.exceptions.BadRequestException;
import kickerConnect.exceptions.NotFoundException;
import kickerConnect.services.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
@Validated
@CrossOrigin(origins = "http://localhost:19006")
public class ReviewController {
    private ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/add")
    public ResponseEntity<ReviewDTO> createReview(@Valid @RequestBody ReviewDTO reviewDTO) throws BadRequestException, NotFoundException {
        ReviewDTO reviewDTO1 = reviewService.createReview(reviewDTO);
        return new ResponseEntity<>(reviewDTO1, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ReviewDTO> getReview(@RequestParam("review") Integer reviewId) throws BadRequestException, NotFoundException {
        ReviewDTO reviewDTO = reviewService.getReview(reviewId);
        return new ResponseEntity<>(reviewDTO, HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<ReviewDTO>> getReviews() {
        List<ReviewDTO> reviewDTOS = reviewService.getAllReviews();
        return new ResponseEntity<>(reviewDTOS, HttpStatus.OK);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsForEvent(@PathVariable Integer eventId) {
        List<ReviewDTO> reviewDTOS = reviewService.getReviewsForEvent(eventId);
        return new ResponseEntity<>(reviewDTOS, HttpStatus.OK);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsForGroup(@PathVariable Integer groupId) {
        List<ReviewDTO> reviewDTOS = reviewService.getReviewsForGroup(groupId);
        return new ResponseEntity<>(reviewDTOS, HttpStatus.OK);
    }

    @PatchMapping
    public ResponseEntity<ReviewDTO> updateReview(@RequestParam("review") Integer reviewId, @Valid @RequestBody ReviewDTO reviewDTO) throws BadRequestException, NotFoundException {
        ReviewDTO reviewDTO1 = reviewService.updateReview(reviewId, reviewDTO);
        return new ResponseEntity<>(reviewDTO1, HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<ReviewDTO> deleteReview(@RequestParam("review") Integer reviewId) throws NotFoundException, BadRequestException {
        ReviewDTO reviewDTO = reviewService.deleteReview(reviewId);
        return new ResponseEntity<>(reviewDTO, HttpStatus.OK);
    }
}
