package com.abbys.suwaroute.service;

import com.abbys.suwaroute.common.exception.DuplicateResourceException;
import com.abbys.suwaroute.common.exception.ResourceNotFoundException;
import com.abbys.suwaroute.model.hospital.Hospital;
import com.abbys.suwaroute.repository.firebase.HospitalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalService {

    private final HospitalRepository repository;
    private final NearestNodeService nearestNodeService;

    public HospitalService(
            HospitalRepository repository,
            NearestNodeService nearestNodeService
    ) {
        this.repository = repository;
        this.nearestNodeService = nearestNodeService;
    }

    public Hospital createHospital(Hospital hospital) {

        if (repository.findById(hospital.getHospitalId()) != null) {
            throw new DuplicateResourceException(
                    "Hospital with ID '" + hospital.getHospitalId() + "' already exists."
            );
        }

        long nearestNode = nearestNodeService.findNearestNode(
                hospital.getLatitude(),
                hospital.getLongitude()
        );

        hospital.setCurrentNode(nearestNode);

        return repository.save(hospital);
    }

    public Hospital getHospitalById(String id) {

        Hospital hospital = repository.findById(id);

        if (hospital == null) {
            throw new ResourceNotFoundException(
                    "Hospital with ID '" + id + "' not found."
            );
        }

        return hospital;
    }

    public List<Hospital> getAllHospitals() {
        return repository.findAll();
    }

    public Hospital updateHospital(String id, Hospital hospital) {

        if (repository.findById(id) == null) {
            throw new ResourceNotFoundException(
                    "Hospital with ID '" + id + "' not found."
            );
        }

        hospital.setHospitalId(id);

        long nearestNode = nearestNodeService.findNearestNode(
                hospital.getLatitude(),
                hospital.getLongitude()
        );

        hospital.setCurrentNode(nearestNode);

        return repository.update(hospital);
    }

    public void deleteHospital(String id) {

        if (repository.findById(id) == null) {
            throw new ResourceNotFoundException(
                    "Hospital with ID '" + id + "' not found."
            );
        }

        repository.delete(id);
    }

    public List<Hospital> findHospitalsWithAvailableBeds() {
        return repository.findHospitalsWithAvailableBeds();
    }
}