import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import {
  Video,
  Star,
  DollarSign,
  BookOpen,
  Play,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function SessionCard({
  session,
  userId,
  userRole,
  isEnrolled,
  onEnroll,
  onStartLive,
}) {
  const navigate = useNavigate();

  const {
    _id,
    title,
    skill,
    scheduledFor,
    duration,
    maxLearners,
    enrolledLearners = [],
    tutorId,
    tutorName,
    price,
    status,
  } = session;

  const isOwner = userId === tutorId;
  const enrolledCount = enrolledLearners.length;
  const canEnroll = enrolledCount < maxLearners;
  const canStart = status === "scheduled" && enrolledCount > 0;

  return (
    <Card variant="outlined" sx={{ borderRadius: 4, mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          {title}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Star size={18} color="#f5b400" />
          <Typography variant="body2">{tutorName || "Unknown Tutor"}</Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <BookOpen size={18} color="#4f46e5" />
          <Typography variant="body2">{skill}</Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Video size={18} color="#0284c7" />
          <Typography variant="body2">
            {new Date(scheduledFor).toLocaleString()}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          ⏱ {duration} mins
        </Typography>

        {price && (
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <DollarSign size={18} color="#16a34a" />
            <Typography variant="body2" fontWeight="500">
              ₹{price}
            </Typography>
          </Box>
        )}

        <Box display="flex" gap={1} mb={2}>
          <Chip
            label={`${enrolledCount}/${maxLearners} learners`}
            size="small"
          />
          <Chip label={status.toUpperCase()} size="small" />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mt={1} display="flex" flexDirection="column" gap={1}>
          {status === "scheduled" && (
            <>
              {canStart && isOwner && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => onStartLive?.(_id)}
                >
                  Start Session
                </Button>
              )}

              {userRole === "learner" && isEnrolled && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Video size={18} />}
                    onClick={() =>
                      navigate(`/session/${_id}`, { state: { session } })
                    }
                  >
                    Join Session
                  </Button>
                  <Button variant="outlined" disabled>
                    <CheckCircle size={18} /> Enrolled
                  </Button>
                </>
              )}

              {userRole === "learner" && !isEnrolled && canEnroll && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onEnroll?.(_id)}
                >
                  Enroll Now
                </Button>
              )}
            </>
          )}

          {status === "live" && (
            <Button
              variant="contained"
              color="success"
              startIcon={<Video size={18} />}
              onClick={() =>
                navigate(`/session/${_id}`, { state: { session } })
              }
            >
              Join Live
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default SessionCard;
