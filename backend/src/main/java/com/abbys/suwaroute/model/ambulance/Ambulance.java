package com.abbys.suwaroute.model.ambulance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Ambulance {
    private String ambulanceId;
    private AmbulanceStatus status;
    private String currentNode;
    private double longitude;
    private double latitude;
    private double speed;
    private String currentEmergencyId;
}
