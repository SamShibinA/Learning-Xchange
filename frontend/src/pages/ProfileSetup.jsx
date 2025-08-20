import React, { useState, useEffect, use } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { User, DollarSign, ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileSetup = ({ user, onComplete, onBack }) => {
  const navigate = useNavigate();

  // Redirect if profile is already complete
  useEffect(() => {
    if (user.profileComplete) {
      navigate('/dashboard', { replace: true });
    }
  }, [user.profileComplete, navigate]);

  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [skills, setSkills] = useState(user.skills || []);
  const [interests, setInterests] = useState(user.interests || []);
  const [hourlyRate, setHourlyRate] = useState(user.hourlyRate || 0);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // useEffect(()=>{
  //   if(error){
  //     const timer=setTimeout(()=>{
  //       setError(' ');
  //     },3000);
  //     return ()=>clearTimeout(timer);
  //   }
  // },[error]);

  // useEffect(()=>{
  //   const timer=setTimeout(()=>{
  //      setSuccess(' ');
  //   },2000)
  //   return ()=>clearTimeout(timer);
  // },[success])
  const suggestedSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Data Science',
    'Machine Learning', 'UI/UX Design', 'Digital Marketing',
    'Mathematics', 'Physics', 'English', 'Spanish', 'French',
  ];

  const suggestedInterests = [
    'Web Development', 'Mobile Development', 'Data Science',
    'AI & Machine Learning', 'Design', 'Marketing',
    'Languages', 'Mathematics', 'Science', 'Business',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Construct updated user profile data
    const updatedUser = {
      ...user,
      name,
      bio: user.role === 'tutor' ? bio : user.bio,
      skills: user.role === 'tutor' ? skills : user.skills,
      interests: user.role === 'learner' ? interests : user.interests,
      hourlyRate: user.role === 'tutor' ? hourlyRate : user.hourlyRate,
      profileComplete: true,
    };

    try {
      // Get token from user object or localStorage fallback
      const token = user.token || localStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing. Please login again.');

      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(result.message || 'Profile updated successfully.');
        onComplete(result.data); // send updated user data back to parent
      } else {
        throw new Error(result.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', py: 6 }}>
      <Box maxWidth="md" mx="auto" px={2}>
        <Paper elevation={3} sx={{ borderRadius: 4, p: 4 }}>
          <Box display="flex" alignItems="center" mb={4}>
            <Tooltip title="Back">
              <IconButton onClick={onBack} disabled={loading}>
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

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

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
              disabled={loading}
            />

            {user.role === 'tutor' && (
              <>
                <TextField
                  label="Bio"
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Tell learners about your experience..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  margin="normal"
                  required
                  inputProps={{ maxLength: 500 }}
                  disabled={loading}
                />
                <Typography variant="caption" color="text.secondary">
                  {bio.length}/500 characters
                </Typography>

                {/* Skills */}
                <Box mt={3}>
                  <Typography variant="subtitle1">Skills & Expertise</Typography>
                  <Box display="flex" gap={1} mt={1}>
                    <TextField
                      fullWidth
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' &&
                        (e.preventDefault(),
                        addItem(newSkill, setSkills, skills, setNewSkill))
                      }
                      disabled={loading}
                    />
                    <IconButton
                      color="primary"
                      onClick={() => addItem(newSkill, setSkills, skills, setNewSkill)}
                      disabled={loading}
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
                        disabled={loading}
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
                          disabled={loading}
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
                    disabled={loading}
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
                      (e.preventDefault(),
                      addItem(newInterest, setInterests, interests, setNewInterest))
                    }
                    disabled={loading}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => addItem(newInterest, setInterests, interests, setNewInterest)}
                    disabled={loading}
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
                      disabled={loading}
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
                        disabled={loading}
                      />
                    ))}
                </Box>
              </Box>
            )}

            <Box display="flex" gap={2} mt={5}>
              <Button variant="outlined" fullWidth onClick={onBack} disabled={loading}>
                Back
              </Button>
              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={20} /> : 'Complete Profile'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProfileSetup;
