import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", form);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl mb-4 text-center">Signup</h2>
        <input
          className="border w-full mb-3 px-3 py-2"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border w-full mb-3 px-3 py-2"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          className="border w-full mb-3 px-3 py-2"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-blue-600 text-white px-4 py-2 w-full rounded">Signup</button>
      </form>
    </div>
  );
}
