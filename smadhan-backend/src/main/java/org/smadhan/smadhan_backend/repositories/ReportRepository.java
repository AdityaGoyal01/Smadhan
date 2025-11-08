package org.smadhan.smadhan_backend.repositories;

import org.smadhan.smadhan_backend.models.Report;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReportRepository extends MongoRepository<Report, String> {
    List<Report> findByUserIdOrderByCreatedAtDesc(String userId);
}