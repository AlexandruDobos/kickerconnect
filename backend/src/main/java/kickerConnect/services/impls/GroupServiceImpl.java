package kickerConnect.services.impls;

import jakarta.transaction.Transactional;
import kickerConnect.dtos.EventDTO;
import kickerConnect.dtos.GroupDTO;
import kickerConnect.dtos.UserDTO;
import kickerConnect.entities.Event;
import kickerConnect.entities.Group;
import kickerConnect.entities.User;
import kickerConnect.exceptions.BadRequestException;
import kickerConnect.exceptions.NotFoundException;
import kickerConnect.repositories.GroupRepository;
import kickerConnect.repositories.UserRepository;
import kickerConnect.services.GroupService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class GroupServiceImpl implements GroupService {
    private GroupRepository groupRepository;
    private UserRepository userRepository;
    private ModelMapper modelMapper;

    public GroupServiceImpl(GroupRepository groupRepository, UserRepository userRepository, ModelMapper modelMapper) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public GroupDTO createGroup(GroupDTO groupDTO) throws BadRequestException {
        Group group = modelMapper.map(groupDTO, Group.class);
        group.setActive(true);
        groupRepository.save(group);
        return modelMapper.map(group, GroupDTO.class);
    }

    @Override
    public GroupDTO getGroup(Integer groupId) throws NotFoundException, BadRequestException {
        Optional<Group> groupOptional = groupRepository.findById(groupId);
        Group group = groupOptional.orElseThrow(() -> new NotFoundException("Group not found!"));
        if (!group.isActive()) {
            throw new BadRequestException("This group is not active.");
        }
        return modelMapper.map(group, GroupDTO.class);
    }

    @Override
    public List<GroupDTO> getAllGroups() {
        List<Group> groups = groupRepository.findAll();
        List<GroupDTO> groupDTOS = new ArrayList<>();

        for (Group group : groups) {
            GroupDTO groupDTO = modelMapper.map(group, GroupDTO.class);
            groupDTOS.add(groupDTO);
        }
        return groupDTOS;
    }

    @Override
    public GroupDTO updateGroup(Integer groupId, GroupDTO groupDTO) throws NotFoundException, BadRequestException {
        Optional<Group> groupOptional = groupRepository.findById(groupId);
        Group group = groupOptional.orElseThrow(() -> new NotFoundException("Group not found."));
        if (!group.isActive()) {
            throw new BadRequestException("This group is not active.");
        }
        if (groupDTO.getName() != null) group.setName(groupDTO.getName());
        if (groupDTO.getDetails() != null) group.setDetails(groupDTO.getDetails());

        if (groupDTO.getEvents() != null) {
            List<Event> events = new ArrayList<>();
            for (EventDTO eventDTO : groupDTO.getEvents()) {
                Event event = modelMapper.map(eventDTO, Event.class);
                events.add(event);
            }
            group.setEvents(events);
        }
        if (groupDTO.getMembers() != null) {
            List<User> userList = new ArrayList<>();
            for (UserDTO userDTO : groupDTO.getMembers()) {
                User user = modelMapper.map(userDTO, User.class);
                userList.add(user);
            }
            group.setMembers(userList);
        }

        return modelMapper.map(group, GroupDTO.class);
    }

    @Override
    public GroupDTO activateGroup(Integer groupId) throws NotFoundException {
        Optional<Group> groupOptional = groupRepository.findById(groupId);
        Group group = groupOptional.orElseThrow(() -> new NotFoundException("Group not found!"));
        group.setActive(true);
        return this.modelMapper.map(group, GroupDTO.class);
    }

    @Override
    public GroupDTO deleteGroup(Integer groupId) throws NotFoundException, BadRequestException {
        Optional<Group> groupOptional = groupRepository.findById(groupId);
        Group group = groupOptional.orElseThrow(() -> new NotFoundException("Group not found."));
        group.setActive(false);
        return modelMapper.map(group, GroupDTO.class);
    }
}
