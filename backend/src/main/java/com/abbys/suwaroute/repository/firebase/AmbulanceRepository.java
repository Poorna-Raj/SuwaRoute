package com.abbys.suwaroute.repository.firebase;

import com.abbys.suwaroute.model.ambulance.Ambulance;

import java.util.List;

public interface AmbulanceRepository {

    Ambulance save(Ambulance ambulance) throws Exception;

    Ambulance findById(String ambulanceId) throws Exception;

    List<Ambulance> findAll() throws Exception;

    Ambulance update(Ambulance ambulance) throws Exception;

    void delete(String ambulanceId) throws Exception;

}
