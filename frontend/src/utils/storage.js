export const getStorageData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
};

export const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to storage:', error);
  }
};

export const getAllUsers = () => {
  return getStorageData('users') || [];
};

export const saveUser = (user) => {
  const users = getAllUsers();
  const existingIndex = users.findIndex((u) => u.id === user.id);

  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }

  setStorageData('users', users);
};

export const getAllSessions = () => {
  return getStorageData('sessions') || [];
};

export const saveSession = (session) => {
  const sessions = getAllSessions();
  const existingIndex = sessions.findIndex((s) => s.id === session.id);

  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }

  setStorageData('sessions', sessions);
};

export const getAllRatings = () => {
  return getStorageData('ratings') || [];
};

export const saveRating = (rating) => {
  const ratings = getAllRatings();
  ratings.push(rating);
  setStorageData('ratings', ratings);

  const users = getAllUsers();
  const tutorIndex = users.findIndex((u) => u.id === rating.tutorId);

  if (tutorIndex >= 0) {
    const tutorRatings = ratings.filter((r) => r.tutorId === rating.tutorId);
    const avgRating =
      tutorRatings.reduce((sum, r) => sum + r.rating, 0) / tutorRatings.length;

    users[tutorIndex].rating = avgRating;
    users[tutorIndex].totalRatings = tutorRatings.length;
    users[tutorIndex].canCharge = avgRating >= 4.0;

    setStorageData('users', users);
  }
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
