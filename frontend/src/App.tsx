import { useLayoutEffect, useState, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { AddGigPage } from "./pages/AddGigPage";
import { AuthPage } from "./pages/AuthPage";
import { ChatPage } from "./pages/ChatPage";
import { DashboardPage } from "./pages/DashboardPage";
import { useAuthStore } from "./state/authStore";
import { Preloader } from "./components/Preloader";
import "./styles-premium.css";

const AUTH_PATH = "/auth";
const PRELOADER_DURATION = 1500;

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { accessToken } = useAuthStore();
  if (!accessToken) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { accessToken } = useAuthStore();
  const location = useLocation();
  const [showPreloader, setShowPreloader] = useState(
    () => location.pathname !== AUTH_PATH
  );

  useLayoutEffect(() => {
    if (location.pathname === AUTH_PATH) {
      setShowPreloader(false);
      return;
    }
    setShowPreloader(true);
    const timer = setTimeout(() => setShowPreloader(false), PRELOADER_DURATION);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <Preloader visible={showPreloader} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-gig"
          element={
            <ProtectedRoute>
              <AddGigPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={accessToken ? "/app" : "/"} replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <AppRoutes />;
}
