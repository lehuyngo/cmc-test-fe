// src/components/Sidebar.tsx
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Sidebar = () => {
  const navigate = useNavigate();

  // Lấy token từ localStorage
  const token = localStorage.getItem("token");

  // Giải mã token để lấy user_role
  let userRole = null;
  if (token) {
    const decodedToken: any = jwtDecode(token);
    userRole = decodedToken?.user_role;
  }

  // Menu items, chỉ hiển thị "Earnings" nếu userRole là 'admin'
  const menuItems = [
    {
      key: "/assets",
      label: "Assets",
    },
    {
      key: "/purchases",
      label: "Purchases",
    },
    ...(userRole === "admin"
      ? [
          {
            key: "/earnings",
            label: "Earnings",
          },
        ]
      : []),
  ];

  const handleMenuClick = (e: any) => {
    navigate(e.key);
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["/assets"]}
      onClick={handleMenuClick}
      items={menuItems}
    />
  );
};

export default Sidebar;
