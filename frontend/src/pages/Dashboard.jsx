

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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Video, Star, DollarSign, BookOpen, LogOut, Plus } from "lucide-react";
import SessionCard from "./SessionCard";
import TutorCard from "./TutorCard";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Dashboard = ({ user, onJoinCall, onSchedule, onProfileEdit, onLogout }) => {
  const [sessions, setSessions] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const sessionRes = await axios.get(
          `${backendUrl}/api/sessions`,
          config
        );

        let userSessions = [];
        if (user.role === "tutor") {
          userSessions = sessionRes.data.filter((s) => s.tutorId === user._id);
        } else {
          userSessions = sessionRes.data.filter(
            (s) =>
              (Array.isArray(s.enrolledLearners) &&
                s.enrolledLearners.includes(user._id)) ||
              s.status === "scheduled"
          );
        }
        setSessions(userSessions);

        const tutorsRes = await axios.get(
          `${backendUrl}/api/auth/users?role=tutor`,
          config
        );
        setTutors(tutorsRes.data.filter((t) => t.profileComplete));
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    };

    fetchData();
  }, [user]);

  const enrollInSession = async (sessionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to enroll!");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.post(
        `${backendUrl}/api/sessions/${sessionId}/enroll`,
        {},
        config
      );

      setSessions((prev) =>
        prev.map((item) => (item._id === sessionId ? res.data : item))
      );
      alert("Successfully enrolled in session 🎉");
    } catch (error) {
      console.error("Error enrolling in session", error);
      alert(
        error.response?.data?.message || "Failed to enroll. Try again later."
      );
    }
  };

  const startLiveSession = async (sessionId) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.patch(
        `${backendUrl}/api/sessions/${sessionId}/start`,
        {},
        config
      );

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
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <BookOpen size={28} color="#1976d2" />
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
            LearningXchange
          </Typography>

          {/* User Info (hidden on very small screens) */}
          <Box sx={{ textAlign: "right", mr: 2, display: { xs: "none", sm: "block" } }}>
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

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={(e, v) => setTabIndex(v)}
        indicatorColor="primary"
        textColor="primary"
        variant={isMobile ? "scrollable" : "fullWidth"}
        scrollButtons="auto"
        sx={{ bgcolor: "white", boxShadow: 1 }}
      >
        <Tab label="Overview" />
        <Tab label="Sessions" />
        {user.role === "learner" && <Tab label="Tutors" />}
      </Tabs>

      <Container sx={{ py: { xs: 2, sm: 4 } }}>
        {/* === OVERVIEW (unchanged from your original) === */}
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
                    <Box sx={{ bgcolor: '#fff9c4', p: 1, mt: 2, borderRadius: 1, display: 'inline-block' }}>
                      <Star size={32} color="#fbc02d" />
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
                    {!user.canCharge && (
                      <Typography variant="caption" color="warning.main">
                        Free until 4+ stars
                      </Typography>
                    )}
                    <Box sx={{ bgcolor: '#e8f5e9', p: 1, mt: 2, borderRadius: 1, display: 'inline-block' }}>
                      <DollarSign size={32} color="#2e7d32" />
                    </Box>
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

        {/* === Sessions Tab === */}
        {tabIndex === 1 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h5" sx={{ mb: { xs: 1, sm: 0 } }}>
                {user.role === "tutor" ? "My Sessions" : "Available Sessions"}
              </Typography>
              {user.role === "tutor" && (
                <Button
                  variant="contained"
                  startIcon={<Plus />}
                  onClick={onSchedule}
                  fullWidth={isMobile}
                >
                  New Session
                </Button>
              )}
            </Box>
            <Grid container spacing={3}>
  {sessions.length > 0 ? (
    sessions.map((s) => (
      <Grid item xs={12} sm={6} md={3} key={s._id}>
        <SessionCard
          session={s}
          userRole={user.role}
          userId={user._id}
          onEnroll={enrollInSession}
          isEnrolled={
            Array.isArray(s.enrolledLearners) &&
            s.enrolledLearners.includes(user._id)
          }
          onStartLive={startLiveSession}
          onJoin={onJoinCall}
          detailed
        />
      </Grid>
    ))
  ) : (
    <Typography
      align="center"
      sx={{ mt: 6, width: "100%" }}
      color="text.secondary"
    >
      No sessions found
    </Typography>
  )}
</Grid>

          </Box>
        )}

        {/* === Tutors Tab === */}
        {tabIndex === 2 && (
          <Box>
            <Typography variant="h5" mb={2}>
              Expert Tutors
            </Typography>
            {tutors.length > 0 ? (
              <Grid container spacing={3}>
                {tutors.map((t) => (
                  <Grid item xs={12} sm={6} md={4} key={t._id}>
                    <TutorCard tutorId={t._id} onSchedule={onSchedule} />
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