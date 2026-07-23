package com.abbys.suwaroute.service;

import com.abbys.suwaroute.common.exception.DuplicateResourceException;
import com.abbys.suwaroute.common.exception.ResourceNotFoundException;
import com.abbys.suwaroute.model.emergency.Emergency;
import com.abbys.suwaroute.model.emergency.EmergencyStatus;
import com.abbys.suwaroute.repository.firebase.EmergencyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyService {

    private final EmergencyRepository repository;

    public EmergencyService(EmergencyRepository repository) {
        this.repository = repository;
    }

    public Emergency createEmergency(Emergency emergency) {

        if (repository.findById(emergency.getEmergencyId()) != null) {
            throw new DuplicateResourceException(
                    "Emergency with ID '" + emergency.getEmergencyId() + "' already exists."
            );
        }

        if (emergency.getStatus() == null) {
            emergency.setStatus(EmergencyStatus.PENDING);
        }

        return repository.save(emergency);
    }

    public Emergency getEmergencyById(String id) {

        Emergency emergency = repository.findById(id);

        if (emergency == null) {
            throw new ResourceNotFoundException(
                    "Emergency with ID '" + id + "' not found."
            );
        }

        return emergency;
    }

    public List<Emergency> getAllEmergencies() {
        return repository.findAll();
    }

    public Emergency updateEmergency(String id, Emergency emergency) {

        if (repository.findById(id) == null) {
            throw new ResourceNotFoundException(
                    "Emergency with ID '" + id + "' not found."
            );
        }

        emergency.setEmergencyId(id);

        return repository.update(emergency);
    }

    public void deleteEmergency(String id) {

        if (repository.findById(id) == null) {
            throw new ResourceNotFoundException(
                    "Emergency with ID '" + id + "' not found."
            );
        }

        repository.delete(id);
    }
}