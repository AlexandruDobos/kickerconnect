package kickerConnect.apis;

import jakarta.validation.Valid;
import kickerConnect.dtos.EventDTO;
import kickerConnect.exceptions.BadRequestException;
import kickerConnect.exceptions.NotFoundException;
import kickerConnect.services.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/event")
@Validated
@CrossOrigin(origins = "http://localhost:19006")
public class EventController {
    private EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping("/add")
    public ResponseEntity<EventDTO> createEvent(@Valid @RequestBody EventDTO eventDTO) throws BadRequestException, NotFoundException {
        EventDTO event = eventService.createEvent(eventDTO);
        return new ResponseEntity<>(event, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<EventDTO> getEvent(@RequestParam("event") Integer eventId) throws BadRequestException, NotFoundException {
        EventDTO eventDTO = eventService.getEvent(eventId);
        return new ResponseEntity<>(eventDTO, HttpStatus.OK);
    }

    @PatchMapping
    public ResponseEntity<EventDTO> updateEvent(@RequestParam("event") Integer eventId, @Valid @RequestBody EventDTO eventDTO) throws BadRequestException, NotFoundException {
        EventDTO updatedEventDTO = eventService.updateEvent(eventId, eventDTO);
        return new ResponseEntity<>(updatedEventDTO, HttpStatus.OK);
    }

    @PatchMapping("/activate")
    public ResponseEntity<EventDTO> activateEvent(@RequestParam("event") Integer eventId) throws NotFoundException {
        EventDTO eventDTO = eventService.activateEvent(eventId);
        return new ResponseEntity<>(eventDTO, HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<EventDTO> deleteEvent(@RequestParam("event") Integer eventId) throws NotFoundException, BadRequestException {
        EventDTO eventDTO = eventService.deleteEvent(eventId);
        return new ResponseEntity<>(eventDTO, HttpStatus.OK);
    }
}
