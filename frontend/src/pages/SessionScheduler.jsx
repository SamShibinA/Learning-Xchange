import React, { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import axios from 'axios'; // ✅ For backend API calls

const SessionScheduler = ({ user, onBack }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skill, setSkill] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [duration, setDuration] = useState(60);
  const [maxLearners, setMaxLearners] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const session = {
      title,
      description,
      tutorId: user.id,
      tutorName: user.name,
      skill,
      scheduledFor: new Date(scheduledFor),
      duration,
      maxLearners,
      enrolledLearners: [],
      status: 'scheduled',
      price: user.canCharge ? user.hourlyRate || 0 : 0,
      chatMessages: [],
    };

    try {
      // ✅ Send data to backend API
      await axios.post('http://localhost:5000/api/sessions', session);
      onBack(); // Go back after successful save
    } catch (err) {
      console.error(err);
      setError('Failed to schedule the session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date();
  minDate.setHours(minDate.getHours() + 1);
  const minDateString = minDate.toISOString().slice(0, 16);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ borderRadius: 4, p: 4 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Tooltip title="Back">
            <IconButton onClick={onBack} sx={{ mr: 2 }}>
              <ArrowLeft size={20} />
            </IconButton>
          </Tooltip>
          <Box>
            <Typography variant="h5" fontWeight="bold">Schedule New Session</Typography>
            <Typography variant="body2" color="text.secondary">
              Create a learning session for your students
            </Typography>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Session Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Main Skill/Topic</InputLabel>
            <Select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              label="Main Skill/Topic"
            >
              <MenuItem value="">Select a skill...</MenuItem>
              {user.skills?.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {user.skills && user.skills.length === 0 && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Please add skills to your profile first
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                type="datetime-local"
                label="Scheduled Date & Time"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: minDateString }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Duration (minutes)</InputLabel>
                <Select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  label="Duration (minutes)"
                >
                  {[30, 45, 60, 90, 120].map((d) => (
                    <MenuItem key={d} value={d}>{d} minutes</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TextField
            fullWidth
            type="number"
            label="Maximum Learners"
            value={maxLearners}
            onChange={(e) => setMaxLearners(Number(e.target.value))}
            margin="normal"
            inputProps={{ min: 1, max: 50 }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Recommended: 5–15 learners for interactive sessions
          </Typography>

          <Box bgcolor="blue.50" borderRadius={2} p={2} border="1px solid" borderColor="blue.100" mt={3}>
            <Typography variant="subtitle2" color="primary.main" gutterBottom>
              Session Pricing
            </Typography>
            {user.canCharge ? (
              <Typography variant="body2">
                This session will be charged at <strong>${user.hourlyRate}/hour</strong>.
              </Typography>
            ) : (
              <Typography variant="body2">
                This will be a <strong>free session</strong>. Once you earn a 4+ star rating,
                you'll be able to charge ${user.hourlyRate || 25}/hour for future sessions.
              </Typography>
            )}
          </Box>

          <Grid container spacing={2} mt={3}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={onBack}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !skill}
                startIcon={<Plus size={18} />}
              >
                {loading ? 'Scheduling...' : 'Schedule Session'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default SessionScheduler;
