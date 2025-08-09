import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  Stack
} from '@mui/material';
import {
  Calendar,
  Clock,
  Users,
  Video,
  Star,
  DollarSign,
  Play
} from 'lucide-react';
import axios from 'axios';

// Session status style mapping
const statusColors = {
  live: { color: 'error', label: 'LIVE' },
  scheduled: { color: 'primary', label: 'SCHEDULED' },
  completed: { color: 'default', label: 'COMPLETED' }
};

const SessionCard = ({
  sessionId,
  userRole, // "tutor" or "learner"
  onSessionUpdated, // callback to refresh parent component after enroll/start
  detailed = false
}) => {
  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState(null); // will get from backend

  // Fetch session + user data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get current logged-in user from backend
        const userRes = await axios.get('/api/auth/me'); // requires backend auth route
        setUserId(userRes.data.id);

        // 2. Get session details from backend
        const sessionRes = await axios.get(`/api/sessions/${sessionId}`);
        setSession(sessionRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [sessionId]);

  if (!session) return null; // still loading

  const isEnrolled = Array.isArray(session.enrolledLearners) && session.enrolledLearners.includes(userId);
  const isOwner = userRole === 'tutor' && session.tutorId === userId;
  const canEnroll = !isEnrolled && session.enrolledLearners.length < session.maxLearners;

  const sessionDate = new Date(session.scheduledFor);
  const now = new Date();

  const minutesUntilStart = (sessionDate - now) / 1000 / 60;
  const minutesSinceStart = (now - sessionDate) / 1000 / 60;

  // Allow tutor to start session 10 min before or 15 min after start
  const canStart =
    isOwner &&
    session.status === 'scheduled' &&
    ((minutesUntilStart <= 10 && minutesUntilStart >= 0) ||
      (minutesSinceStart >= 0 && minutesSinceStart <= 15));

  const status = session.status;
  const statusStyle = statusColors[status] || statusColors.completed;

  // Backend actions
  const handleEnroll = async () => {
    try {
      await axios.post(`/api/sessions/${sessionId}/enroll`);
      onSessionUpdated?.();
    } catch (err) {
      console.error('Error enrolling:', err);
    }
  };

  const handleJoin = () => {
    window.open(session.meetingLink, '_blank'); // meeting link from backend
  };

  const handleStartLive = async () => {
    try {
      await axios.post(`/api/sessions/${sessionId}/start`);
      onSessionUpdated?.();
    } catch (err) {
      console.error('Error starting live session:', err);
    }
  };

  return (
    <Card sx={{ mb: 3, p: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          {/* Status + Title */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Chip
                  size="small"
                  label={
                    <>
                      {status === 'live' && <Video size={14} style={{ marginRight: 4 }} />}
                      {statusStyle.label}
                    </>
                  }
                  color={statusStyle.color}
                  variant="outlined"
                />
              </Stack>
              <Typography variant="h6">{session.title}</Typography>
              {detailed && (
                <Typography variant="body2" color="text.secondary">
                  {session.description}
                </Typography>
              )}
            </Box>

            {/* Price */}
            <Box textAlign="right">
              {session.price > 0 ? (
                <>
                  <Box display="flex" justifyContent="flex-end" alignItems="center" color="success.main" fontWeight="bold">
                    <DollarSign size={18} style={{ marginRight: 4 }} />
                    {session.price}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    per hour
                  </Typography>
                </>
              ) : (
                <Chip label="FREE" size="small" color="success" variant="outlined" />
              )}
            </Box>
          </Box>

          {/* Details */}
          <Stack spacing={1}>
            <Box display="flex" alignItems="center" color="text.secondary">
              <Calendar size={16} style={{ marginRight: 8 }} />
              {sessionDate.toLocaleDateString()} at {sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Box>
            <Box display="flex" alignItems="center" color="text.secondary">
              <Clock size={16} style={{ marginRight: 8 }} />
              {session.duration} minutes
            </Box>
            <Box display="flex" alignItems="center" color="text.secondary">
              <Users size={16} style={{ marginRight: 8 }} />
              {session.enrolledLearners.length} / {session.maxLearners} enrolled
            </Box>
            <Box display="flex" alignItems="center" color="text.secondary">
              <Star size={16} style={{ marginRight: 8 }} />
              {session.skill}
            </Box>
          </Stack>

          {/* Tutor info */}
          {!isOwner && (
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                {session.tutorName?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" fontWeight={500}>
                {session.tutorName}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
            {status === 'live' && (isEnrolled || isOwner) && (
              <Button
                fullWidth
                variant="contained"
                color="error"
                startIcon={<Video size={18} />}
                onClick={handleJoin}
              >
                Join Live Session
              </Button>
            )}

            {status === 'scheduled' && (
              <>
                {canStart && isOwner && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<Play size={18} />}
                    onClick={handleStartLive}
                  >
                    Start Session
                  </Button>
                )}

                {userRole === 'learner' && !isEnrolled && canEnroll && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleEnroll}
                  >
                    Enroll Now
                  </Button>
                )}

                {userRole === 'learner' && isEnrolled && (
                  <Chip label="✓ Enrolled" color="success" variant="outlined" />
                )}

                {!canEnroll && !isEnrolled && userRole === 'learner' && (
                  <Chip label="Session Full" color="default" variant="outlined" />
                )}
              </>
            )}

            {status === 'completed' && (
              <Chip label="Completed" color="default" variant="outlined" />
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
