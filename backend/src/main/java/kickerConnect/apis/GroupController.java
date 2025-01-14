package kickerConnect.apis;

import jakarta.validation.Valid;
import kickerConnect.dtos.EventDTO;
import kickerConnect.dtos.GroupDTO;
import kickerConnect.dtos.UserDTO;
import kickerConnect.exceptions.BadRequestException;
import kickerConnect.exceptions.NotFoundException;
import kickerConnect.services.GroupService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/group")
@Validated
@CrossOrigin(origins = "http://localhost:19006")
public class GroupController {

    private GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping("/add")
    public ResponseEntity<GroupDTO> createGroup(@Valid @RequestBody GroupDTO groupDTO) throws BadRequestException {
        GroupDTO group = groupService.createGroup(groupDTO);
        return new ResponseEntity<>(group, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<GroupDTO> getGroup(@RequestParam("group") Integer groupId) throws BadRequestException, NotFoundException {
        GroupDTO groupDTO = groupService.getGroup(groupId);
        return new ResponseEntity<>(groupDTO, HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<GroupDTO>> getGroup() {
        List<GroupDTO> groupDTOS = groupService.getAllGroups();
        return new ResponseEntity<>(groupDTOS, HttpStatus.OK);
    }

    @PatchMapping
    public ResponseEntity<GroupDTO> updateGroup(@RequestParam("group") Integer groupId, @Valid @RequestBody GroupDTO groupDTO) throws BadRequestException, NotFoundException {
        GroupDTO updatedGroupDTO = groupService.updateGroup(groupId, groupDTO);
        return new ResponseEntity<>(updatedGroupDTO, HttpStatus.OK);
    }

    @PatchMapping("/activate")
    public ResponseEntity<GroupDTO> activateGroup(@RequestParam("group") Integer groupId) throws NotFoundException {
        GroupDTO groupDTO = groupService.activateGroup(groupId);
        return new ResponseEntity<>(groupDTO, HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<GroupDTO> deleteGroup(@RequestParam("group") Integer groupId) throws NotFoundException, BadRequestException {
        GroupDTO groupDTO = groupService.deleteGroup(groupId);
        return new ResponseEntity<>(groupDTO, HttpStatus.OK);
    }
}
