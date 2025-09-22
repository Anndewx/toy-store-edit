import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await register(form);
      setMsg("สมัครสมาชิกสำเร็จ ✔");
    } catch (err) {
      setMsg(err.message || "Register failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight:"80vh" }}>
      <div className="card shadow p-4" style={{ width: 420, borderRadius: 16 }}>
        <h3 className="text-center mb-3">สมัครสมาชิก</h3>
        <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
          <input className="form-control" placeholder="ชื่อผู้ใช้ (Username)" name="name" value={form.name} onChange={onChange}/>
          <input className="form-control" placeholder="อีเมล" name="email" value={form.email} onChange={onChange}/>
          <input className="form-control" placeholder="รหัสผ่าน" type="password" name="password" value={form.password} onChange={onChange}/>
          <button className="btn btn-warning text-dark fw-bold" type="submit">สมัครสมาชิก</button>
          {msg && <div className="alert alert-info">{msg}</div>}
        </form>
      </div>
    </div>
  );
}
