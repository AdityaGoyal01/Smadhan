import { useEffect, useState } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("All");
  const [analytics, setAnalytics] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const navigate = useNavigate();

  // Fetch all reports
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const { data } = await api.get("/admin/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      if (error.response?.status === 401) navigate("/login");
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await api.get("/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(data || analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      if (error.response?.status === 401) navigate("/login");
    }
  };

  useEffect(() => {
    fetchReports();
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update report status
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await api.patch(
        `/admin/reports/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchReports();
      await fetchAnalytics();
    } catch (error) {
      console.error("Error updating status:", error);
      if (error.response?.status === 401) navigate("/login");
    }
  };

  // Filter reports
  const filteredReports = reports.filter((r) =>
    filter === "All" ? true : (r.status || "").toLowerCase() === filter.toLowerCase()
  );

  // helper to get id (backend may use _id or id)
  const getId = (r) => r._id || r.id || r._id?.$oid;

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link to="/admin/analytics" className="bg-blue-500 text-white px-4 py-2 rounded">
          View Analytics
        </Link>
      </div>

      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      {/* Analytics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-100 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Total Reports</h3>
          <p className="text-2xl">{analytics.total ?? 0}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Pending</h3>
          <p className="text-2xl">{analytics.pending ?? 0}</p>
        </div>
        <div className="p-4 bg-orange-100 rounded shadow text-center">
          <h3 className="text-lg font-semibold">In Progress</h3>
          <p className="text-2xl">{analytics.inProgress ?? 0}</p>
        </div>
        <div className="p-4 bg-green-100 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Resolved</h3>
          <p className="text-2xl">{analytics.resolved ?? 0}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Status:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-blue-100 text-left">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((r) => {
              const id = getId(r);
              return (
                <tr key={id || Math.random()} className="border-t">
                  <td className="p-2">{r.title}</td>
                  <td className="p-2">{r.category}</td>
                  <td className="p-2">{r.status}</td>
                  <td className="p-2">{r.address}</td>
                  <td className="p-2">
                    {r.status !== "Resolved" && (
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                        onClick={() => updateStatus(id, "Resolved")}
                      >
                        Mark Resolved
                      </button>
                    )}
                    {r.status !== "In Progress" && (
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        onClick={() => updateStatus(id, "In Progress")}
                      >
                        Mark In Progress
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredReports.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="h-96 bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-lg font-semibold p-3 border-b">Map View</h3>
        <MapContainer center={[19.076, 72.8777]} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          />
          {reports
            .filter((r) => r.location && (r.location.lat || r.location.lng))
            .map((r) => {
              const lat = parseFloat(r.location.lat);
              const lng = parseFloat(r.location.lng);
              if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
              return (
                <Marker key={getId(r)} position={[lat, lng]} icon={markerIcon}>
                  <Popup>
                    <strong>{r.title}</strong>
                    <br />
                    {r.category}
                    <br />
                    Status: {r.status}
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
}
