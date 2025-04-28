import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "../api/axios"; // nhớ import axios hoặc fetch
import { title } from "process";

interface Purchase {
  id: number;
  amount: number;
  asset: {
    title: string;
  };
  customer: {
    name: string;
  };
  creator: {
    name: string;
  };
}

export default function PurchasesList() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    console.log("Fetching purchases...");
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get("/v1/purchases"); // hoặc sửa URL đúng của bạn
      setPurchases(response.data.purchases);
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
    }
  };

  const columns = [
    {
      title: "Purchase ID",
      dataIndex: ["purchase_id"],
      key: "purchase_id",
    },
    {
      title: "Asset",
      dataIndex: ["asset", "title"],
      key: "asset",
    },
    {
      title: "Amount Paid",
      dataIndex: "purchase_amount",
      key: "purchase_amount",
      render: (amount: number) => `$${amount}`,
    },
    {
      title: "Customer",
      dataIndex: ["customer", "name"],
      key: "customer",
    },
    {
      title: "Creator",
      dataIndex: ["creator", "name"],
      key: "creator",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Purchases</h1>
      <Table rowKey="id" columns={columns} dataSource={purchases} />
    </div>
  );
}
