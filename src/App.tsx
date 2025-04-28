import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AssetsList from "./pages/AssetList";
import PurchasesList from "./pages/PurchaseList";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Sidebar from "./components/SideBar";
import HeaderBar from "./components/HeaderBar";
import { Layout, Spin } from "antd";
import EarningList from "./pages/EarningList";

const { Sider, Content } = Layout;

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Spin
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "200px",
        }}
      />
    );
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/assets";

  if (isLoading) {
    return (
      <Spin
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "200px",
        }}
      />
    );
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to={from} replace />;
}

// Separate auth listener component
function AuthStateListener() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If not authenticated and not on login/register page, redirect to login
    if (
      !isAuthenticated &&
      !location.pathname.includes("/login") &&
      !location.pathname.includes("/register")
    ) {
      navigate("/login");
    }
  }, [isAuthenticated, location, navigate]);

  return null;
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Router>
      <AuthStateListener />
      <Layout style={{ minHeight: "100vh" }}>
        {isAuthenticated && (
          <Sider collapsible>
            <Sidebar />
          </Sider>
        )}
        <Layout>
          {isAuthenticated && <HeaderBar />}
          <Content style={{ margin: "16px" }}>
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
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
              <Route
                path="*"
                element={
                  <Navigate to={isAuthenticated ? "/assets" : "/login"} />
                }
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
