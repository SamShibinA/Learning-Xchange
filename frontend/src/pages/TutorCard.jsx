import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Star } from 'lucide-react';

const TutorCard = ({ tutor, onSchedule }) => {
  const initial = tutor?.name?.[0] || 'T';
  const skills = tutor.skills || [];

  const hasRating = tutor.rating && typeof tutor.rating === 'number' && tutor.rating > 0;
  const totalRatings = tutor.totalRatings || 0;

  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: 1,
        '&:hover': { boxShadow: 4 },
        backgroundColor: 'white',
      }}
    >
      <Box display="flex" gap={2} alignItems="flex-start" mb={2}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
          {initial}
        </Avatar>

        <Box flex={1}>
          <Typography variant="h6" color="text.primary">
            {tutor.name}
          </Typography>

          {hasRating ? (
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <Star size={16} style={{ color: '#facc15' }} fill="#facc15" />
              <Typography variant="body2" fontWeight={500}>
                {Number(tutor.rating).toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({totalRatings} reviews)
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              New tutor
            </Typography>
          )}
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" mb={2}>
        {tutor.bio || 'No bio available.'}
      </Typography>

      <Box mb={2}>
        <Typography variant="subtitle2" color="text.primary" gutterBottom>
          Skills
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {skills.slice(0, 4).map((skill) => (
            <Chip key={skill} label={skill} size="small" color="primary" />
          ))}
          {skills.length > 4 && (
            <Typography variant="caption" color="text.secondary">
              +{skills.length - 4} more
            </Typography>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={2}
      >
        <Typography variant="body2">
          {tutor.canCharge ? (
            <strong>${tutor.hourlyRate}/hr</strong>
          ) : (
            <span style={{ color: '#16a34a', fontWeight: 600 }}>Free sessions</span>
          )}
        </Typography>

        <Button
          variant="contained"
          size="small"
          onClick={() => onSchedule && onSchedule(tutor)}
          sx={{ whiteSpace: 'nowrap' }}
        >
          View Profile
        </Button>
      </Box>
    </Card>
  );
};

export default TutorCard;
