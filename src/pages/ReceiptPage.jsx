import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { THB } from "../lib/utils";

export default function ReceiptPage(){
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(()=>{
    (async()=>{
      const res = await fetch(`http://localhost:3006/api/orders/${id}`);
      if (res.ok) setData(await res.json());
    })();
  },[id]);

  if (!data) return <div className="hp-container" style={{padding:"32px 0"}}>กำลังโหลด...</div>;

  const { order, items } = data;

  return (
    <main className="hp-wrap">
      <div className="hp-container">
        <div className="card" style={{padding:16}}>
          <div className="row">
            <h2 className="grow">ใบเสร็จ #{order.id}</h2>
            <button className="btn" onClick={()=>window.print()}>พิมพ์ / บันทึกเป็น PDF</button>
          </div>
          <div className="row">
            <div className="grow">
              <div><b>ลูกค้า:</b> {order.customer_name}</div>
              <div className="muted">{order.email} · {order.phone}</div>
              <div>{order.address}</div>
            </div>
            <div>
              <div><b>วันที่:</b> {new Date(order.created_at).toLocaleString("th-TH")}</div>
            </div>
          </div>
          <hr/>
          {items.map(it=>(
            <div className="row" key={it.id}>
              <div className="grow">{it.name} × {it.qty}</div>
              <div>{THB.format(it.price * it.qty)}</div>
            </div>
          ))}
          <hr/>
          <div className="row total">
            <div className="grow">ยอดรวม</div>
            <div>{THB.format(order.total)}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
