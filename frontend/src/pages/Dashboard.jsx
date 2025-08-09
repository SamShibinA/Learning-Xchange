import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Video,
  Star,
  BookOpen,
  LogOut,
  Plus,
} from "lucide-react";
import SessionCard from "./SessionCard";
import TutorCard from "./TutorCard";

const Dashboard = ({ user, onJoinCall, onSchedule, onProfileEdit, onLogout }) => {
  const [sessions, setSessions] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  // Fetch sessions and tutors from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        // Get all sessions
        const sessionRes = await axios.get("/api/sessions", config);

        // Filter sessions based on role
        const userSessions =
          user.role === "tutor"
            ? sessionRes.data.filter((s) => s.tutorId === user.id)
            : sessionRes.data.filter(
                (s) =>
                  s.enrolledLearners.includes(user.id) ||
                  s.status === "scheduled"
              );

        setSessions(userSessions);

        // Get tutors
        const tutorsRes = await axios.get("/api/users?role=tutor", config);
        setTutors(tutorsRes.data.filter((t) => t.profileComplete));
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, [user]);

  // Enroll learner in a session
  const enrollInSession = async (sessionId) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.post(`/api/sessions/${sessionId}/enroll`, {}, config);

      setSessions((prev) =>
        prev.map((item) => (item.id === sessionId ? res.data : item))
      );
    } catch (error) {
      console.error("Error enrolling in session", error);
    }
  };

  // Start live session (for tutor)
  const startLiveSession = async (sessionId) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.patch(`/api/sessions/${sessionId}/start`, {}, config);

      setSessions((prev) =>
        prev.map((item) => (item.id === sessionId ? res.data : item))
      );

      onJoinCall(res.data);
    } catch (error) {
      console.error("Error starting live session", error);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <BookOpen size={32} color="#1976d2" />
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
            LearningXchange
          </Typography>
          <Box sx={{ textAlign: "right", mr: 2 }}>
            <Typography variant="body1">{user.name}</Typography>
            <Typography variant="caption" sx={{ textTransform: "capitalize" }}>
              {user.role}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <IconButton onClick={onLogout}>
            <LogOut />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Tabs
        value={tabIndex}
        onChange={(e, v) => setTabIndex(v)}
        indicatorColor="primary"
        textColor="primary"
        centered
        sx={{ bgcolor: "white", boxShadow: 1 }}
      >
        <Tab label="Overview" />
        <Tab label="Sessions" />
        {user.role === "learner" && <Tab label="Tutors" />}
      </Tabs>

      <Container sx={{ py: 4 }}>
        {/* Overview Tab */}
        {tabIndex === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Paper elevation={1} sx={{ p: 3, bgcolor: "white" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {user.role === "tutor" ? "Total Sessions" : "Sessions Attended"}
                </Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {user.role === "tutor" ? sessions.length : user.sessionsAttended || 0}
                </Typography>
                <Box sx={{ bgcolor: "#e3f2fd", p: 1, mt: 2, borderRadius: 1 }}>
                  <BookOpen size={32} color="#1976d2" />
                </Box>
              </Paper>
            </Grid>
            {user.role === "tutor" && (
              <>
                <Grid item xs={12} md={3}>
                  <Paper elevation={1} sx={{ p: 3, bgcolor: "white" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Average Rating
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <Typography variant="h4">{user.rating?.toFixed(1) || "0.0"}</Typography>
                      <Star size={24} color="#fbc02d" style={{ marginLeft: 8 }} />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper elevation={1} sx={{ p: 3, bgcolor: "white" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Hourly Rate
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1 }}>
                      ${user.canCharge ? user.hourlyRate || 0 : 0}
                    </Typography>
                  </Paper>
                </Grid>
              </>
            )}
            <Grid item xs={12} md={3}>
              <Paper elevation={1} sx={{ p: 3, bgcolor: "white" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Live Sessions
                </Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {sessions.filter((s) => s.status === "live").length}
                </Typography>
                <Box sx={{ bgcolor: "#ffebee", p: 1, mt: 2, borderRadius: 1 }}>
                  <Video size={32} color="#c62828" />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Sessions Tab */}
        {tabIndex === 1 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h5">
                {user.role === "tutor" ? "My Sessions" : "Available Sessions"}
              </Typography>
              {user.role === "tutor" && (
                <Button variant="contained" startIcon={<Plus />} onClick={onSchedule}>
                  New Session
                </Button>
              )}
            </Box>
            <Grid container spacing={3}>
              {sessions.length > 0 ? (
                sessions.map((s) => (
                  <Grid item xs={12} md={6} key={s.id}>
                    <SessionCard
                      session={s}
                      userRole={user.role}
                      userId={user.id}
                      onEnroll={enrollInSession}
                      onStartLive={startLiveSession}
                      onJoin={onJoinCall}
                      detailed
                    />
                  </Grid>
                ))
              ) : (
                <Typography align="center" sx={{ mt: 6 }} color="text.secondary">
                  No sessions found
                </Typography>
              )}
            </Grid>
          </Box>
        )}

        {/* Tutors Tab */}
        {tabIndex === 2 && (
          <Box>
            <Typography variant="h5" mb={2}>
              Expert Tutors
            </Typography>
            {tutors.length > 0 ? (
              <Grid container spacing={3}>
                {tutors.map((t) => (
                  <Grid item xs={12} md={4} key={t.id}>
                    <TutorCard tutor={t} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography align="center" sx={{ mt: 6 }} color="text.secondary">
                No tutors available
              </Typography>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
