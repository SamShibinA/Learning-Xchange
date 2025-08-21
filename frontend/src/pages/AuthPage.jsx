import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { BookOpen, GraduationCap } from 'lucide-react';
import axios from 'axios';

const backendUrl=import.meta.env.VITE_BACKEND_URL;
const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('learner');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');

  try {
    let res;
    if (isLogin) {
      res = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
    } else {
      res = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password, role });
    }

    // Show success message
    setSuccess(res.data.message || 'Success');

    // Hide after 1.5s
    setTimeout(() => {
      setSuccess('');
      onLogin(res.data.user); // Pass user to parent AFTER success message
    }, 500);

    // Save token
    localStorage.setItem('token', res.data.token);

    // Clear inputs
    setEmail('');
    setPassword('');
    setName('');
    setRole('learner');
  } catch (err) {
    const message = err.response?.data?.message || 'An error occurred. Please try again.';
    setError(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#fff',
        px: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Box textAlign="center" mb={4}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
            <BookOpen size={32} color="#fff" />
          </Avatar>
          <Typography variant="h4" fontWeight="bold">
            LearningXchange
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connect, Learn, and Grow Together
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ borderRadius: 4, p: 4 }}>
          <Box display="flex" gap={1} mb={3}>
            <Button variant={isLogin ? 'contained' : 'text'} onClick={() => setIsLogin(true)} fullWidth>
              Sign In
            </Button>
            <Button variant={!isLogin ? 'contained' : 'text'} onClick={() => setIsLogin(false)} fullWidth>
              Sign Up
            </Button>
          </Box>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <TextField
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <Box mb={2}>
                  <Typography variant="subtitle2" mb={1}>
                    I want to join as a
                  </Typography>
                  <ToggleButtonGroup
                    value={role}
                    exclusive
                    onChange={(e, newRole) => newRole && setRole(newRole)}
                    fullWidth
                  >
                    <ToggleButton value="learner" sx={{ flex: 1 }}>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <BookOpen size={20} />
                        Learner
                      </Box>
                    </ToggleButton>
                    <ToggleButton value="tutor" sx={{ flex: 1 }}>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <GraduationCap size={20} />
                        Tutor
                      </Box>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </>
            )}
            
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {success}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <Box mt={3} textAlign="center">
            <Typography variant="body2">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <Button
                size="small"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AuthPage;
