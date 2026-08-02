package com.abbys.suwaroute.service;

import com.abbys.suwaroute.common.utils.GeoUtils;
import com.abbys.suwaroute.model.graph.Graph;
import com.abbys.suwaroute.model.osm.OsmNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Service;

@Data
@AllArgsConstructor
@Service
public class NearestNodeService {
    private final Graph graph;

    public long findNearestNode(double latitude, double longitude){
        double shortestDistance = Double.MAX_VALUE;
        long nearestNodeId = -1;

        for(OsmNode node: graph.getNodes().values()){
            double distance = GeoUtils.haversine(
                    latitude,
                    longitude,
                    node.getLatitude(),
                    node.getLongitude()
            );

            if(distance < shortestDistance){
                shortestDistance = distance;
                nearestNodeId = node.getId();
            }
        }

        return nearestNodeId;
    }

}
