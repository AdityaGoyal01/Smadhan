package org.smadhan.smadhan_backend.controllers;

import org.smadhan.smadhan_backend.config.JwtUtils;
import org.smadhan.smadhan_backend.models.User;
import org.smadhan.smadhan_backend.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final JwtUtils jwtUtils;

    public AuthController(UserService userService, JwtUtils jwtUtils) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        String role = body.get("role");

        User user = userService.register(name, email, password, role);
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email already used");
            return ResponseEntity.badRequest().body(response);
        }

        String token = jwtUtils.generateToken(user.getId(), user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());
        response.put("id", user.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        User user = userService.authenticate(email, password);
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(401).body(response);
        }

        String token = jwtUtils.generateToken(user.getId(), user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());
        response.put("id", user.getId());
        response.put("name", user.getName());
        return ResponseEntity.ok(response);
    }
}