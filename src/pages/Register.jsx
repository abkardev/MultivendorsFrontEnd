import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { register } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await register(form);
      alert("Registered — please login");
      nav("/login");
    } catch (err) {
      alert("Error registering");
    }
  }

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Name" />
      <input value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="Email" />
      <input type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}
