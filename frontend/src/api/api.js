const API_BASE = 'http://localhost:5000/api/auth';

const postRequest = async (endpoint, formData) => {
  try {
    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || `${endpoint} failed`);

    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const registerUser = (formData) => postRequest('register', formData);
export const loginUser = (formData) => postRequest('login', formData);
