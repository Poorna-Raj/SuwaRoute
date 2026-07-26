package com.abbys.suwaroute.model.emergency;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Emergency {
    private String emergencyId;
    private String callerName;
    private String callerNumber;
    private double longitude;
    private double latitude;
    private long nearestNodeId;
    private EmergencySeverity severity;
    private EmergencyStatus status;
    private String assignedAmbulanceId;
    private String assignedHospitalId;
    private LocalDateTime createdAt;
}
