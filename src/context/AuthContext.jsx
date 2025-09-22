import React, { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

const LS = "ct_auth_v1";

export default function AuthProvider({ children }){
  const [token,setToken] = useState(()=>localStorage.getItem(LS) || "");
  const [user,setUser] = useState(()=> token ? JSON.parse(localStorage.getItem(LS+"_user")||"null") : null);

  useEffect(()=>{
    if (token) localStorage.setItem(LS, token);
    else localStorage.removeItem(LS);
    if (user) localStorage.setItem(LS+"_user", JSON.stringify(user));
    else localStorage.removeItem(LS+"_user");
  },[token,user]);

  const login = async (username, password)=>{
    const res = await fetch("http://localhost:3006/api/auth/login", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "login failed");
    setToken(data.token); setUser(data.user);
  };

  const register = async (username, email, password)=>{
    const res = await fetch("http://localhost:3006/api/auth/register", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ username, email, password })
    });
    if (!res.ok) throw new Error((await res.json()).message || "register failed");
    // สมัครเสร็จ -> ให้ login ต่อเอง
  };

  const logout = ()=>{ setToken(""); setUser(null); };

  return <Ctx.Provider value={{ token, user, login, register, logout }}>{children}</Ctx.Provider>;
}
