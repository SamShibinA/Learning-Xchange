import React from 'react';
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

const statusColors = {
  live: { color: 'error', label: 'LIVE' },
  scheduled: { color: 'primary', label: 'SCHEDULED' },
  completed: { color: 'default', label: 'COMPLETED' }
};

const SessionCard = ({
  session,
  userRole,
  userId,
  onEnroll,
  onJoin,
  onStartLive,
  detailed = false
}) => {
  const isEnrolled = session.enrolledLearners.includes(userId);
  const isOwner = userRole === 'tutor' && session.tutorId === userId;
  const canEnroll = !isEnrolled && session.enrolledLearners.length < session.maxLearners;

  const sessionDate = new Date(session.scheduledFor);
  const now = new Date();

  const minutesUntilStart = (sessionDate - now) / 1000 / 60;
  const minutesSinceStart = (now - sessionDate) / 1000 / 60;

  // Allow tutor to start session 10 minutes before or 15 minutes after start
  const canStart =
    isOwner &&
    session.status === 'scheduled' &&
    ((minutesUntilStart <= 10 && minutesUntilStart >= 0) || (minutesSinceStart >= 0 && minutesSinceStart <= 15));

  const status = session.status;
  const statusStyle = statusColors[status] || statusColors.completed;

  return (
    <Card sx={{ mb: 3, p: 2 }}>
      <CardContent>
        <Stack spacing={2}>
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
                {session.isLive && (
                  <Box display="flex" alignItems="center" gap={1} color="error.main">
                    <Box width={8} height={8} borderRadius="50%" bgcolor="error.main" sx={{ animation: 'pulse 1s infinite' }} />
                    <Typography variant="caption">LIVE</Typography>
                  </Box>
                )}
              </Stack>
              <Typography variant="h6">{session.title}</Typography>
              {detailed && (
                <Typography variant="body2" color="text.secondary">
                  {session.description}
                </Typography>
              )}
            </Box>

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
                onClick={() => onJoin?.(session)}
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
                    onClick={() => onStartLive?.(session._id)}
                  >
                    Start Session
                  </Button>
                )}

                {userRole === 'learner' && !isEnrolled && canEnroll && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => onEnroll?.(session._id)}
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
