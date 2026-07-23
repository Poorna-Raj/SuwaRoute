package com.abbys.suwaroute.repository.firebase;

import com.abbys.suwaroute.model.ambulance.Ambulance;

import java.util.List;

public interface AmbulanceRepository {

    Ambulance save(Ambulance ambulance);

    Ambulance findById(String ambulanceId);

    List<Ambulance> findAll();

    Ambulance update(Ambulance ambulance);

    void delete(String ambulanceId);

}
