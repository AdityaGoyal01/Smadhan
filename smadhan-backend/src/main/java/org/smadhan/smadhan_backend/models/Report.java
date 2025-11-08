package org.smadhan.smadhan_backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reports")
public class Report {
    @Id
    private String id;
    private String title;
    private String description;
    private String category;
    private String address;
    private Location location;
    private String imageUrl;
    private String status = "Pending";
    private String userId; // reference to User.id
    private long createdAt = System.currentTimeMillis();

    public static class Location {
        private Double lat;
        private Double lng;
        public Double getLat() { return lat; }
        public void setLat(Double lat) { this.lat = lat; }
        public Double getLng() { return lng; }
        public void setLng(Double lng) { this.lng = lng; }
    }

    // getters & setters for fields (omitted here for brevity - add them in your files)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public long getCreatedAt() { return createdAt; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }
}