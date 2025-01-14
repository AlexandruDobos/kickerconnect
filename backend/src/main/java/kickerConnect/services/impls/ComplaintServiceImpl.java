package kickerConnect.services.impls;

import jakarta.transaction.Transactional;
import kickerConnect.dtos.ComplaintDTO;
import kickerConnect.dtos.EventDTO;
import kickerConnect.dtos.GroupDTO;
import kickerConnect.entities.Complaint;
import kickerConnect.entities.Event;
import kickerConnect.entities.Group;
import kickerConnect.exceptions.NotFoundException;
import kickerConnect.repositories.ComplaintRepository;
import kickerConnect.services.ComplaintService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ComplaintServiceImpl implements ComplaintService {

    private ComplaintRepository complaintRepository;
    private ModelMapper modelMapper;

    public ComplaintServiceImpl(ComplaintRepository complaintRepository, ModelMapper modelMapper) {
        this.complaintRepository = complaintRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public ComplaintDTO createComplaint(ComplaintDTO complaintDTO) {
        Complaint complaint = this.modelMapper.map(complaintDTO, Complaint.class);
        complaint.setLaunchedTime(LocalDateTime.now());
        complaint.setResolved(false);
        complaintRepository.save(complaint);
        return this.modelMapper.map(complaint, ComplaintDTO.class);
    }

    @Override
    public ComplaintDTO getComplaint(Integer complaintId) throws NotFoundException {
        Optional<Complaint> complaintOptional = complaintRepository.findById(complaintId);
        Complaint complaint = complaintOptional.orElseThrow(() -> new NotFoundException("Complaint not found!"));
        return this.modelMapper.map(complaint, ComplaintDTO.class);
    }

    @Override
    public List<ComplaintDTO> getAllComplaints() {
        List<Complaint> complaints = complaintRepository.findAll();
        List<ComplaintDTO> complaintDTOS = new ArrayList<>();

        for (Complaint complaint : complaints) {
            ComplaintDTO complaintDTO = modelMapper.map(complaint, ComplaintDTO.class);
            complaintDTOS.add(complaintDTO);
        }
        return complaintDTOS;
    }

    @Override
    public ComplaintDTO deleteComplaint(Integer complaintId) throws NotFoundException {
        Optional<Complaint> complaintOptional = complaintRepository.findById(complaintId);
        Complaint complaint = complaintOptional.orElseThrow(() -> new NotFoundException("Compliant not found!"));
        complaint.setResolved(true);
        complaint.setResolvedTime(LocalDateTime.now());
        return modelMapper.map(complaint, ComplaintDTO.class);
    }
}
