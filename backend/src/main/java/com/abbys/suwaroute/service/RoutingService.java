package com.abbys.suwaroute.service;

import com.abbys.suwaroute.common.dto.Coordinate;
import com.abbys.suwaroute.common.dto.RouteResponse;
import com.abbys.suwaroute.model.graph.Graph;
import com.abbys.suwaroute.model.osm.OsmNode;
import com.abbys.suwaroute.model.routing.RouteResult;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class RoutingService {

    private final NearestNodeService nodeService;
    private final DijkstraService dijkstraService;
    private final Graph graph;

    public RouteResponse calculateRoute(
            double startLat,
            double startLon,
            double endLat,
            double endLon
    ) {

        long source = nodeService.findNearestNode(startLat, startLon);
        long destination = nodeService.findNearestNode(endLat, endLon);

        RouteResult routeResult = dijkstraService.shortestPath(source, destination);

        if (routeResult == null) {
            return null;
        }

        List<Coordinate> path = new ArrayList<>();

        for (Long nodeId : routeResult.getNodeIds()) {

            OsmNode node = graph.getNodes().get(nodeId);

            path.add(new Coordinate(
                    node.getLatitude(),
                    node.getLongitude()
            ));
        }

        return RouteResponse.builder()
                .distanceMeters(routeResult.getTotalDistance())
                .path(path)
                .build();
    }
}