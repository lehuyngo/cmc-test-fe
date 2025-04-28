import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useAuth } from "../contexts/AuthContext";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export default function Register() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    axios
      .post("v1/authen/register", values)
      .then((response) => {
        login(response.data.token);
        console.log(response);
        localStorage.setItem("token", response.data.token);
        message.success("Login successful!");
        navigate("/assets");
        setLoading(false);
      })
      .catch((err) => {
        alert("Không thể đăng kí");
        setLoading(false);
      });
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h1>Register</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="password_confirmation"
          label="Password Confirmation"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select defaultValue="customer">
            <Option value="customer">Customer</Option>
            <Option value="creator">Creator</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Register
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            onClick={() => {
              navigate("/login");
            }}
            block
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
