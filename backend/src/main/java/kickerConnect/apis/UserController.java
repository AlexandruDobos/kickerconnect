package kickerConnect.apis;


import jakarta.validation.Valid;
import kickerConnect.dtos.DateRangeDTO;
import kickerConnect.dtos.UserDTO;
import kickerConnect.exceptions.BadRequestException;
import kickerConnect.exceptions.NotFoundException;
import kickerConnect.services.EmailService;
import kickerConnect.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/user")
@Validated
@CrossOrigin(origins = "http://localhost:19006")
public class UserController {

    private UserService userService;
    private EmailService emailService;

    public UserController(UserService userService, EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO userDTO) throws BadRequestException {

        UserDTO user = userService.createUser(userDTO);

        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> loginUser(@Valid @RequestBody UserDTO userDTO) throws BadRequestException, NotFoundException {

        UserDTO user = userService.loginUser(userDTO);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<UserDTO> getUser(@RequestParam("user") Integer userId) throws BadRequestException, NotFoundException {
        UserDTO userDTO = userService.getUser(userId);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> userDTOList = userService.getAllUsers();
        return new ResponseEntity<>(userDTOList, HttpStatus.OK);
    }

    @PostMapping("/available-users")
    public ResponseEntity<List<UserDTO>> getAvailableUsers(@RequestBody DateRangeDTO dateRange) throws BadRequestException, NotFoundException {
        List<UserDTO> availableUsersDTO = userService.findAvailablePlayers(dateRange.getStartDate(), dateRange.getEndDate());
        return new ResponseEntity<>(availableUsersDTO, HttpStatus.OK);
    }

    @PatchMapping
    public ResponseEntity<UserDTO> updateUser(@RequestParam("user") Integer userId, @Valid @RequestBody UserDTO userDTO) throws BadRequestException, NotFoundException {
        UserDTO updatedUserDTO = userService.updateUser(userId, userDTO);
        return new ResponseEntity<>(updatedUserDTO, HttpStatus.OK);
    }

    @PatchMapping("/activate")
    public ResponseEntity<UserDTO> activateUser(@RequestParam("user") Integer userId) throws NotFoundException {
        UserDTO userDTO = userService.activateUser(userId);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @GetMapping("/confirm")
    public ResponseEntity<String> confirmEmail(@RequestParam("token") String token) throws NotFoundException {
        userService.confirmEmail(token);
        return new ResponseEntity<>("Email confirmed successfully", HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    @CrossOrigin(origins = "http://localhost:19006")
    public ResponseEntity<Void> resetPassword(@RequestParam("email") String email) throws NotFoundException {
        userService.resetPassword(email);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/confirm-reset-password")
    public ResponseEntity<Void> confirmResetPassword(@RequestParam("token") String token, @RequestParam("newPassword") String newPassword) throws NotFoundException, BadRequestException {
        userService.confirmResetPassword(token, newPassword);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return new ResponseEntity<>("Please select a file!", HttpStatus.BAD_REQUEST);
        }

        String uploadDir = new File("src/main/resources/uploads").getAbsolutePath();
        File uploadDirFile = new File(uploadDir);
        if (!uploadDirFile.exists()) {
            uploadDirFile.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path path = Paths.get(uploadDir + File.separator + fileName);
        Files.write(path, file.getBytes());

        System.out.println("File saved at: " + path.toString()); // Log pentru verificare

        return new ResponseEntity<>(fileName, HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<UserDTO> deactivateUser(@RequestParam("user") Integer userId) throws BadRequestException, NotFoundException{
        UserDTO userDTO = userService.deactivateUser(userId);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }
}
