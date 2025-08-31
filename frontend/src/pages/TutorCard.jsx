import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Card,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { Star, X, Eye } from "lucide-react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const colors = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
];

const getColorForTutor = (tutorId) => {
  if (!tutorId) return "#ccc";
  let hash = 0;
  for (let i = 0; i < tutorId.length; i++) {
    hash = tutorId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const TutorCard = ({ tutorId }) => {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // detect mobile

  useEffect(() => {
    if (!tutorId) return;

    const fetchTutor = async () => {
      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get(`${backendUrl}/api/profile/${tutorId}`, config);
        setTutor(res.data);
      } catch (err) {
        console.error("Error fetching tutor data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [tutorId, token]);

  if (loading) {
    return (
      <Card
        variant="outlined"
        sx={{
          borderRadius: 4,
          width: 290,
          height: 340,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={24} />
      </Card>
    );
  }

  if (!tutor) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          width: 290,
          height: 340,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="body2" color="error">
          Tutor not found.
        </Typography>
      </Card>
    );
  }

  const initial = tutor.name?.[0]?.toUpperCase() || "T";
  const skills = tutor.skills || [];
  const hasRating = tutor.rating && tutor.rating > 0;
  const totalRatings = tutor.totalRatings || 0;
  const avatarColor = getColorForTutor(tutor._id);

  return (
    <>
      {/* Tutor Card */}
      {isMobile ? (
        // Mobile View
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: "transparent",
                backgroundImage: avatarColor,
                width: 40,
                height: 40,
                fontSize: 16,
                color: "white",
              }}
            >
              {initial}
            </Avatar>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "120px",
              }}
            >
              {tutor.name}
            </Typography>
          </Box>
          <IconButton onClick={() => setOpen(true)}>
            <Eye size={20} />
          </IconButton>
        </Card>
      ) : (
        // Desktop View (your current full card)
        <Card
          variant="outlined"
          sx={{
            borderRadius: 4,
            width: 290,
            height: 340,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box p={3} flex={1} display="flex" flexDirection="column" justifyContent="space-between">
            {/* Top Section */}
            <Box>
              <Box display="flex" gap={2} alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: "transparent",
                    backgroundImage: avatarColor,
                    width: 48,
                    height: 48,
                    fontSize: 18,
                    color: "white",
                  }}
                >
                  {initial}
                </Avatar>
                <Box flex={1}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "180px",
                    }}
                  >
                    {tutor.name}
                  </Typography>

                  {hasRating ? (
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <Star size={16} style={{ color: "#facc15" }} fill="#facc15" />
                      <Typography variant="body2" fontWeight={500}>
                        {Number(tutor.rating).toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({totalRatings})
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      New tutor
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Bio with ellipsis */}
              <Typography
                variant="body2"
                color="text.secondary"
                mb={2}
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {tutor.bio || "No bio available."}
              </Typography>

              {/* Skills */}
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {skills.slice(0, 3).map((skill, idx) => (
                  <Chip
                    key={`${skill}-${idx}`}
                    label={skill}
                    size="small"
                    sx={{
                      background: colors[idx % colors.length],
                      color: "white",
                      fontSize: "0.7rem",
                    }}
                  />
                ))}
                {skills.length > 3 && (
                  <Typography variant="caption" color="text.secondary">
                    +{skills.length - 3} more
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Bottom Actions */}
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2" fontWeight={500}>
                {tutor.canCharge ? (
                  <span>${tutor.hourlyRate}/hr</span>
                ) : (
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>Free sessions</span>
                )}
              </Typography>

              <Button
                variant="contained"
                fullWidth
                size="small"
                onClick={() => setOpen(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "0.85rem",
                }}
              >
                View Profile
              </Button>
            </Box>
          </Box>
        </Card>
      )}

      {/* Profile Dialog (common for both views) */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight={600}>
            {tutor.name}
          </Typography>
          <IconButton onClick={() => setOpen(false)} size="small">
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2">{tutor.bio || "No bio available."}</Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {skills.map((skill, idx) => (
                <Chip
                  key={`${skill}-${idx}`}
                  label={skill}
                  size="small"
                  sx={{
                    background: colors[idx % colors.length],
                    color: "white",
                    fontSize: "0.75rem",
                  }}
                />
              ))}
            </Box>
            <Typography variant="body2" fontWeight={500}>
              {tutor.canCharge ? `$${tutor.hourlyRate}/hr` : "Free sessions"}
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TutorCard;


