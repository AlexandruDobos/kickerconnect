package kickerConnect.apis;

import jakarta.validation.Valid;
import kickerConnect.dtos.ComplaintDTO;
import kickerConnect.dtos.EventDTO;
import kickerConnect.exceptions.BadRequestException;
import kickerConnect.exceptions.NotFoundException;
import kickerConnect.services.ComplaintService;
import kickerConnect.services.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/complaint")
@Validated
@CrossOrigin(origins = "http://localhost:19006")
public class ComplaintController {
    private ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping("/add")
    public ResponseEntity<ComplaintDTO> createComplaint(@Valid @RequestBody ComplaintDTO complaintDTO) throws BadRequestException, NotFoundException {
        ComplaintDTO complaintDTO1 = complaintService.createComplaint(complaintDTO);
        return new ResponseEntity<>(complaintDTO1, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ComplaintDTO> getComplaint(@RequestParam("complaint") Integer complaintId) throws BadRequestException, NotFoundException {
        ComplaintDTO complaintDTO = complaintService.getComplaint(complaintId);
        return new ResponseEntity<>(complaintDTO, HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<ComplaintDTO>> getAllComplaints()  {
        List<ComplaintDTO> complaintDTOs = complaintService.getAllComplaints();
        return new ResponseEntity<>(complaintDTOs, HttpStatus.OK);
    }


    @DeleteMapping
    public ResponseEntity<ComplaintDTO> deleteComplaint(@RequestParam("complaint") Integer complaintId) throws NotFoundException, BadRequestException {
        ComplaintDTO complaintDTO = complaintService.deleteComplaint(complaintId);
        return new ResponseEntity<>(complaintDTO, HttpStatus.OK);
    }
}
