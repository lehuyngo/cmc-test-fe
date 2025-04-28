import { useEffect, useState } from "react";
import { Table, Card, Spin, message } from "antd";
import axios from "../api/axios";

interface Earning {
  creator_id: number;
  creator_name: string;
  total_earnings: number;
}

const EarningList = () => {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      axios.get("/v1/admin/earnings").then((res) => {
        setEarnings(res.data);
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to load earnings");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Creator ID",
      dataIndex: "creator_id",
      key: "creator_id",
    },
    {
      title: "Creator Name",
      dataIndex: "creator_name",
      key: "creator_name",
    },
    {
      title: "Total Earnings ($)",
      dataIndex: "total_earnings",
      key: "total_earnings",
    },
  ];

  return (
    <Card title="Creator Earnings">
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={earnings}
          columns={columns}
          rowKey="creator_id"
          pagination={false}
        />
      )}
    </Card>
  );
};

export default EarningList;
