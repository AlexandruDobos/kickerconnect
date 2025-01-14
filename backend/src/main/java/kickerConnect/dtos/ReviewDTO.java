package kickerConnect.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private int id;
    private String message;
    private int stars;
    private LocalDateTime date;
    private boolean isActive;
    private String username;
    private Integer userId;
    private Integer group;
    private Integer event;

}
