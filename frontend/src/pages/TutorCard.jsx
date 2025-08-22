// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Avatar,
//   Chip,
//   Button,
//   Card,
//   Divider,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   IconButton,
//   Stack,
// } from "@mui/material";
// import { Star, X } from "lucide-react";
// import axios from "axios";


// const backendUrl=import.meta.env.VITE_BACKEND_URL;


// const colors = [
//   "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//   "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
//   "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
//   "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
//   "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
//   "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
// ];

// const getColorForTutor = (tutorId) => {
//   if (!tutorId) return "#ccc";
//   let hash = 0;
//   for (let i = 0; i < tutorId.length; i++) {
//     hash = tutorId.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   return colors[Math.abs(hash) % colors.length];
// };

// const TutorCard = ({ tutorId }) => {
//   const [tutor, setTutor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [open, setOpen] = useState(false);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!tutorId) return;

//     const fetchTutor = async () => {
//       try {
//         const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
//         const res = await axios.get(`${backendUrl}/api/profile/${tutorId}`, config);
//         setTutor(res.data);
//       } catch (err) {
//         console.error("Error fetching tutor data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTutor();
//   }, [tutorId, token]);

//   if (loading) {
//     return (
//       <Card
//         variant="outlined"
//         sx={{
//           p: { xs: 2, sm: 3 },
//           borderRadius: 4,
//           boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
//           backgroundColor: "#f9f9fb",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: { xs: 120, sm: 160 },
//         }}
//       >
//         <CircularProgress size={24} />
//       </Card>
//     );
//   }

//   if (!tutor) {
//     return (
//       <Card
//         sx={{
//           p: { xs: 2, sm: 3 },
//           borderRadius: 4,
//           boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
//         }}
//       >
//         <Typography variant="body2" color="error">
//           Tutor not found.
//         </Typography>
//       </Card>
//     );
//   }

//   const initial = (tutor.name?.[0]).toUpperCase() || "T";
//   const skills = tutor.skills || [];
//   const hasRating = tutor.rating && tutor.rating > 0;
//   const totalRatings = tutor.totalRatings || 0;
//   const avatarColor = getColorForTutor(tutor._id);

//   return (
//     <>
//       {/* Tutor Card */}
//       <Card
//         variant="outlined"
//         sx={{
//           p: { xs: 2, sm: 3 },
//           borderRadius: 4,
//           boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
//           backgroundColor: "#f9f9fb",
//           transition: "all 0.3s ease",
//           "&:hover": {
//             boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
//             transform: { sm: "translateY(-3px)" },
//           },
//         }}
//       >
//         <Box display="flex" gap={2} alignItems="flex-start" mb={2} flexDirection={{ xs: "column", sm: "row" }}>
//           <Avatar
//             sx={{
//               bgcolor: "transparent",
//               backgroundImage: avatarColor,
//               width: { xs: 48, sm: 52 },
//               height: { xs: 48, sm: 52 },
//               fontSize: { xs: 18, sm: 22 },
//               color: "white",
//             }}
//           >
//             {initial}
//           </Avatar>
//           <Box flex={1}>
//             <Typography variant="h6" fontWeight={700} fontSize={{ xs: "1rem", sm: "1.1rem", md: "1.25rem" }}>
//               {tutor.name}
//             </Typography>
//             {hasRating ? (
//               <Box display="flex" alignItems="center" gap={1} mt={0.5}>
//                 <Star size={16} style={{ color: "#facc15" }} fill="#facc15" />
//                 <Typography variant="body2" fontWeight={500}>
//                   {Number(tutor.rating).toFixed(1)}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   ({totalRatings} reviews)
//                 </Typography>
//               </Box>
//             ) : (
//               <Typography variant="body2" color="text.secondary" mt={0.5}>
//                 New tutor
//               </Typography>
//             )}
//           </Box>
//         </Box>

//         <Typography variant="body2" color="text.secondary" mb={2}>
//           {tutor.bio || "No bio available."}
//         </Typography>

//         {/* Skills */}
//         <Box mb={2}>
//           <Typography variant="subtitle2" color="text.primary" gutterBottom>
//             Skills
//           </Typography>
//           <Box display="flex" flexWrap="wrap" gap={1}>
//             {skills.slice(0, 4).map((skill, idx) => (
//               <Chip
//                 key={`${skill}-${idx}`}
//                 label={skill}
//                 size="small"
//                 sx={{
//                   background: colors[idx % colors.length],
//                   color: "white",
//                   fontWeight: 500,
//                   fontSize: { xs: "0.7rem", sm: "0.8rem" },
//                 }}
//               />
//             ))}
//             {skills.length > 4 && (
//               <Typography variant="caption" color="text.secondary">
//                 +{skills.length - 4} more
//               </Typography>
//             )}
//           </Box>
//         </Box>

//         <Divider sx={{ my: 2 }} />

//         {/* Bottom Row */}
//         <Box
//           display="flex"
//           flexDirection={{ xs: "column", sm: "row" }}
//           justifyContent="space-between"
//           alignItems={{ xs: "flex-start", sm: "center" }}
//           gap={2}
//         >
//           <Typography variant="body2" fontWeight={500}>
//             {tutor.canCharge ? (
//               <span>${tutor.hourlyRate}/hr</span>
//             ) : (
//               <span style={{ color: "#16a34a", fontWeight: 600 }}>Free sessions</span>
//             )}
//           </Typography>

//           <Button
//             variant="contained"
//             size="small"
//             onClick={() => setOpen(true)}
//             sx={{
//               whiteSpace: "nowrap",
//               borderRadius: 3,
//               py: { xs: 1, sm: 1.2 },
//               px: { xs: 2, sm: 2.5 },
//               fontSize: { xs: "0.75rem", sm: "0.85rem" },
//               textTransform: "none",
//               background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
//               "&:hover": { background: "linear-gradient(90deg, #5a67d8 0%, #6b46c1 100%)" },
//             }}
//           >
//             View Profile
//           </Button>
//         </Box>
//       </Card>

//       {/* Responsive Profile Popup */}
//       <Dialog
//         open={open}
//         onClose={() => setOpen(false)}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 3,
//             p: { xs: 2, sm: 3 },
//             backgroundColor: "#f4f5f7",
//             boxShadow: "0 12px 28px rgba(0,0,0,0.16)",
//           },
//         }}
//       >
//         <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: { xs: 1, sm: 2 } }}>
//           <Box display="flex" alignItems="center" gap={2}>
//             <Avatar
//               sx={{
//                 bgcolor: "transparent",
//                 backgroundImage: avatarColor,
//                 width: { xs: 40, sm: 50 },
//                 height: { xs: 40, sm: 50 },
//                 fontSize: { xs: 18, sm: 22 },
//                 color: "white",
//               }}
//             >
//               {initial}
//             </Avatar>
//             <Typography variant="h6" fontWeight={700} fontSize={{ xs: "1rem", sm: "1.25rem" }}>
//               {tutor.name}
//             </Typography>
//           </Box>
//           <IconButton onClick={() => setOpen(false)} size="small">
//             <X size={18} />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
//           <Stack spacing={3}>
//             <Box>
//               <Typography variant="subtitle2" mb={1} fontWeight={600}>
//                 Bio
//               </Typography>
//               <Typography variant="body2" color="#4b5563">
//                 {tutor.bio || "No bio available."}
//               </Typography>
//             </Box>

//             <Box>
//               <Typography variant="subtitle2" mb={1} fontWeight={600}>
//                 Skills
//               </Typography>
//               <Box display="flex" flexWrap="wrap" gap={1}>
//                 {skills.map((skill, idx) => (
//                   <Chip
//                     key={`${skill}-${idx}`}
//                     label={skill}
//                     size="small"
//                     sx={{
//                       background: colors[idx % colors.length],
//                       color: "white",
//                       fontWeight: 600,
//                       fontSize: { xs: "0.7rem", sm: "0.8rem" },
//                     }}
//                   />
//                 ))}
//               </Box>
//             </Box>

//             <Box display="flex" gap={2}>
//               <Typography variant="subtitle2" fontWeight={600}>
//                 Hourly Rate:
//               </Typography>
//               <Typography variant="body2" fontWeight={500}>
//                 {tutor.canCharge ? `$${tutor.hourlyRate}/hr` : "Free"}
//               </Typography>
//             </Box>

//             <Box display="flex" alignItems="center" gap={1}>
//               <Star size={18} style={{ color: "#facc15" }} fill="#facc15" />
//               <Typography variant="body2" fontWeight={500}>
//                 {hasRating ? `${Number(tutor.rating).toFixed(1)} (${totalRatings} reviews)` : "New tutor"}
//               </Typography>
//             </Box>

//             <Button
//               fullWidth
//               variant="contained"
//               sx={{
//                 borderRadius: 3,
//                 py: { xs: 1, sm: 1.3 },
//                 fontSize: { xs: "0.8rem", sm: "0.9rem" },
//                 background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
//                 "&:hover": { background: "linear-gradient(90deg, #5a67d8 0%, #6b46c1 100%)" },
//               }}
//               onClick={() => alert("Booking functionality coming soon!")}
//             >
//               Book Session
//             </Button>
//           </Stack>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default TutorCard;





// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Avatar,
//   Chip,
//   Button,
//   Card,
//   Divider,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   IconButton,
//   Stack,
// } from "@mui/material";
// import { Star, X } from "lucide-react";
// import axios from "axios";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const colors = [
//   "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//   "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
//   "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
//   "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
//   "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
//   "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
// ];

// const getColorForTutor = (tutorId) => {
//   if (!tutorId) return "#ccc";
//   let hash = 0;
//   for (let i = 0; i < tutorId.length; i++) {
//     hash = tutorId.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   return colors[Math.abs(hash) % colors.length];
// };

// const TutorCard = ({ tutorId }) => {
//   const [tutor, setTutor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [open, setOpen] = useState(false);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!tutorId) return;

//     const fetchTutor = async () => {
//       try {
//         const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
//         const res = await axios.get(`${backendUrl}/api/profile/${tutorId}`, config);
//         setTutor(res.data);
//       } catch (err) {
//         console.error("Error fetching tutor data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTutor();
//   }, [tutorId, token]);

//   if (loading) {
//     return (
//       <Card
//         variant="outlined"
//         sx={{
//           borderRadius: 4,
//           width: 290, // fixed width (same as SessionCard)
//           height: 340, // fixed height (same as SessionCard)
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <CircularProgress size={24} />
//       </Card>
//     );
//   }

//   if (!tutor) {
//     return (
//       <Card
//         sx={{
//           borderRadius: 4,
//           width: 290,
//           height: 340,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           p: 2,
//         }}
//       >
//         <Typography variant="body2" color="error">
//           Tutor not found.
//         </Typography>
//       </Card>
//     );
//   }

//   const initial = tutor.name?.[0]?.toUpperCase() || "T";
//   const skills = tutor.skills || [];
//   const hasRating = tutor.rating && tutor.rating > 0;
//   const totalRatings = tutor.totalRatings || 0;
//   const avatarColor = getColorForTutor(tutor._id);

//   return (
//     <>
//       {/* Tutor Card */}
//       <Card
//         variant="outlined"
//         sx={{
//           borderRadius: 4,
//           width: 290, // match SessionCard width
//           height: 340, // match SessionCard height
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between",
//         }}
//       >
//         <Box p={3} flex={1} display="flex" flexDirection="column" justifyContent="space-between">
//           {/* Top Section */}
//           <Box>
//             <Box display="flex" gap={2} alignItems="center" mb={2}>
//               <Avatar
//                 sx={{
//                   bgcolor: "transparent",
//                   backgroundImage: avatarColor,
//                   width: 48,
//                   height: 48,
//                   fontSize: 18,
//                   color: "white",
//                 }}
//               >
//                 {initial}
//               </Avatar>
//               <Box flex={1}>
//                 {/* Name with ellipsis */}
//                 <Typography
//                   variant="h6"
//                   fontWeight={600}
//                   sx={{
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     maxWidth: "180px",
//                   }}
//                 >
//                   {tutor.name}
//                 </Typography>

//                 {hasRating ? (
//                   <Box display="flex" alignItems="center" gap={1} mt={0.5}>
//                     <Star size={16} style={{ color: "#facc15" }} fill="#facc15" />
//                     <Typography variant="body2" fontWeight={500}>
//                       {Number(tutor.rating).toFixed(1)}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       ({totalRatings})
//                     </Typography>
//                   </Box>
//                 ) : (
//                   <Typography variant="body2" color="text.secondary">
//                     New tutor
//                   </Typography>
//                 )}
//               </Box>
//             </Box>

//             {/* Bio with ellipsis */}
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               mb={2}
//               sx={{
//                 display: "-webkit-box",
//                 WebkitLineClamp: 2,
//                 WebkitBoxOrient: "vertical",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//               }}
//             >
//               {tutor.bio || "No bio available."}
//             </Typography>

//             {/* Skills */}
//             <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
//               {skills.slice(0, 3).map((skill, idx) => (
//                 <Chip
//                   key={`${skill}-${idx}`}
//                   label={skill}
//                   size="small"
//                   sx={{
//                     background: colors[idx % colors.length],
//                     color: "white",
//                     fontSize: "0.7rem",
//                   }}
//                 />
//               ))}
//               {skills.length > 3 && (
//                 <Typography variant="caption" color="text.secondary">
//                   +{skills.length - 3} more
//                 </Typography>
//               )}
//             </Box>
//           </Box>

//           <Divider sx={{ my: 1 }} />

//           {/* Bottom Actions */}
//           <Box display="flex" flexDirection="column" gap={1}>
//             <Typography variant="body2" fontWeight={500}>
//               {tutor.canCharge ? (
//                 <span>${tutor.hourlyRate}/hr</span>
//               ) : (
//                 <span style={{ color: "#16a34a", fontWeight: 600 }}>Free sessions</span>
//               )}
//             </Typography>

//             <Button
//               variant="contained"
//               fullWidth
//               size="small"
//               onClick={() => setOpen(true)}
//               sx={{
//                 borderRadius: 2,
//                 textTransform: "none",
//                 fontSize: "0.85rem",
//               }}
//             >
//               View Profile
//             </Button>
//           </Box>
//         </Box>
//       </Card>

//       {/* Profile Dialog */}
//       <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <Typography variant="h6" fontWeight={600}>
//             {tutor.name}
//           </Typography>
//           <IconButton onClick={() => setOpen(false)} size="small">
//             <X size={18} />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>
//           <Stack spacing={2}>
//             <Typography variant="body2">{tutor.bio || "No bio available."}</Typography>
//             <Box display="flex" flexWrap="wrap" gap={1}>
//               {skills.map((skill, idx) => (
//                 <Chip
//                   key={`${skill}-${idx}`}
//                   label={skill}
//                   size="small"
//                   sx={{
//                     background: colors[idx % colors.length],
//                     color: "white",
//                     fontSize: "0.75rem",
//                   }}
//                 />
//               ))}
//             </Box>
//             <Typography variant="body2" fontWeight={500}>
//               {tutor.canCharge ? `$${tutor.hourlyRate}/hr` : "Free sessions"}
//             </Typography>
//           </Stack>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default TutorCard;

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Card,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { Star, X, Eye } from "lucide-react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const colors = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
];

const getColorForTutor = (tutorId) => {
  if (!tutorId) return "#ccc";
  let hash = 0;
  for (let i = 0; i < tutorId.length; i++) {
    hash = tutorId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const TutorCard = ({ tutorId }) => {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // detect mobile

  useEffect(() => {
    if (!tutorId) return;

    const fetchTutor = async () => {
      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get(`${backendUrl}/api/profile/${tutorId}`, config);
        setTutor(res.data);
      } catch (err) {
        console.error("Error fetching tutor data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [tutorId, token]);

  if (loading) {
    return (
      <Card
        variant="outlined"
        sx={{
          borderRadius: 4,
          width: 290,
          height: 340,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={24} />
      </Card>
    );
  }

  if (!tutor) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          width: 290,
          height: 340,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="body2" color="error">
          Tutor not found.
        </Typography>
      </Card>
    );
  }

  const initial = tutor.name?.[0]?.toUpperCase() || "T";
  const skills = tutor.skills || [];
  const hasRating = tutor.rating && tutor.rating > 0;
  const totalRatings = tutor.totalRatings || 0;
  const avatarColor = getColorForTutor(tutor._id);

  return (
    <>
      {/* Tutor Card */}
      {isMobile ? (
        // Mobile View
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: "transparent",
                backgroundImage: avatarColor,
                width: 40,
                height: 40,
                fontSize: 16,
                color: "white",
              }}
            >
              {initial}
            </Avatar>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "120px",
              }}
            >
              {tutor.name}
            </Typography>
          </Box>
          <IconButton onClick={() => setOpen(true)}>
            <Eye size={20} />
          </IconButton>
        </Card>
      ) : (
        // Desktop View (your current full card)
        <Card
          variant="outlined"
          sx={{
            borderRadius: 4,
            width: 290,
            height: 340,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box p={3} flex={1} display="flex" flexDirection="column" justifyContent="space-between">
            {/* Top Section */}
            <Box>
              <Box display="flex" gap={2} alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: "transparent",
                    backgroundImage: avatarColor,
                    width: 48,
                    height: 48,
                    fontSize: 18,
                    color: "white",
                  }}
                >
                  {initial}
                </Avatar>
                <Box flex={1}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "180px",
                    }}
                  >
                    {tutor.name}
                  </Typography>

                  {hasRating ? (
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <Star size={16} style={{ color: "#facc15" }} fill="#facc15" />
                      <Typography variant="body2" fontWeight={500}>
                        {Number(tutor.rating).toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({totalRatings})
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      New tutor
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Bio with ellipsis */}
              <Typography
                variant="body2"
                color="text.secondary"
                mb={2}
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {tutor.bio || "No bio available."}
              </Typography>

              {/* Skills */}
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {skills.slice(0, 3).map((skill, idx) => (
                  <Chip
                    key={`${skill}-${idx}`}
                    label={skill}
                    size="small"
                    sx={{
                      background: colors[idx % colors.length],
                      color: "white",
                      fontSize: "0.7rem",
                    }}
                  />
                ))}
                {skills.length > 3 && (
                  <Typography variant="caption" color="text.secondary">
                    +{skills.length - 3} more
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Bottom Actions */}
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2" fontWeight={500}>
                {tutor.canCharge ? (
                  <span>${tutor.hourlyRate}/hr</span>
                ) : (
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>Free sessions</span>
                )}
              </Typography>

              <Button
                variant="contained"
                fullWidth
                size="small"
                onClick={() => setOpen(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "0.85rem",
                }}
              >
                View Profile
              </Button>
            </Box>
          </Box>
        </Card>
      )}

      {/* Profile Dialog (common for both views) */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight={600}>
            {tutor.name}
          </Typography>
          <IconButton onClick={() => setOpen(false)} size="small">
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2">{tutor.bio || "No bio available."}</Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {skills.map((skill, idx) => (
                <Chip
                  key={`${skill}-${idx}`}
                  label={skill}
                  size="small"
                  sx={{
                    background: colors[idx % colors.length],
                    color: "white",
                    fontSize: "0.75rem",
                  }}
                />
              ))}
            </Box>
            <Typography variant="body2" fontWeight={500}>
              {tutor.canCharge ? `$${tutor.hourlyRate}/hr` : "Free sessions"}
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TutorCard;
