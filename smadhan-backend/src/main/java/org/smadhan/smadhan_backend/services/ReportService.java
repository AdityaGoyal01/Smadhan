package org.smadhan.smadhan_backend.services;
import org.smadhan.smadhan_backend.models.Report;
import org.smadhan.smadhan_backend.repositories.ReportRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService {
    private final ReportRepository repo;

    public ReportService(ReportRepository repo) {
        this.repo = repo;
    }

    public Report create(Report r) {
        return repo.save(r);
    }

    public List<Report> getByUser(String userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Report> getAll() {
        return repo.findAll();
    }

    public Report updateStatus(String id, String status) {
        Optional<Report> opt = repo.findById(id);
        if (!opt.isPresent()) return null;
        Report r = opt.get();
        r.setStatus(status);
        return repo.save(r);
    }
}
