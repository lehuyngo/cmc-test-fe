import {
  Card,
  Button,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Tooltip,
} from "antd";
import axios from "../api/axios";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [purchasedAssets, setPurchasedAssets] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    fetchAssets();
    fetchPurchases();
    getUserRole();
  }, []);

  const getUserRole = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded: any = jwtDecode(token);
        setUserRole(decoded.user_role || "");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const isCustomer = () => {
    return userRole === "customer";
  };
  const isCreator = () => {
    return userRole === "creator";
  };

  const fetchAssets = () => {
    axios.get("v1/assets").then((res) => {
      console.log("asset", res);
      setAssets(res.data.assets);
    });
  };

  const fetchPurchases = () => {
    axios.get("v1/purchases").then((res) => {
      console.log("purchase", res);
      setPurchasedAssets(res.data.purchases);
    });
  };

  const handlePurchase = async (assetId: number) => {
    try {
      await axios.post("/v1/purchases", { asset_id: assetId });
      message.success("Purchase successful!");
      fetchAssets();
    } catch {
      message.error("Purchase failed.");
    }
  };

  const handleBulkImport = async () => {
    if (fileList.length === 0) {
      message.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("json_file", fileList[0].originFileObj);

    try {
      await axios.post("/v1/assets/bulk_import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Assets imported successfully!");
      fetchAssets();
      setIsModalOpen(false);
      setFileList([]); // Reset file list
    } catch (error) {
      message.error("Failed to import assets.");
    }
  };

  const renderActionButton = (asset: any) => {
    const disabledStyle = !isCustomer()
      ? { opacity: 0.5, cursor: "not-allowed" }
      : {};

    if (asset.is_purchased) {
      return (
        <Tooltip
          title={!isCustomer() ? "Only customers can download assets" : ""}
        >
          <Button
            type="link"
            href={isCustomer() ? asset.file_url : undefined}
            target="_blank"
            disabled={!isCustomer()}
            style={disabledStyle}
          >
            Download
          </Button>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip
          title={!isCustomer() ? "Only customers can purchase assets" : ""}
        >
          <Button
            type="primary"
            onClick={isCustomer() ? () => handlePurchase(asset.id) : undefined}
            disabled={!isCustomer()}
            style={disabledStyle}
          >
            Purchase
          </Button>
        </Tooltip>
      );
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h1>Assets</h1>
        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
          disabled={!isCreator()}
        >
          Bulk Import Assets
        </Button>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {assets.map((asset: any) => (
          <Card key={asset.id} title={asset.title} style={{ width: 300 }}>
            <p>{asset.description}</p>
            <p>Price: ${asset.price}</p>
            {renderActionButton(asset)}
          </Card>
        ))}
      </div>

      {/* Modal for Bulk Import */}
      <Modal
        title="Bulk Import Assets"
        open={isModalOpen}
        onOk={handleBulkImport}
        onCancel={() => setIsModalOpen(false)}
        okText="Import"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="file_url"
            label="JSON File"
            rules={[{ required: true }]}
          >
            <Upload
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false} // Prevent automatic upload
              accept=".json"
            >
              <Button icon={<UploadOutlined />}>Select JSON File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
