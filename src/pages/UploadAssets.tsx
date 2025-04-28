// pages/UploadAssets.tsx
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

export default function UploadAssets() {
  const handleUpload = async (file: File) => {
    try {
      const text = await file.text();
      const assets = JSON.parse(text);

      await axios.post("/api/assets/bulk_upload", { assets });

      message.success("Assets uploaded successfully!");
    } catch (error) {
      message.error("Upload failed.");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Upload Assets</h1>
      <Upload
        accept=".json"
        customRequest={({ file }) => handleUpload(file as File)}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>Upload JSON</Button>
      </Upload>
    </div>
  );
}
