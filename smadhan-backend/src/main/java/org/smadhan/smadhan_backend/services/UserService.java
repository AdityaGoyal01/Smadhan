package org.smadhan.smadhan_backend.services;


import org.smadhan.smadhan_backend.models.User;
import org.smadhan.smadhan_backend.repositories.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository repo;
    private final BCryptPasswordEncoder encoder;

    public UserService(UserRepository repo, BCryptPasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public User register(String name, String email, String password, String role) {
        Optional<User> existing = repo.findByEmail(email);
        if (existing.isPresent()) return null;
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPassword(encoder.encode(password));
        u.setRole(role == null ? "ROLE_CITIZEN" : role);
        return repo.save(u);
    }

    public User authenticate(String email, String rawPassword) {
        return repo.findByEmail(email)
                .filter(user -> encoder.matches(rawPassword, user.getPassword()))
                .orElse(null);
    }
}