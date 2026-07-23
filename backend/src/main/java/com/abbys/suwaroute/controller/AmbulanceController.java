package com.abbys.suwaroute.controller;

import com.abbys.suwaroute.common.ApiResponse;
import com.abbys.suwaroute.model.ambulance.Ambulance;
import com.abbys.suwaroute.service.AmbulanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ambulances")
@CrossOrigin(origins = "*")
public class AmbulanceController {

    private final AmbulanceService ambulanceService;

    public AmbulanceController(AmbulanceService ambulanceService) {
        this.ambulanceService = ambulanceService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Ambulance>> createAmbulance(
            @RequestBody Ambulance ambulance) {

        Ambulance saved = ambulanceService.createAmbulance(ambulance);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Ambulance created successfully.",
                        saved
                ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Ambulance>> getById(
            @PathVariable String id) {

        Ambulance ambulance = ambulanceService.getAmbulanceById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Ambulance retrieved successfully.",
                        ambulance
                ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Ambulance>>> getAll() {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Ambulances retrieved successfully.",
                        ambulanceService.getAllAmbulances()
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Ambulance>> update(
            @PathVariable String id,
            @RequestBody Ambulance ambulance) {

        ambulance.setAmbulanceId(id);

        Ambulance updated = ambulanceService.updateAmbulance(ambulance);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Ambulance updated successfully.",
                        updated
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable String id) throws Exception {

        ambulanceService.deleteAmbulance(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Ambulance deleted successfully.",
                        null
                )
        );
    }
}