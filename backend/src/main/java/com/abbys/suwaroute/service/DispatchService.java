package com.abbys.suwaroute.service;

import com.abbys.suwaroute.model.ambulance.Ambulance;
import com.abbys.suwaroute.model.ambulance.AmbulanceStatus;
import com.abbys.suwaroute.model.emergency.Emergency;
import com.abbys.suwaroute.model.emergency.EmergencyStatus;
import com.abbys.suwaroute.model.hospital.Hospital;
import com.google.cloud.firestore.Firestore;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DispatchService {

    private final AmbulanceService ambulanceService;
    private final HospitalService hospitalService;
    private final RoutingService routingService;
    private final Firestore firestore;

    private Ambulance findNearestAvailableAmbulance(Emergency emergency) {

        Ambulance nearest = null;
        double shortestDistance = Double.MAX_VALUE;

        for (Ambulance ambulance : ambulanceService.findAvailableAmbulances()) {

            double distance = routingService.calculateDistanceBetweenNodes(
                    ambulance.getCurrentNode(),
                    emergency.getNearestNodeId()
            );

            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearest = ambulance;
            }
        }

        return nearest;
    }

    private Hospital findNearestHospital(Emergency emergency) {

        Hospital nearestHospital = null;
        double shortestDistance = Double.MAX_VALUE;

        List<Hospital> hospitals = hospitalService.findHospitalsWithAvailableBeds();

        for (Hospital hospital : hospitals) {

            double distance = routingService.calculateDistanceBetweenNodes(
                    emergency.getNearestNodeId(),
                    hospital.getCurrentNode()
            );

            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestHospital = hospital;
            }
        }

        return nearestHospital;
    }

    public Emergency dispatchEmergency(Emergency emergency) {

        Ambulance ambulance = findNearestAvailableAmbulance(emergency);

        if (ambulance == null) {
            throw new IllegalStateException("No available ambulances.");
        }

        Hospital hospital = findNearestHospital(emergency);

        if (hospital == null) {
            throw new IllegalStateException("No hospitals with ICU beds available.");
        }

        ambulance.setStatus(AmbulanceStatus.BUSY);
        ambulance.setCurrentEmergencyId(emergency.getEmergencyId());

        hospital.setAvailableIcuBeds(
                hospital.getAvailableIcuBeds() - 1
        );

        emergency.setAssignedAmbulanceId(
                ambulance.getAmbulanceId()
        );

        emergency.setAssignedHospitalId(
                hospital.getHospitalId()
        );

        emergency.setStatus(EmergencyStatus.DISPATCHED);

        try {

            firestore.runTransaction(transaction -> {

                transaction.set(
                        firestore.collection("ambulances")
                                .document(ambulance.getAmbulanceId()),
                        ambulance
                );

                transaction.set(
                        firestore.collection("hospitals")
                                .document(hospital.getHospitalId()),
                        hospital
                );

                transaction.set(
                        firestore.collection("emergencies")
                                .document(emergency.getEmergencyId()),
                        emergency
                );

                return null;

            }).get();

        } catch (Exception e) {
            throw new RuntimeException("Failed to dispatch emergency.", e);
        }

        return emergency;
    }
}