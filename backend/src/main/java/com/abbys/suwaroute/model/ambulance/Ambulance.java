package com.abbys.suwaroute.model.ambulance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ambulance {
    private String ambulanceId;
    private AmbulanceStatus status;
    private Long currentNode;
    private double latitude;
    private double longitude;
    private double speed;
    private String currentEmergencyId;
}
