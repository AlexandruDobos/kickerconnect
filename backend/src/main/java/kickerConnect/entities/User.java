package kickerConnect.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private String name;
    private String email;
    private String password;
    private String phoneNo;
    private LocalDate dateOfBirth;
    private String city;
    private String description;
    @ElementCollection
    private List<String> skills;
    private Double stars;
    @ManyToMany(mappedBy = "registeredPlayers")
    private List<Event> events;
    @ManyToMany(mappedBy = "members")
    private List<Group> groups;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String profileImage;
    private LocalDateTime registeredDate;
    private LocalDateTime lastLoginDate;
    private boolean isActive;
    private boolean isAdmin;
    private boolean emailConfirmed;
    private String confirmationToken;
    private String resetPasswordToken;
    private LocalDateTime tokenExpiryDate;
    @ElementCollection
    @CollectionTable(name = "user_available_dates", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "available_date")
    private List<LocalDateTime> availableDates;

    @OneToMany(mappedBy = "ratedUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> ratingsReceived;
    private String isAddedBy;
}
