package kickerConnect.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "group_table")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String creator;
    private String name;
    private LocalDateTime dateOfCreation;
    private String location;
    private String details;
    @OneToMany(mappedBy = "group")
    @JsonIgnore
    private List<Event> events;
    @ManyToMany
    @JoinTable(
            name = "group_table_members", // Specificați numele tabelei de legătură aici
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnore
    private List<User> members;
    private boolean isActive;


}
