package com.abbys.suwaroute.service;

import com.abbys.suwaroute.common.exception.DuplicateResourceException;
import com.abbys.suwaroute.common.exception.ResourceNotFoundException;
import com.abbys.suwaroute.model.ambulance.Ambulance;
import com.abbys.suwaroute.model.ambulance.AmbulanceStatus;
import com.abbys.suwaroute.model.emergency.Emergency;
import com.abbys.suwaroute.model.emergency.EmergencyStatus;
import com.abbys.suwaroute.repository.firebase.EmergencyRepository;
import com.google.cloud.firestore.Firestore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyService {

    private final EmergencyRepository repository;
    private final DispatchService dispatchService;
    private final NearestNodeService nearestNodeService;
    private  final AmbulanceService ambulanceService;
    private final Firestore firestore;

    public EmergencyService(
            EmergencyRepository repository,
            DispatchService dispatchService,
            NearestNodeService nearestNodeService, AmbulanceService ambulanceService, Firestore firestore
    ) {
        this.repository = repository;
        this.dispatchService = dispatchService;
        this.nearestNodeService = nearestNodeService;
        this.ambulanceService = ambulanceService;
        this.firestore = firestore;
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

        long nearestNode = nearestNodeService.findNearestNode(
                emergency.getLatitude(),
                emergency.getLongitude()
        );

        emergency.setNearestNodeId(nearestNode);

        Emergency savedEmergency = repository.save(emergency);

        return dispatchService.dispatchEmergency(savedEmergency);
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

        long nearestNode = nearestNodeService.findNearestNode(
                emergency.getLatitude(),
                emergency.getLongitude()
        );

        emergency.setNearestNodeId(nearestNode);

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

    public Emergency completeEmergency(String emergencyId){
        Emergency emergency = repository.findById(emergencyId);

        Ambulance ambulance = ambulanceService.getAmbulanceById(
                emergency.getAssignedAmbulanceId()
        );

        ambulance.setStatus(AmbulanceStatus.AVAILABLE);
        ambulance.setCurrentEmergencyId(null);
        emergency.setStatus(EmergencyStatus.COMPLETED);

        try{
            firestore.runTransaction(transaction -> {
                transaction.set(
                        firestore.collection("emergencies")
                                .document(emergencyId),emergency
                );
                transaction.set(
                        firestore.collection("ambulances")
                                .document(ambulance.getAmbulanceId()),ambulance
                );

                return null;
            }).get();
        } catch (Exception e) {
            throw new RuntimeException("Failed to dispatch emergency.", e);
        }
        return emergency;
    }
}