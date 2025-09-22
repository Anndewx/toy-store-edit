import { useState } from "react";

const API = import.meta.env.VITE_API_BASE || "http://localhost:3006/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Register failed");
      // เก็บ token ไว้ใช้งานต่อ (เช่น localStorage)
      localStorage.setItem("token", data.token);
      setMsg("สมัครสมาชิกสำเร็จ ✔");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="container-narrow">
      <h2 className="mb-3">สมัครสมาชิก</h2>
      <form onSubmit={onSubmit} className="d-flex flex-column gap-2" style={{ maxWidth: 420 }}>
        <input className="form-control" placeholder="ชื่อ" name="name" value={form.name} onChange={onChange} />
        <input className="form-control" placeholder="อีเมล" name="email" value={form.email} onChange={onChange} />
        <input className="form-control" placeholder="รหัสผ่าน" type="password" name="password" value={form.password} onChange={onChange} />
        <button className="btn btn-dark mt-2" type="submit">สมัครสมาชิก</button>
        {msg && <div className="mt-2">{msg}</div>}
      </form>
    </div>
  );
}
