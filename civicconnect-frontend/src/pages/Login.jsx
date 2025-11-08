import React, { useState } from "react";
import api from "../api/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    alert("Login successful!");
    window.location.href = "/"; // ✅ Redirect to home
  } catch (err) {
    alert("Login failed. Check credentials.");
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Smadhan Login</h1>
      <form onSubmit={handleLogin} className="space-y-4 w-80">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-600 text-white p-3 w-full rounded">
          Login
        </button>
      </form>
    </div>
  );
}
