package com.abbys.suwaroute.repository.firebase;

import com.abbys.suwaroute.model.emergency.Emergency;

import java.util.List;

public interface EmergencyRepository {
    Emergency save(Emergency emergency);

    Emergency findById(String id);

    List<Emergency> findAll();

    Emergency update(Emergency emergency);

    void delete(String id);
}
