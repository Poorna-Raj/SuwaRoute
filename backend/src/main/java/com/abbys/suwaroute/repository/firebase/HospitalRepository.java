package com.abbys.suwaroute.repository.firebase;

import com.abbys.suwaroute.model.hospital.Hospital;

import java.util.List;

public interface HospitalRepository {

    Hospital save(Hospital hospital);

    Hospital findById(String id);

    List<Hospital> findAll();

    Hospital update(Hospital hospital);

    void delete(String id);

    List<Hospital> findHospitalsWithAvailableBeds();
}
