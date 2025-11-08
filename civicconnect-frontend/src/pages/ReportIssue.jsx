import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationPicker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return null;
}

export default function ReportIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Build FormData for file upload + other fields
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      if (location) {
        // send as nested object string or as lat & lng depending on backend expectation
        formData.append("location[lat]", location.lat);
        formData.append("location[lng]", location.lng);
        // Some backends expect JSON:
        // formData.append("location", JSON.stringify(location));
      }
      if (image) {
        formData.append("image", image);
      }

      await api.post("/reports", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // NOTE: do NOT set Content-Type manually when using FormData — browser will set boundary
        },
      });

      alert("Report submitted!");
      // Optionally navigate to My Reports
      navigate("/my-reports");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) navigate("/login");
      else alert(error.response?.data?.message || "Failed to submit report");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Report an Issue</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select
          className="w-full border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="road">Road</option>
          <option value="garbage">Garbage</option>
          <option value="streetlight">Streetlight</option>
          <option value="water">Water</option>
        </select>

        <input type="file" name="image" onChange={(e) => setImage(e.target.files[0])} />

        {/* Map Integration */}
        <div className="h-64 rounded-lg overflow-hidden">
          <MapContainer center={[19.076, 72.8777]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            />
            <LocationPicker setLocation={setLocation} />
            {location && <Marker position={location} icon={markerIcon} />}
          </MapContainer>
        </div>

        {location && (
          <p className="text-sm text-gray-600">
            📍 Selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </p>
        )}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Report
        </button>
      </form>
    </div>
  );
}
