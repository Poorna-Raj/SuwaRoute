package com.abbys.suwaroute.model.routing;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RouteResult {
    private List<Long> nodeIds;
    private double totalDistance;
}
