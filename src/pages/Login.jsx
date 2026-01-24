import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await login(form);
      nav("/");
    } catch (err) {
      alert("Invalid credentials");
    }
  }

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="Email" />
      <input type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
