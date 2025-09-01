// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// const ProfileEdit = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [profile, setProfile] = useState({
//     name: "",
//     bio: "",
//     skills: [],
//     hourlyRate: "",
//   });
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   // ✅ Fetch user profile
//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     axios
//       .get(`${backendUrl}/api/profile/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         setProfile({
//           name: res.data.name || "",
//           bio: res.data.bio || "",
//           skills: res.data.skills || [],
//           hourlyRate: res.data.hourlyRate || "",
//         });
//       })
//       .catch((err) => {
//         console.error(err);
//         setSnackbar({
//           open: true,
//           message: "Failed to load profile",
//           severity: "error",
//         });
//       });
//   }, [token, navigate]);

//   // ✅ Handle input change
//   const handleChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   // ✅ Save updated profile
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     axios
//       .put(
//         `${backendUrl}/api/profile`,
//         {
//           ...profile,
//           skills: profile.skills
//             .toString()
//             .split(",")
//             .map((s) => s.trim()), // ensure skills array
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )
//       .then(() => {
//         setSnackbar({
//           open: true,
//           message: "Profile updated successfully!",
//           severity: "success",
//         });
//         setTimeout(() => navigate("/dashboard"), 1500);
//       })
//       .catch((err) => {
//         console.error(err);
//         setSnackbar({
//           open: true,
//           message: "Failed to update profile",
//           severity: "error",
//         });
//       });
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box sx={{ mt: 5 }}>
//         <Typography variant="h4" gutterBottom>
//           Edit Profile
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             label="Name"
//             name="name"
//             value={profile.name}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Bio"
//             name="bio"
//             multiline
//             rows={3}
//             value={profile.bio}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Skills (comma separated)"
//             name="skills"
//             value={profile.skills.join(", ")}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Hourly Rate ($)"
//             name="hourlyRate"
//             type="number"
//             value={profile.hourlyRate}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             type="submit"
//             fullWidth
//             sx={{ mt: 2 }}
//           >
//             Save Changes
//           </Button>
//         </form>
//       </Box>

//       {/* ✅ Snackbar for feedback */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default ProfileEdit;
