import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await login(form);
      setMsg("เข้าสู่ระบบสำเร็จ ✔");
    } catch (err) {
      setMsg(err.message || "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight:"80vh" }}>
      <div className="card shadow p-4" style={{ width: 420, borderRadius: 16 }}>
        <h3 className="text-center mb-3">เข้าสู่ระบบ</h3>
        <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
          <input className="form-control" placeholder="Username หรือ Email" name="usernameOrEmail" value={form.usernameOrEmail} onChange={onChange}/>
          <input className="form-control" placeholder="รหัสผ่าน" type="password" name="password" value={form.password} onChange={onChange}/>
          <button className="btn btn-warning text-dark fw-bold" type="submit">เข้าสู่ระบบ</button>
          {msg && <div className="alert alert-info">{msg}</div>}
        </form>
      </div>
    </div>
  );
}
