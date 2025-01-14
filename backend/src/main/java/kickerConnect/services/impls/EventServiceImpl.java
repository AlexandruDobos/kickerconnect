package kickerConnect.services.impls;

import jakarta.transaction.Transactional;
import kickerConnect.dtos.EventDTO;
import kickerConnect.dtos.UserDTO;
import kickerConnect.entities.Event;
import kickerConnect.entities.Group;
import kickerConnect.entities.User;
import kickerConnect.exceptions.BadRequestException;
import kickerConnect.exceptions.NotFoundException;
import kickerConnect.repositories.EventRepository;
import kickerConnect.repositories.GroupRepository;
import kickerConnect.repositories.UserRepository;
import kickerConnect.services.EventService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EventServiceImpl implements EventService {

    private GroupRepository groupRepository;
    private EventRepository eventRepository;
    private ModelMapper modelMapper;
    private UserRepository userRepository;

    public EventServiceImpl(GroupRepository groupRepository, EventRepository eventRepository, ModelMapper modelMapper, UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.eventRepository = eventRepository;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
    }

    @Override
    public EventDTO createEvent(EventDTO eventDTO) throws NotFoundException {
        Event event = modelMapper.map(eventDTO, Event.class);
        event.setActive(true);
        System.out.println(eventDTO);
        Optional<Group> groupOptional = groupRepository.findById(eventDTO.getGroupId());
        Group group = groupOptional.orElseThrow(() -> new NotFoundException("Group not found!"));
        event.setGroup(group);
        eventRepository.save(event);
        return modelMapper.map(event, EventDTO.class);
    }

    @Override
    public EventDTO getEvent(Integer eventId) throws NotFoundException, BadRequestException {
        Optional<Event> eventOptional = eventRepository.findById(eventId);
        Event event = eventOptional.orElseThrow(() -> new NotFoundException("Event not found!"));
        if (!event.isActive()) {
            throw new BadRequestException("This event is not active.");
        }

        return modelMapper.map(event, EventDTO.class);
    }

    @Override
    public EventDTO updateEvent(Integer eventId, EventDTO eventDTO) throws NotFoundException, BadRequestException {
        Optional<Event> eventOptional = eventRepository.findById(eventId);
        Event event = eventOptional.orElseThrow(() -> new NotFoundException("Event not found!"));
        if (!event.isActive()) {
            throw new BadRequestException("This event is not active.");
        }
        if (eventDTO.getName() != null) event.setName(eventDTO.getName());
        if (eventDTO.getDescription() != null) event.setDescription(eventDTO.getDescription());
        if (eventDTO.getDate() != null) event.setDate(eventDTO.getDate());
        if (eventDTO.getLocation() != null) event.setLocation(eventDTO.getLocation());
        if (eventDTO.getNoOfPlayers() > 0) event.setNoOfPlayers(eventDTO.getNoOfPlayers());
        if (eventDTO.getNoOfPlayers() > 0) event.setNoOfTeams(eventDTO.getNoOfTeams());
        if (eventDTO.getRegisteredPlayers() != null) {
            List<User> userList = new ArrayList<>();
            for (UserDTO userDTO : eventDTO.getRegisteredPlayers()){
                System.out.println("User id: " + userDTO.getId());
            }
            for (UserDTO userDTO : eventDTO.getRegisteredPlayers()) {
                Optional<User> optionalUser = userRepository.findById(userDTO.getId());
                User user = optionalUser.orElseGet(() -> {
                    User auxUser = new User();
                    auxUser.setStars(userDTO.getStars());
                    auxUser.setUsername(userDTO.getUsername());
                    auxUser.setRegisteredDate(LocalDateTime.now());
                    auxUser.setIsAddedBy(userDTO.getIsAddedBy());
                    System.out.println(auxUser);
                    userRepository.save(auxUser);
                    return auxUser; //
                });
                userList.add(user);
            }
            event.setRegisteredPlayers(userList);
        }

        return modelMapper.map(event, EventDTO.class);
    }

    @Override
    public EventDTO activateEvent(Integer eventId) throws NotFoundException {
        Optional<Event> eventOptional = eventRepository.findById(eventId);
        Event event = eventOptional.orElseThrow(() -> new NotFoundException("Event not found!"));
        event.setActive(true);
        return modelMapper.map(event, EventDTO.class);
    }

    @Override
    public EventDTO deleteEvent(Integer eventId) throws NotFoundException, BadRequestException {
        Optional<Event> eventOptional = eventRepository.findById(eventId);
        Event event = eventOptional.orElseThrow(() -> new NotFoundException("Event not found!"));
        event.setActive(false);
        return modelMapper.map(event, EventDTO.class);
    }
}
