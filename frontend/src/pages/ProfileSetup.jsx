import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
  Chip,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { User, DollarSign, ArrowLeft, Plus, X } from 'lucide-react';
import { saveUser } from '../utils/storage';

const ProfileSetup = ({ user, onComplete, onBack }) => {
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [skills, setSkills] = useState(user.skills || []);
  const [interests, setInterests] = useState(user.interests || []);
  const [hourlyRate, setHourlyRate] = useState(user.hourlyRate || 0);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const suggestedSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Data Science',
    'Machine Learning', 'UI/UX Design', 'Digital Marketing',
    'Mathematics', 'Physics', 'English', 'Spanish', 'French'
  ];

  const suggestedInterests = [
    'Web Development', 'Mobile Development', 'Data Science',
    'AI & Machine Learning', 'Design', 'Marketing',
    'Languages', 'Mathematics', 'Science', 'Business'
  ];

  const addItem = (item, setItemList, itemList, setInput) => {
    const trimmed = item.trim();
    if (trimmed && !itemList.includes(trimmed)) {
      setItemList([...itemList, trimmed]);
      setInput('');
    }
  };

  const removeItem = (item, setItemList) => {
    setItemList((prev) => prev.filter((i) => i !== item));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name,
      bio: user.role === 'tutor' ? bio : user.bio,
      skills: user.role === 'tutor' ? skills : user.skills,
      interests: user.role === 'learner' ? interests : user.interests,
      hourlyRate: user.role === 'tutor' ? hourlyRate : user.hourlyRate,
      profileComplete: true,
    };

    saveUser(updatedUser);
    onComplete(updatedUser);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', py: 6 }}>
      <Box maxWidth="md" mx="auto" px={2}>
        <Paper elevation={3} sx={{ borderRadius: 4, p: 4 }}>
          <Box display="flex" alignItems="center" mb={4}>
            <Tooltip title="Back">
              <IconButton onClick={onBack}>
                <ArrowLeft size={20} />
              </IconButton>
            </Tooltip>
            <Box ml={2}>
              <Typography variant="h5" fontWeight="bold">
                Complete Your Profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.role === 'tutor'
                  ? 'Set up your teaching profile to start hosting sessions'
                  : 'Tell us about your learning interests'}
              </Typography>
            </Box>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Display Name"
              placeholder="How should others address you?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={16} />
                  </InputAdornment>
                ),
              }}
            />

            {user.role === 'tutor' && (
              <>
                <TextField
                  label="Bio"
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Tell learners about your experience, teaching style, and passions..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  margin="normal"
                  required
                />
                <Typography variant="caption" color="text.secondary">
                  {bio.length}/500 characters
                </Typography>

                {/* Skills Input */}
                <Box mt={3}>
                  <Typography variant="subtitle1">Skills & Expertise</Typography>
                  <Box display="flex" gap={1} mt={1}>
                    <TextField
                      fullWidth
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && (e.preventDefault(), addItem(newSkill, setSkills, skills, setNewSkill))
                      }
                    />
                    <IconButton
                      color="primary"
                      onClick={() => addItem(newSkill, setSkills, skills, setNewSkill)}
                    >
                      <Plus size={18} />
                    </IconButton>
                  </Box>
                  <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                    {skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        onDelete={() => removeItem(skill, setSkills)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  <Typography variant="body2" mt={2}>
                    Suggested Skills:
                  </Typography>
                  <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                    {suggestedSkills
                      .filter((s) => !skills.includes(s))
                      .slice(0, 8)
                      .map((skill) => (
                        <Chip
                          key={skill}
                          label={`+ ${skill}`}
                          onClick={() => setSkills([...skills, skill])}
                          variant="outlined"
                        />
                      ))}
                  </Box>
                </Box>

                {/* Hourly Rate */}
                <Box mt={4}>
                  <TextField
                    label="Hourly Rate (USD)"
                    type="number"
                    fullWidth
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DollarSign size={16} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Typography variant="caption" color="warning.main" mt={1} display="block">
                    <strong>Note:</strong> You’ll need a 4+ star rating before charging for sessions.
                  </Typography>
                </Box>
              </>
            )}

            {user.role === 'learner' && (
              <Box mt={3}>
                <Typography variant="subtitle1">Learning Interests</Typography>
                <Box display="flex" gap={1} mt={1}>
                  <TextField
                    fullWidth
                    placeholder="What would you like to learn?"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' &&
                      (e.preventDefault(), addItem(newInterest, setInterests, interests, setNewInterest))
                    }
                  />
                  <IconButton
                    color="primary"
                    onClick={() => addItem(newInterest, setInterests, interests, setNewInterest)}
                  >
                    <Plus size={18} />
                  </IconButton>
                </Box>
                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  {interests.map((interest) => (
                    <Chip
                      key={interest}
                      label={interest}
                      onDelete={() => removeItem(interest, setInterests)}
                      color="success"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Typography variant="body2" mt={2}>
                  Popular Topics:
                </Typography>
                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  {suggestedInterests
                    .filter((i) => !interests.includes(i))
                    .slice(0, 8)
                    .map((interest) => (
                      <Chip
                        key={interest}
                        label={`+ ${interest}`}
                        onClick={() => setInterests([...interests, interest])}
                        variant="outlined"
                      />
                    ))}
                </Box>
              </Box>
            )}

            <Box display="flex" gap={2} mt={5}>
              <Button variant="outlined" fullWidth onClick={onBack}>
                Back
              </Button>
              <Button type="submit" variant="contained" fullWidth>
                Complete Profile
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProfileSetup;
