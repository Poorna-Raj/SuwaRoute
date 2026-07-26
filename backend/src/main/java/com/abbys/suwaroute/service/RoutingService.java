package com.abbys.suwaroute.service;

import com.abbys.suwaroute.model.routing.RouteResult;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class RoutingService {
    private final NearestNodeService nodeService;
    private final DijkstraService dijkstraService;

    public RouteResult calculateRoute(
            double startLat,
            double startLon,
            double endLat,
            double endLon
    ){
        long source = nodeService.findNearestNode(startLat,startLon);
        long destination = nodeService.findNearestNode(endLat,endLon);

        return dijkstraService.shortestPath(
                source,
                destination
        );
    }
}
