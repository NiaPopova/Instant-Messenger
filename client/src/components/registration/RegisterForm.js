import "./index.scss"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [form, setForm] = useState({ username: "", password: "", email: "", name: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4002/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) navigate("/login");
  };

  return (
    <div className="form-box">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input id="username" placeholder="Username" onChange={handleChange} required />
        <input id="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input id="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input id="name" placeholder="Full Name" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
      <p>Already registered? <a href="/login">Login</a></p>
    </div>
  );
}

export default RegisterForm;