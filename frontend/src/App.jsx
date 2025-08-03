import React, { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import SessionScheduler from './pages/SessionScheduler';
import VideoCall from './pages/VideoCall';

import { getStorageData, setStorageData } from './utils/storage';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('auth'); // 'auth' | 'dashboard' | 'profile-setup' | 'video-call' | 'scheduler'
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    const storedUser = getStorageData('currentUser');
    if (storedUser) {
      setUser(storedUser);
      if (storedUser.role === 'tutor' && !storedUser.profileComplete) {
        setView('profile-setup');
      } else {
        setView('dashboard');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    const updatedUser = { ...userData, isLoggedIn: true };
    setUser(updatedUser);
    setStorageData('currentUser', updatedUser);
    setView(
      updatedUser.role === 'tutor' && !updatedUser.profileComplete
        ? 'profile-setup'
        : 'dashboard'
    );
  };

  const handleLogout = () => {
    if (user) {
      setStorageData('currentUser', { ...user, isLoggedIn: false });
      setUser(null);
      setView('auth');
    }
  };

  const handleProfileComplete = (updatedUser) => {
    const completedUser = { ...updatedUser, profileComplete: true };
    setUser(completedUser);
    setStorageData('currentUser', completedUser);
    setView('dashboard');
  };

  const joinVideoCall = (session) => {
    setActiveSession(session);
    setView('video-call');
  };

  const leaveVideoCall = () => {
    setActiveSession(null);
    setView('dashboard');
  };

  const openScheduler = () => setView('scheduler');
  const goToDashboard = () => setView('dashboard');

  // Conditional rendering
  if (view === 'auth') return <AuthPage onLogin={handleLogin} />;

  if (view === 'profile-setup' && user)
    return <ProfileSetup user={user} onComplete={handleProfileComplete} onBack={goToDashboard} />;

  if (view === 'scheduler' && user)
    return <SessionScheduler user={user} onBack={goToDashboard} />;

  if (view === 'video-call' && user && activeSession)
    return <VideoCall session={activeSession} user={user} onLeave={leaveVideoCall} />;

  if (view === 'dashboard' && user)
    return (
      <Dashboard
        user={user}
        onJoinCall={joinVideoCall}
        onSchedule={openScheduler}
        onProfileEdit={() => setView('profile-setup')}
        onLogout={handleLogout}
      />
    );

  return <div>Loading...</div>;
}

export default App;
