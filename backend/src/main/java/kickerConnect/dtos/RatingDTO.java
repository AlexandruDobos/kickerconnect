package kickerConnect.dtos;
import lombok.Data;

@Data
public class RatingDTO {
    private Integer ratingUserId;
    private Integer ratedUserId;
    private double stars;
    private String comment;
}
