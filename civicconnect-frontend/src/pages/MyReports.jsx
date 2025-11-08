import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await api.get("/reports/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
        if (error.response?.status === 401) navigate("/login");
      }
    };
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">My Reported Issues</h1>

      {reports.length === 0 ? (
        <p className="text-gray-600">No reports submitted yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report._id || report.id}
              className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
            >
              {report.imageUrl ? (
                <img
                  src={report.imageUrl}
                  alt={report.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{report.title}</h2>
              <p className="text-gray-600 mb-2">{report.description}</p>
              <p className="text-sm text-gray-500 mb-2">
                Category: <span className="font-medium">{report.category}</span>
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  report.status === "Resolved"
                    ? "bg-green-100 text-green-700"
                    : report.status === "In Progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {report.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
