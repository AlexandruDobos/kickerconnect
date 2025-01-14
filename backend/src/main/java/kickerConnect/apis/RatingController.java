package kickerConnect.apis;

import kickerConnect.dtos.RatingDTO;
import kickerConnect.entities.User;
import kickerConnect.exceptions.NotFoundException;
import kickerConnect.services.RatingService;
import kickerConnect.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rating")
@Validated
@CrossOrigin(origins = "http://localhost:19006")
public class RatingController {

    private RatingService ratingService;

    private UserService userService;

    public RatingController(RatingService ratingService, UserService userService) {
        this.ratingService = ratingService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<RatingDTO>> getUserRatings(@RequestParam Integer userId) throws NotFoundException {
        List<RatingDTO> ratings = ratingService.getUserRatings(userId);
        return new ResponseEntity<>(ratings, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<RatingDTO> addRating(@RequestBody RatingDTO ratingDTO) throws NotFoundException {
        System.out.println(ratingDTO.getRatingUserId() + " " + ratingDTO.getRatedUserId() + " " + ratingDTO.getStars() + " " + ratingDTO.getComment());
        RatingDTO createdRating = ratingService.addRating(ratingDTO.getRatingUserId(), ratingDTO.getRatedUserId(), ratingDTO.getStars(), ratingDTO.getComment());

        return new ResponseEntity<>(ratingDTO, HttpStatus.CREATED);
    }

    @PutMapping("/edit")
    public ResponseEntity<RatingDTO> editRating(@RequestBody RatingDTO ratingDTO) throws NotFoundException {
        System.out.println(ratingDTO.getRatingUserId() + " " + ratingDTO.getRatedUserId() + " " + ratingDTO.getStars() + " " + ratingDTO.getComment());

        RatingDTO editedRatingDTO = ratingService.editRating(ratingDTO.getRatingUserId(), ratingDTO.getRatedUserId(), ratingDTO.getStars(), ratingDTO.getComment());
        return new ResponseEntity<>(editedRatingDTO, HttpStatus.OK);
    }
}
