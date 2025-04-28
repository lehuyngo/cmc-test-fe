// src/components/HeaderBar.tsx
import { Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const HeaderBar = () => {
  const navigate = useNavigate();

  // Inside your component
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // This will remove the token AND update isAuthenticated state
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
