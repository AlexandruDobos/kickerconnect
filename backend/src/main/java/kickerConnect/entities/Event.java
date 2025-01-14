package kickerConnect.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String creator;
    private String name;
    private LocalDateTime date;
    private int noOfPlayers;
    private int noOfTeams;
    private String description;
    @ManyToMany
    @JoinTable(
            name = "event_registered_players",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnore
    private List<User> registeredPlayers;
    private String location;
    private boolean isActive;
    @ManyToOne
    @JoinColumn(name="group_id")
    @JsonIgnore
    private Group group;
}
