import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Calendar,
  Video,
  Star,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Plus,
  DollarSign,
} from 'lucide-react';
import { getAllSessions, getAllUsers, saveSession } from '../utils/storage';
import SessionCard from './SessionCard';
import TutorCard from './TutorCard';

const Dashboard = ({
  user,
  onJoinCall,
  onSchedule,
  onProfileEdit,
  onLogout,
}) => {
  const [sessions, setSessions] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  useEffect(() => {
    const allSessions = getAllSessions();
    const allUsers = getAllUsers();
    const userSessions =
      user.role === 'tutor'
        ? allSessions.filter((s) => s.tutorId === user.id)
        : allSessions.filter(
            (s) =>
              s.enrolledLearners.includes(user.id) ||
              s.status === 'scheduled'
          );
    setSessions(userSessions);
    setTutors(allUsers.filter((u) => u.role === 'tutor' && u.profileComplete));
  }, [user]);

  const enrollInSession = (sessionId) => {
    const s = sessions.find((s) => s.id === sessionId);
    if (s && !s.enrolledLearners.includes(user.id) && s.enrolledLearners.length < s.maxLearners) {
      const updated = { ...s, enrolledLearners: [...s.enrolledLearners, user.id] };
      saveSession(updated);
      setSessions((ps) => ps.map((item) => (item.id === sessionId ? updated : item)));
    }
  };
  const startLiveSession = (sessionId) => {
    const s = sessions.find((s) => s.id === sessionId);
    if (s) {
      const updated = { ...s, status: 'live', isLive: true };
      saveSession(updated);
      setSessions((ps) => ps.map((item) => (item.id === sessionId ? updated : item)));
      onJoinCall(updated);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <BookOpen size={32} color="#1976d2" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1 }}>
            LearningXchange
          </Typography>
          <Box sx={{ textAlign: 'right', mr: 2 }}>
            <Typography variant="body1">{user.name}</Typography>
            <Typography variant="caption" textTransform="capitalize">{user.role}</Typography>
          </Box>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <IconButton onClick={onLogout}><LogOut /></IconButton>
        </Toolbar>
      </AppBar>

      <Tabs
        value={tabIndex}
        onChange={(e, v) => setTabIndex(v)}
        indicatorColor="primary"
        textColor="primary"
        centered
        sx={{ bgcolor: 'white', boxShadow: 1 }}
      >
        <Tab label="Overview" />
        <Tab label="Sessions" />
        {user.role === 'learner' && <Tab label="Tutors" />}
      </Tabs>

      <Container sx={{ py: 4 }}>
        {tabIndex === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Paper elevation={1} sx={{ p: 3, bgcolor: 'white' }}>
                <Typography variant="subtitle2" color="textSecondary">
                  {user.role === 'tutor' ? 'Total Sessions' : 'Sessions Attended'}
                </Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {user.role === 'tutor' ? sessions.length : user.sessionsAttended || 0}
                </Typography>
                <Box sx={{ bgcolor: '#e3f2fd', p: 1, mt: 2, borderRadius: 1, display: 'inline-block' }}>
                  <BookOpen size={32} color="#1976d2" />
                </Box>
              </Paper>
            </Grid>
            {user.role === 'tutor' && (
              <>
                <Grid item xs={12} md={3}>
                  <Paper elevation={1} sx={{ p: 3, bgcolor: 'white' }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Average Rating
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="h4">{user.rating?.toFixed(1) || '0.0'}</Typography>
                      <Star size={24} color="#fbc02d" style={{ marginLeft: 8 }} />
                    </Box>
                    <Box sx={{ bgcolor: '#fff9c4', p: 1, mt: 2, borderRadius: 1, display: 'inline-block' }}>
                      <Star size={32} color="#fbc02d" />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper elevation={1} sx={{ p: 3, bgcolor: 'white' }}>
                    <Typography variant="subtitle2" color="textSecondary">
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
              <Paper elevation={1} sx={{ p: 3, bgcolor: 'white' }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Live Sessions
                </Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {sessions.filter((s) => s.status === 'live').length}
                </Typography>
                <Box sx={{ bgcolor: '#ffebee', p: 1, mt: 2, borderRadius: 1, display: 'inline-block' }}>
                  <Video size={32} color="#c62828" />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {tabIndex === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5">{user.role === 'tutor' ? 'My Sessions' : 'Available Sessions'}</Typography>
              {user.role === 'tutor' && (
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
                <Typography align="center" sx={{ mt: 6 }} color="textSecondary">
                  No sessions found
                </Typography>
              )}
            </Grid>
          </Box>
        )}

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
              <Typography align="center" sx={{ mt: 6 }} color="textSecondary">
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
