import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ReportIssue from "./pages/ReportIssue";
import MyReports from "./pages/MyReports";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<Analytics />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}
