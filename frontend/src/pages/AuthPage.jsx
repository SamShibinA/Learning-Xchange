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
import { getAllUsers, saveUser, generateId } from '../utils/storage';

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('learner');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const users = getAllUsers();

      if (isLogin) {
        const user = users.find((u) => u.email === email && u.password === password);
        if (!user) {
          setError('Invalid email or password');
          return;
        }
        onLogin(user);
      } else {
        const existingUser = users.find((u) => u.email === email);
        if (existingUser) {
          setError('Email already registered');
          return;
        }

        const newUser = {
          id: generateId(),
          email,
          password,
          name,
          role,
          profileComplete: role === 'learner',
          sessionsAttended: role === 'learner' ? 0 : undefined,
          skills: role === 'tutor' ? [] : undefined,
          bio: role === 'tutor' ? '' : undefined,
          hourlyRate: role === 'tutor' ? 0 : undefined,
          rating: role === 'tutor' ? 0 : undefined,
          totalRatings: role === 'tutor' ? 0 : undefined,
          canCharge: false,
          interests: role === 'learner' ? [] : undefined,
        };

        saveUser(newUser);
        onLogin(newUser);
      }
    } catch {
      setError('An error occurred. Please try again.');
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
        bgcolor: '#ffffff', // White background on full screen
        px: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
        }}
      >
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
                  sx={{ input: { backgroundColor: '#fff !important' } }}
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
                    <ToggleButton
                      value="learner"
                      sx={{
                        flex: 1,
                        '&:hover': {
                          backgroundColor: '#cce0ff', // light blue (like text selection)
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#cce0ff', // selected state
                          color: '#000',
                          '&:hover': {
                            backgroundColor: '#b3d4ff', // slightly darker blue on hover while selected
                          },
                        },
                      }}
                    >
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <BookOpen size={20} />
                        Learner
                      </Box>
                    </ToggleButton>

                    <ToggleButton
                      value="tutor"
                      sx={{
                        flex: 1,
                        '&:hover': {
                          backgroundColor: '#cce0ff',
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#cce0ff',
                          color: '#000',
                          '&:hover': {
                            backgroundColor: '#b3d4ff',
                          },
                        },
                      }}
                    >
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
              sx={{ input: { backgroundColor: '#fff !important' } }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              sx={{ input: { backgroundColor: '#fff !important' } }}
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
              <Button size="small" onClick={() => setIsLogin(!isLogin)}>
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
