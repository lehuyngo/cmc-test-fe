// src/components/HeaderBar.tsx
import { Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

const HeaderBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: 16,
        background: "#fff",
      }}
    >
      <Space>
        <Button danger onClick={handleLogout}>
          Logout
        </Button>
      </Space>
    </div>
  );
};

export default HeaderBar;
