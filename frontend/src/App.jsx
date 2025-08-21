import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ProfileSetup from "./pages/ProfileSetup";
import SessionScheduler from "./pages/SessionScheduler";
import VideoCall from "./pages/VideoCall";

// ✅ Wrapper for session route
function VideoCallWrapper({ user, onLeave }) {
  const { id } = useParams();
  const location = useLocation();

  // If session is passed via state use that, otherwise create placeholder
  const session = location.state?.session || { id, title: "Live Session" };

  return (
    <VideoCall
      session={session}
      user={user}
      onLeave={onLeave}
      backendUrl="http://localhost:5000"
    />
  );
}

function AppRoutes({ user, setUser, loading }) {
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    if (!userData.profileComplete) {
      navigate("/profile-setup");
    } else {
      navigate("/dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth");
  };

  const handleProfileComplete = (updatedUser) => {
    setUser(updatedUser);
    navigate("/dashboard");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          !user ? (
            <Navigate to="/auth" />
          ) : !user.profileComplete ? (
            <Navigate to="/profile-setup" />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
      <Route
        path="/auth"
        element={!user ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/" />}
      />
      <Route
        path="/dashboard"
        element={
          !user ? (
            <Navigate to="/auth" />
          ) : !user.profileComplete ? (
            <Navigate to="/profile-setup" />
          ) : (
            <Dashboard
              user={user}
              onJoinCall={(session) =>
                navigate(`/session/${session.id}`, { state: { session } })
              }
              onSchedule={() => navigate("/scheduler")}
              onProfileEdit={() => navigate("/profile-setup")}
              onLogout={handleLogout}
            />
          )
        }
      />
      <Route
        path="/profile-setup"
        element={
          !user ? (
            <Navigate to="/auth" />
          ) : user.profileComplete ? (
            <Navigate to="/dashboard" />
          ) : (
            <ProfileSetup
              user={user}
              onComplete={handleProfileComplete}
              onBack={() => navigate("/dashboard")}
            />
          )
        }
      />
      <Route
        path="/scheduler"
        element={
          user ? (
            <SessionScheduler
              user={user}
              onBack={() => navigate("/dashboard")}
            />
          ) : (
            <Navigate to="/auth" />
          )
        }
      />
      {/* ✅ New session route */}
      <Route
        path="/session/:id"
        element={
          user ? (
            <VideoCallWrapper user={user} onLeave={() => navigate("/dashboard")} />
          ) : (
            <Navigate to="/auth" />
          )
        }
      />
      <Route path="*" element={<div>404 Page Not Found</div>} />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto login by fetching /me with token from localStorage
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <Router>
      <AppRoutes user={user} setUser={setUser} loading={loading} />
    </Router>
  );
}

export default App;
