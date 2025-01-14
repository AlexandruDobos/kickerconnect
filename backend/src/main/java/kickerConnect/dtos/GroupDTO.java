package kickerConnect.dtos;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class GroupDTO {
    private int id;
    private String creator;
    private String name;
    private LocalDateTime dateOfCreation;
    private String location;
    private String details;
    private List<EventDTO> events;
    private List<UserDTO> members;
    private boolean isActive;
    private List<ReviewDTO> reviewDTOS;
}
