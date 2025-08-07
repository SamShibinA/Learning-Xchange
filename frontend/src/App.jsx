// import React, { useState, useEffect } from 'react';
// import AuthPage from './pages/AuthPage';
// import Dashboard from './pages/Dashboard';
// import ProfileSetup from './pages/ProfileSetup';
// import SessionScheduler from './pages/SessionScheduler';
// import VideoCall from './pages/VideoCall';

// import { getStorageData, setStorageData } from './utils/storage';

// function App() {
//   const [user, setUser] = useState(null);
//   const [view, setView] = useState('auth'); // 'auth' | 'dashboard' | 'profile-setup' | 'video-call' | 'scheduler'
//   const [activeSession, setActiveSession] = useState(null);

//   useEffect(() => {
//     const storedUser = getStorageData('currentUser');
//     if (storedUser) {
//       setUser(storedUser);
//       if (storedUser.role === 'tutor' && !storedUser.profileComplete) {
//         setView('profile-setup');
//       } else {
//         setView('dashboard');
//       }
//     }
//   }, []);

//   const handleLogin = (userData) => {
//     const updatedUser = { ...userData, isLoggedIn: true };
//     setUser(updatedUser);
//     setStorageData('currentUser', updatedUser);
//     setView(
//       updatedUser.role === 'tutor' && !updatedUser.profileComplete
//         ? 'profile-setup'
//         : 'dashboard'
//     );
//   };

//   const handleLogout = () => {
//     if (user) {
//       setStorageData('currentUser', { ...user, isLoggedIn: false });
//       setUser(null);
//       setView('auth');
//     }
//   };

//   const handleProfileComplete = (updatedUser) => {
//     const completedUser = { ...updatedUser, profileComplete: true };
//     setUser(completedUser);
//     setStorageData('currentUser', completedUser);
//     setView('dashboard');
//   };

//   const joinVideoCall = (session) => {
//     setActiveSession(session);
//     setView('video-call');
//   };

//   const leaveVideoCall = () => {
//     setActiveSession(null);
//     setView('dashboard');
//   };

//   const openScheduler = () => setView('scheduler');
//   const goToDashboard = () => setView('dashboard');

//   // Conditional rendering
//   if (view === 'auth') return <AuthPage onLogin={handleLogin} />;

//   if (view === 'profile-setup' && user)
//     return <ProfileSetup user={user} onComplete={handleProfileComplete} onBack={goToDashboard} />;

//   if (view === 'scheduler' && user)
//     return <SessionScheduler user={user} onBack={goToDashboard} />;

//   if (view === 'video-call' && user && activeSession)
//     return <VideoCall session={activeSession} user={user} onLeave={leaveVideoCall} />;

//   if (view === 'dashboard' && user)
//     return (
//       <Dashboard
//         user={user}
//         onJoinCall={joinVideoCall}
//         onSchedule={openScheduler}
//         onProfileEdit={() => setView('profile-setup')}
//         onLogout={handleLogout}
//       />
//     );

//   return <div>Loading...</div>;
// }

// export default App;
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import SessionScheduler from './pages/SessionScheduler';
import VideoCall from './pages/VideoCall';

import { getStorageData, setStorageData } from './utils/storage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getStorageData('currentUser');
    if (storedUser?.isLoggedIn) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (userData) => {
    const updatedUser = { ...userData, isLoggedIn: true };
    setUser(updatedUser);
    setStorageData('currentUser', updatedUser);
  };

  const handleLogout = () => {
    if (user) {
      setStorageData('currentUser', { ...user, isLoggedIn: false });
      setUser(null);
    }
  };

  const handleProfileComplete = (updatedUser) => {
    const completedUser = { ...updatedUser, profileComplete: true };
    setUser(completedUser);
    setStorageData('currentUser', completedUser);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? (user.role === 'tutor' && !user.profileComplete ? '/profile-setup' : '/dashboard') : '/auth'} />} />
        <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard
                user={user}
                onJoinCall={(session) => <Navigate to="/video-call" state={{ session }} />}
                onSchedule={() => <Navigate to="/scheduler" />}
                onProfileEdit={() => <Navigate to="/profile-setup" />}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/profile-setup"
          element={
            user ? (
              <ProfileSetup user={user} onComplete={handleProfileComplete} onBack={() => <Navigate to="/dashboard" />} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/scheduler"
          element={
            user ? (
              <SessionScheduler user={user} onBack={() => <Navigate to="/dashboard" />} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/video-call"
          element={
            user ? (
              <VideoCall user={user} onLeave={() => <Navigate to="/dashboard" />} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
