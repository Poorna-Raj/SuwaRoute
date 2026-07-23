package com.abbys.suwaroute.controller;

import com.abbys.suwaroute.common.ApiResponse;
import com.abbys.suwaroute.model.hospital.Hospital;
import com.abbys.suwaroute.service.HospitalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Hospital>> createHospital(
            @RequestBody Hospital hospital) {

        Hospital saved = hospitalService.createHospital(hospital);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Hospital created successfully.",
                        saved
                ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Hospital>> getHospitalById(
            @PathVariable String id) {

        Hospital hospital = hospitalService.getHospitalById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Hospital retrieved successfully.",
                        hospital
                )
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Hospital>>> getAllHospitals() {

        List<Hospital> hospitals = hospitalService.getAllHospitals();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Hospitals retrieved successfully.",
                        hospitals
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Hospital>> updateHospital(
            @PathVariable String id,
            @RequestBody Hospital hospital) {

        Hospital updated = hospitalService.updateHospital(id, hospital);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Hospital updated successfully.",
                        updated
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHospital(
            @PathVariable String id) {

        hospitalService.deleteHospital(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Hospital deleted successfully.",
                        null
                )
        );
    }
}
