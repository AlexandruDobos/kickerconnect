package kickerConnect.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private Integer userId;
    @Column(name = "group_id")
    private Integer group;

    @Column(name = "event_id")
    private Integer event;
    private String message;
    private int stars;
    private LocalDateTime date;
    private boolean isActive;

}
