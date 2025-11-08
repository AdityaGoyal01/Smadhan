package org.smadhan.smadhan_backend.repositories;

import org.smadhan.smadhan_backend.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}