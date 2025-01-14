package kickerConnect.services;

import kickerConnect.dtos.UserDTO;
import kickerConnect.exceptions.BadRequestException;
import kickerConnect.exceptions.NotFoundException;

import java.time.LocalDateTime;
import java.util.List;

public interface UserService {
    UserDTO createUser(UserDTO userDTO) throws BadRequestException;
    UserDTO confirmEmail(String token) throws NotFoundException;
    UserDTO loginUser(UserDTO userDTO) throws NotFoundException, BadRequestException;

    UserDTO getUser(Integer userId) throws NotFoundException, BadRequestException;
    List<UserDTO> getAllUsers();
    List<UserDTO> findAvailablePlayers(LocalDateTime startDate, LocalDateTime endDate);
    UserDTO updateUser(Integer userId, UserDTO userDTO) throws NotFoundException, BadRequestException;
    void resetPassword(String email) throws NotFoundException;
    void confirmResetPassword(String token, String newPassword) throws NotFoundException, BadRequestException;
    UserDTO activateUser(Integer userId) throws NotFoundException;
    UserDTO deactivateUser(Integer userId) throws NotFoundException, BadRequestException;
}
