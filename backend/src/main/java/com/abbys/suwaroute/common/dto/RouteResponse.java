package com.abbys.suwaroute.common.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class RouteResponse {
    private double distanceMeters;
    private List<Coordinate> path;
}
