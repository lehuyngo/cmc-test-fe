import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AssetsList from "./pages/AssetList";
import PurchasesList from "./pages/PurchaseList";
import { AuthProvider } from "./contexts/AuthContext";
import Sidebar from "./components/SideBar";
import HeaderBar from "./components/HeaderBar";

import { Layout } from "antd";
import EarningList from "./pages/EarningList";

const { Sider, Content } = Layout;

function PrivateRoute({ children }: { children: any }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const token = localStorage.getItem("token");

  return (
    <AuthProvider>
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          {token && (
            <Sider collapsible>
              <Sidebar />
            </Sider>
          )}
          <Layout>
            {token && <HeaderBar />}
            <Content style={{ margin: "16px" }}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/assets"
                  element={
                    <PrivateRoute>
                      <AssetsList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/purchases"
                  element={
                    <PrivateRoute>
                      <PurchasesList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/earnings"
                  element={
                    <PrivateRoute>
                      <EarningList />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
