// pages/AdminEarnings.tsx
import { Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminEarnings() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("/admin/earnings").then((res) => {
      setData(res.data);
    });
  }, []);

  const columns = [
    { title: "Creator ID", dataIndex: "creator_id", key: "creator_id" },
    {
      title: "Total Earnings",
      dataIndex: "total_earnings",
      key: "total_earnings",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Creator Earnings</h1>
      <Table columns={columns} dataSource={data} rowKey="creator_id" />
    </div>
  );
}
