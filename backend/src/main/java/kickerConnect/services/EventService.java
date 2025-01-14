package kickerConnect.services;

import kickerConnect.dtos.EventDTO;
import kickerConnect.exceptions.BadRequestException;
import kickerConnect.exceptions.NotFoundException;

public interface EventService {

    EventDTO createEvent(EventDTO eventDTO) throws BadRequestException, NotFoundException;

    EventDTO getEvent(Integer eventId) throws NotFoundException, BadRequestException;

    EventDTO updateEvent(Integer eventId, EventDTO eventDTO) throws NotFoundException, BadRequestException;

    EventDTO activateEvent(Integer eventId) throws NotFoundException;

    EventDTO deleteEvent(Integer eventId) throws NotFoundException, BadRequestException;
}
