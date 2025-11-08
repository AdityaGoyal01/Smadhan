package org.smadhan.smadhan_backend.controllers;

import org.smadhan.smadhan_backend.models.Report;
import org.smadhan.smadhan_backend.models.User;
import org.smadhan.smadhan_backend.services.CloudinaryService;
import org.smadhan.smadhan_backend.services.ReportService;
import org.smadhan.smadhan_backend.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final CloudinaryService cloudinaryService;
    private final UserRepository userRepository;

    public ReportController(ReportService reportService,
                            CloudinaryService cloudinaryService,
                            UserRepository userRepository) {
        this.reportService = reportService;
        this.cloudinaryService = cloudinaryService;
        this.userRepository = userRepository;
    }

    /**
     * Creates a new report submitted by an authenticated user.
     *
     * @param title       the title of the report
     * @param description detailed description of the issue
     * @param category    report category (e.g., environment, safety)
     * @param address     optional address related to the report
     * @param location    optional location coordinates (JSON-like string: {"lat":..., "lng":...})
     * @param image       optional image file associated with the report
     * @return the created report, or an error response if unauthorized or upload fails
     * @since 9+
     */
    @PostMapping
    public ResponseEntity<?> createReport(
            @RequestParam("title") String title,
        @RequestParam("description") String description,
        @RequestParam("category") String category,
        @RequestParam(value = "address", required = false) String address,
        @RequestParam(value = "location", required = false) String location,
        @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof User))
            return ResponseEntity.status(401)
                    .body(Collections.singletonMap("message", "Unauthorized")); // Java 8 compatible

        User user = (User) principal;

        Report r = new Report();
        r.setTitle(title);
        r.setDescription(description);
        r.setCategory(category);
        r.setAddress(address);
        r.setUserId(user.getId());

        // Parse location string if present
        if (location != null && !location.trim().isEmpty()) { // Java 8-compatible alternative to isBlank()
            try {
                String s = location.replaceAll("[{}\\\"]", "");
                String[] parts = s.split(",");
                Report.Location loc = new Report.Location();
                for (String p : parts) {
                    String[] kv = p.split(":");
                    if (kv[0].trim().equals("lat")) loc.setLat(Double.valueOf(kv[1]));
                    if (kv[0].trim().equals("lng")) loc.setLng(Double.valueOf(kv[1]));
                }
                r.setLocation(loc);
            } catch (Exception ignored) {
            }
        }

        // Upload image if provided
        if (image != null && !image.isEmpty()) {
            try {
                String url = cloudinaryService.upload(image);
                r.setImageUrl(url);
            } catch (IOException e) {
                return ResponseEntity.status(500)
                        .body(Collections.singletonMap("message", "Image upload failed"));
            }
        }

        Report saved = reportService.create(r);
        return ResponseEntity.status(201).body(saved);
    }

    /**
     * Retrieves reports submitted by the currently authenticated user.
     *
     * @return list of reports created by the user
     * @since 9+
     */
    @GetMapping("/user")
    public ResponseEntity<?> myReports() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof User))
            return ResponseEntity.status(401)
                    .body(Collections.singletonMap("message", "Unauthorized"));

        User user = (User) principal;
        List<Report> list = reportService.getByUser(user.getId());
        return ResponseEntity.ok(list);
    }

    /**
     * Retrieves all reports in the system.
     * <p>Accessible only by users with the ROLE_ADMIN role.</p>
     *
     * @return list of all reports
     * @since 9+
     */
    @GetMapping
    public ResponseEntity<?> allReports() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof User))
            return ResponseEntity.status(401)
                    .body(Collections.singletonMap("message", "Unauthorized"));

        User user = (User) principal;
        if (!"ROLE_ADMIN".equals(user.getRole()))
            return ResponseEntity.status(403)
                    .body(Collections.singletonMap("message", "Admin only"));

        return ResponseEntity.ok(reportService.getAll());
    }

    /**
     * Updates the status of a report.
     * <p>Accessible only by users with the ROLE_ADMIN role.</p>
     *
     * @param id   report ID
     * @param body request body containing the new status
     * @return updated report if found, or an error response
     * @since 9+
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof User))
            return ResponseEntity.status(401)
                    .body(Collections.singletonMap("message", "Unauthorized"));

        User user = (User) principal;
        if (!"ROLE_ADMIN".equals(user.getRole()))
            return ResponseEntity.status(403)
                    .body(Collections.singletonMap("message", "Admin only"));

        String status = body.get("status");
        Report updated = reportService.updateStatus(id, status);
        if (updated == null)
            return ResponseEntity.status(404)
                    .body(Collections.singletonMap("message", "Not found"));

        return ResponseEntity.ok(updated);
    }
}