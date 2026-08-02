package com.abbys.suwaroute.model.hospital;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Hospital {
    private String hospitalId;
    private String hospitalName;
    private double longitude;
    private double latitude;
    private Long currentNode;
    private int availableIcuBeds;
    private String contactNumber;
}
