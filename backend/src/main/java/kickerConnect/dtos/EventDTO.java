package kickerConnect.dtos;

import kickerConnect.entities.Group;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class EventDTO {
    private int id;
    private String creator;
    private String name;
    private LocalDateTime date;
    private int noOfPlayers;
    private int noOfTeams;
    private String description;
    private List<UserDTO> registeredPlayers;
    private String location;
    private boolean isActive;
    private Integer groupId;
    private Group group;
}
