package org.smadhan.smadhan_backend.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryService() {
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", System.getenv("CLOUDINARY_CLOUD_NAME"),
                "api_key", System.getenv("CLOUDINARY_API_KEY"),
                "api_secret", System.getenv("CLOUDINARY_API_SECRET")
        ));
    }

    public String upload(MultipartFile file) throws IOException {
        Map<?,?> res = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", "smadhan"));
        return (String) res.get("secure_url");
    }
}
