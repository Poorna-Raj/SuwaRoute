package com.abbys.suwaroute.service;

import com.abbys.suwaroute.common.exception.DuplicateResourceException;
import com.abbys.suwaroute.common.exception.ResourceNotFoundException;
import com.abbys.suwaroute.model.ambulance.Ambulance;
import com.abbys.suwaroute.model.ambulance.AmbulanceStatus;
import com.abbys.suwaroute.repository.firebase.AmbulanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AmbulanceService {

    private final AmbulanceRepository ambulanceRepository;
    private final NearestNodeService nearestNodeService;

    public AmbulanceService(
            AmbulanceRepository ambulanceRepository,
            NearestNodeService nearestNodeService
    ) {
        this.ambulanceRepository = ambulanceRepository;
        this.nearestNodeService = nearestNodeService;
    }

    public Ambulance createAmbulance(Ambulance ambulance) {

        if (ambulanceRepository.findById(ambulance.getAmbulanceId()) != null) {
            throw new DuplicateResourceException("Ambulance already exists.");
        }

        if (ambulance.getStatus() == null) {
            ambulance.setStatus(AmbulanceStatus.AVAILABLE);
        }

        long nearestNode = nearestNodeService.findNearestNode(
                ambulance.getLatitude(),
                ambulance.getLongitude()
        );

        ambulance.setCurrentNode(nearestNode);

        return ambulanceRepository.save(ambulance);
    }

    public Ambulance getAmbulanceById(String id) {

        Ambulance ambulance = ambulanceRepository.findById(id);

        if (ambulance == null) {
            throw new ResourceNotFoundException("Ambulance not found.");
        }

        return ambulance;
    }

    public List<Ambulance> getAllAmbulances() {
        return ambulanceRepository.findAll();
    }

    public Ambulance updateAmbulance(Ambulance ambulance) {

        if (ambulanceRepository.findById(ambulance.getAmbulanceId()) == null) {
            throw new ResourceNotFoundException("Ambulance not found.");
        }

        long nearestNode = nearestNodeService.findNearestNode(
                ambulance.getLatitude(),
                ambulance.getLongitude()
        );

        ambulance.setCurrentNode(nearestNode);

        return ambulanceRepository.update(ambulance);
    }

    public void deleteAmbulance(String id) {

        if (ambulanceRepository.findById(id) == null) {
            throw new ResourceNotFoundException("Ambulance not found.");
        }

        ambulanceRepository.delete(id);
    }

    public List<Ambulance> findAvailableAmbulances() {
        return ambulanceRepository.findAvailable();
    }
}