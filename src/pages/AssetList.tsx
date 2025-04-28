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
} from "antd";
import axios from "../api/axios";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [purchasedAssets, setPurchasedAssets] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    fetchAssets();
    fetchPurchases();
  }, []);

  const fetchAssets = () => {
    axios.get("v1/assets").then((res) => {
      console.log("asset", res);
      setAssets(res.data);
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
      fetchPurchases();
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
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Bulk Import Assets
        </Button>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {assets.map((asset: any) => (
          <Card key={asset.id} title={asset.title} style={{ width: 300 }}>
            <p>{asset.description}</p>
            <p>Price: ${asset.price}</p>

            {asset.is_purchased ? (
              <Button type="link" href={asset.file_url} target="_blank">
                Download
              </Button>
            ) : (
              <Button type="primary" onClick={() => handlePurchase(asset.id)}>
                Purchase
              </Button>
            )}
          </Card>
        ))}
      </div>

      {/* Modal để thêm Asset */}
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
              beforeUpload={() => false} // Ngừng upload tệp tự động
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
