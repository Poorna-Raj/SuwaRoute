package com.abbys.suwaroute.controller;

import com.abbys.suwaroute.common.dto.RouteRequest;
import com.abbys.suwaroute.common.dto.RouteResponse;
import com.abbys.suwaroute.service.RoutingService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routes")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class RouteController {
    private final RoutingService routingService;

    @PostMapping
    public ResponseEntity<RouteResponse> calculateRoute(
            @RequestBody RouteRequest request
    ) {

        RouteResponse response = routingService.calculateRoute(
                request.getStartLatitude(),
                request.getStartLongitude(),
                request.getEndLatitude(),
                request.getEndLongitude()
        );

        if (response == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(response);
    }
}
