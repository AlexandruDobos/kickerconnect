package kickerConnect.services;

import kickerConnect.dtos.GroupDTO;
import kickerConnect.exceptions.BadRequestException;
import kickerConnect.exceptions.NotFoundException;

import java.util.List;

public interface GroupService {

    GroupDTO createGroup(GroupDTO groupDTO) throws BadRequestException;

    GroupDTO getGroup(Integer groupId) throws NotFoundException, BadRequestException;

    List<GroupDTO> getAllGroups();

    GroupDTO updateGroup(Integer groupId, GroupDTO groupDTO) throws NotFoundException, BadRequestException;

    GroupDTO activateGroup(Integer groupId) throws NotFoundException;

    GroupDTO deleteGroup(Integer groupId) throws NotFoundException, BadRequestException;

}
