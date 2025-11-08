import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [categoryData, setCategoryData] = useState({
    labels: ["Garbage", "Potholes", "Streetlights", "Water", "Others"],
    datasets: [
      {
        label: "Reported Issues",
        data: [0, 0, 0, 0, 0],
        backgroundColor: "rgba(59,130,246,0.5)",
      },
    ],
  });

  const navigate = useNavigate();

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      // Fetch status counts
      const { data } = await api.get("/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(data || analytics);

      // If you later add a category-count endpoint, update categoryData here.
      // Example (uncomment when backend exists):
      // const categoryRes = await api.get("/admin/reports/category-count", {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // setCategoryData(prev => ({
      //   ...prev,
      //   datasets: [{ ...prev.datasets[0], data: categoryRes.data }],
      // }));
    } catch (error) {
      console.error("Error fetching analytics:", error);
      if (error.response?.status === 401) navigate("/login");
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusData = {
    labels: ["Pending", "In Progress", "Resolved"],
    datasets: [
      {
        data: [analytics.pending || 0, analytics.inProgress || 0, analytics.resolved || 0],
        backgroundColor: [
          "rgba(239,68,68,0.5)", // red
          "rgba(234,179,8,0.5)", // yellow
          "rgba(34,197,94,0.5)", // green
        ],
        borderColor: ["#ef4444", "#eab308", "#22c55e"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Analytics & Insights</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">Issues by Category</h2>
          <Bar data={categoryData} />
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">Status Distribution</h2>
          <Pie data={statusData} />
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Reports Over Time</h2>
          <Line
            data={{
              labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
              datasets: [
                {
                  label: "Reports Over Time",
                  data: [5, 9, 7, 12], // replace with API if available
                  fill: true,
                  backgroundColor: "rgba(59,130,246,0.1)",
                  borderColor: "#3b82f6",
                  tension: 0.4,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}
