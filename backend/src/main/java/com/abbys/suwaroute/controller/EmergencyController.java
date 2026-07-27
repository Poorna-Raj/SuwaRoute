package com.abbys.suwaroute.controller;

import com.abbys.suwaroute.common.ApiResponse;
import com.abbys.suwaroute.model.emergency.Emergency;
import com.abbys.suwaroute.service.EmergencyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergencies")
public class EmergencyController {

    private final EmergencyService emergencyService;

    public EmergencyController(EmergencyService emergencyService) {
        this.emergencyService = emergencyService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Emergency>> createEmergency(
            @RequestBody Emergency emergency) {

        Emergency saved = emergencyService.createEmergency(emergency);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Emergency created successfully.",
                        saved
                ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Emergency>> getEmergencyById(
            @PathVariable String id) {

        Emergency emergency = emergencyService.getEmergencyById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Emergency retrieved successfully.",
                        emergency
                )
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Emergency>>> getAllEmergencies() {

        List<Emergency> emergencies = emergencyService.getAllEmergencies();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Emergencies retrieved successfully.",
                        emergencies
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Emergency>> updateEmergency(
            @PathVariable String id,
            @RequestBody Emergency emergency) {

        Emergency updated = emergencyService.updateEmergency(id, emergency);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Emergency updated successfully.",
                        updated
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmergency(
            @PathVariable String id) {

        emergencyService.deleteEmergency(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Emergency deleted successfully.",
                        null
                )
        );
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<Emergency>> completeEmergency(
            @PathVariable String id) {

        Emergency completed =
                emergencyService.completeEmergency(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Emergency completed successfully.",
                        completed
                )
        );
    }
}