package kickerConnect.dtos;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.Pattern;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserDTO {
    private Integer id;
    @Email(message = "{user.email.invalid}")
    private String email;
    @Pattern(regexp = "(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}",message = "{user.password.invalid}")
    private String password;
    @Pattern(regexp = "(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}",message = "{user.password.invalid}")
    private String newPassword;
    private String username;
    private String name;
    private String phoneNo;
    private LocalDate dateOfBirth;
    private String city;
    private String description;
    private Double stars;
    private List<String> skills;
    private String profileImage; // Base64 encoded image
    private LocalDateTime registeredDate;
    private LocalDateTime lastLoginDate;
    private boolean isActive;
    private boolean isAdmin;
    private List<LocalDateTime> availableDates;
    private int ratingCount;
    private int eventCount;
    private int groupCount;
    private int age;
    private int skillCount;
    private int availableDateCount;
    private String isAddedBy;
}
