package com.abbys.suwaroute.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RouteRequest {
    private double startLatitude;
    private double startLongitude;

    private double endLatitude;
    private double endLongitude;
}
