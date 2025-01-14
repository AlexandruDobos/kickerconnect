package kickerConnect.services;

import kickerConnect.dtos.ComplaintDTO;
import kickerConnect.exceptions.NotFoundException;

import java.util.List;

public interface ComplaintService {
    ComplaintDTO createComplaint(ComplaintDTO complaintDTO);
    ComplaintDTO getComplaint(Integer complaintId) throws NotFoundException;
    List<ComplaintDTO> getAllComplaints();
    ComplaintDTO deleteComplaint(Integer complaintId) throws NotFoundException;


}
