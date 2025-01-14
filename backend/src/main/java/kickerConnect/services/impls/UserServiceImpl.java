package kickerConnect.services.impls;

import jakarta.transaction.Transactional;
import kickerConnect.dtos.UserDTO;
import kickerConnect.entities.User;
import kickerConnect.exceptions.BadRequestException;
import kickerConnect.exceptions.NotFoundException;
import kickerConnect.repositories.UserRepository;
import kickerConnect.services.EmailService;
import kickerConnect.services.UserService;
import kickerConnect.utilities.TokenUtil;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private ModelMapper modelMapper;
    private PasswordEncoder passwordEncoder;
    private EmailService emailService;

    public UserServiceImpl(UserRepository userRepository, ModelMapper modelMapper, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Override
    public UserDTO createUser(UserDTO userDTO) throws BadRequestException {

        if (userDTO.getUsername() == null || userDTO.getUsername().isEmpty() || userDTO.getEmail() == null || userDTO.getEmail().isEmpty() || userDTO.getPassword() == null || userDTO.getPassword().isEmpty()) {
            throw new BadRequestException("Please provide credentials!");
        }

        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new BadRequestException("This email is already used!");
        }

        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new BadRequestException("This username is already used!");
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setEmailConfirmed(false);
        user.setActive(true);
        user.setAdmin(userDTO.isAdmin());
        user.setRegisteredDate(LocalDateTime.now());

        String token = TokenUtil.generateToken();
        user.setConfirmationToken(token);
        user.setTokenExpiryDate(LocalDateTime.now().plusHours(24));

        userRepository.save(user);

        String confirmationUrl = "http://localhost:8000/user/confirm?token=" + token;
        emailService.sendEmail(user.getEmail(), "Confirm your email", "Click the link to confirm your email: " + confirmationUrl);


        return modelMapper.map(user, UserDTO.class);
    }

    public UserDTO confirmEmail(String token) throws NotFoundException {
        Optional<User> optionalUser = userRepository.findByConfirmationToken(token);
        if (optionalUser.isPresent() && optionalUser.get().getTokenExpiryDate().isAfter(LocalDateTime.now())) {
            User user = optionalUser.get();
            user.setEmailConfirmed(true);
            user.setConfirmationToken(null);
            user.setTokenExpiryDate(null);
            userRepository.save(user);
            return modelMapper.map(user, UserDTO.class);
        } else {
            throw new NotFoundException("Invalid or expired token");
        }
    }

    @Override
    public UserDTO loginUser(UserDTO userDTO) throws NotFoundException, BadRequestException {
        if (userDTO.getEmail() == null || userDTO.getEmail().isEmpty() || userDTO.getPassword() == null || userDTO.getPassword().isEmpty()) {
            throw new BadRequestException("Please provide credentials!");
        }

        User userRepo = userRepository.findByEmail(userDTO.getEmail());

        if (userRepo != null) {
            if (passwordEncoder.matches(userDTO.getPassword(), userRepo.getPassword())) {

                if (!userRepo.isActive()) throw new BadRequestException("This account is disabled!");

                userRepo.setLastLoginDate(LocalDateTime.now());
                UserDTO userReturn = modelMapper.map(userRepo, UserDTO.class);
                userReturn.setPassword(null);

                return userReturn;
            }
        }

        throw new NotFoundException("The credentials provided are incorrect!");

    }

    private int calculateAge(LocalDate dateOfBirth) {
        if (dateOfBirth == null) return 0;
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }
    @Override
    public UserDTO getUser(Integer userId) throws NotFoundException, BadRequestException {
        Optional<User> userOptional = userRepository.findById(userId);
        User user = userOptional.orElseThrow(() -> new NotFoundException("User not found!"));

        if (!user.isActive()) throw new BadRequestException("This account is disabled!");
        UserDTO userDTO = this.modelMapper.map(user, UserDTO.class);
        userDTO.setRatingCount(user.getRatingsReceived().size());
        userDTO.setEventCount(user.getEvents().size());
        userDTO.setGroupCount(user.getGroups().size());
        userDTO.setAge(calculateAge(user.getDateOfBirth()));
        userDTO.setSkillCount(user.getSkills().size());
        userDTO.setAvailableDateCount(user.getAvailableDates().size());

        return userDTO;

    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOList = new ArrayList<>();
        for(User user : users){
            UserDTO userDTO = this.modelMapper.map(user, UserDTO.class);
            userDTO.setRatingCount(user.getRatingsReceived().size());
            userDTO.setEventCount(user.getEvents().size());
            userDTO.setGroupCount(user.getGroups().size());
            userDTO.setAge(calculateAge(user.getDateOfBirth()));
            userDTO.setSkillCount(user.getSkills().size());
            userDTO.setAvailableDateCount(user.getAvailableDates().size());
            userDTOList.add(userDTO);
        }

        return userDTOList;
    }

    @Override
    public List<UserDTO> findAvailablePlayers(LocalDateTime startDate, LocalDateTime endDate) {
        List<User> users = userRepository.findAvailableUsers(startDate, endDate);
        List<UserDTO> userDTOS = new ArrayList<>();
        for(User user : users){
            userDTOS.add(this.modelMapper.map(user, UserDTO.class));
        }
        return userDTOS;
    }

    @Override
    public UserDTO updateUser(Integer userId, UserDTO userDTO) throws NotFoundException, BadRequestException {
        Optional<User> userOptional = userRepository.findById(userId);
        User user = userOptional.orElseThrow(() -> new NotFoundException("User not found!"));

        if (!user.isActive()) throw new BadRequestException("This account is disabled!");
        if (userDTO.getEmail() != null) {
            if (!userRepository.existsByEmail(userDTO.getEmail())) {
                user.setEmail(userDTO.getEmail());
            } else {
                throw new BadRequestException("This email is already used!");
            }
        }

        if (userDTO.getPassword() != null && userDTO.getNewPassword() != null) {
            System.out.println(userDTO.getPassword() + " " + user.getPassword());
            System.out.println(passwordEncoder.matches(userDTO.getPassword(), user.getPassword()));
            System.out.println(userDTO.getNewPassword());
            if (passwordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
                user.setPassword(passwordEncoder.encode(userDTO.getNewPassword()));
            } else {
                throw new NotFoundException("The password provided are incorrect!");
            }

        }

        if (userDTO.getName() != null) user.setName(userDTO.getName());
        if (userDTO.getUsername() != null) user.setUsername(userDTO.getUsername());
        if (userDTO.getCity() != null) user.setCity(userDTO.getCity());
        if (userDTO.getDescription() != null) user.setDescription(userDTO.getDescription());
        if (userDTO.getPhoneNo() != null) user.setPhoneNo(userDTO.getPhoneNo());
        if (userDTO.getDateOfBirth() != null) user.setDateOfBirth(userDTO.getDateOfBirth());
        if (userDTO.getSkills() != null) user.setSkills(userDTO.getSkills());
        if (userDTO.getStars() != null) user.setStars(userDTO.getStars());
        if (userDTO.getProfileImage() != null && !userDTO.getProfileImage().isEmpty()) {
            user.setProfileImage(userDTO.getProfileImage());
        }
        if (userDTO.getAvailableDates() != null && !userDTO.getAvailableDates().isEmpty()) {
            user.setAvailableDates(userDTO.getAvailableDates());
        }
        UserDTO userDTOUpdated = this.modelMapper.map(user, UserDTO.class);
        userDTOUpdated.setRatingCount(user.getRatingsReceived().size());
        userDTO.setEventCount(user.getEvents().size());
        userDTO.setGroupCount(user.getGroups().size());
        userDTO.setAge(calculateAge(user.getDateOfBirth()));
        userDTO.setSkillCount(user.getSkills().size());
        userDTO.setAvailableDateCount(user.getAvailableDates().size());
        return userDTOUpdated;
    }

    @Override
    public UserDTO activateUser(Integer userId) throws NotFoundException {
        Optional<User> userOptional = userRepository.findById(userId);
        User user = userOptional.orElseThrow(() -> new NotFoundException("User not found!"));
        user.setActive(true);
        return this.modelMapper.map(user, UserDTO.class);
    }

    @Override
    public UserDTO deactivateUser(Integer userId) throws NotFoundException, BadRequestException {
        Optional<User> userOptional = userRepository.findById(userId);
        User user = userOptional.orElseThrow(() -> new NotFoundException("User not found!"));

        if (!user.isActive()) throw new BadRequestException("This account is disabled!");
        user.setActive(false);
        return this.modelMapper.map(user, UserDTO.class);
    }

    @Override
    public void resetPassword(String email) throws NotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new NotFoundException("User not found with email: " + email);
        }
        String token = TokenUtil.generateToken();
        user.setResetPasswordToken(token);
        user.setTokenExpiryDate(LocalDateTime.now().plusHours(24));
        userRepository.save(user);
        String resetUrl = "http://localhost:19006/reset-password?token=" + token; // Frontend URL
        emailService.sendEmail(user.getEmail(), "Reset Password", "Click the link to reset your password: " + resetUrl);
    }

    @Override
    public void confirmResetPassword(String token, String newPassword) throws NotFoundException, BadRequestException {
        User user = userRepository.findByResetPasswordToken(token);
        if (user == null || user.getTokenExpiryDate().isBefore(LocalDateTime.now())) {
            throw new NotFoundException("Invalid or expired token");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setTokenExpiryDate(null);
        userRepository.save(user);
    }
}
