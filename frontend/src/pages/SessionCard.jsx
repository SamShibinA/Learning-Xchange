// import React from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Chip,
//   Button,
//   Divider,
// } from "@mui/material";
// import {
//   Video,
//   Star,
//   DollarSign,
//   BookOpen,
//   LogOut,
//   Play,
//   CheckCircle,
// } from "lucide-react";

// function SessionCard({
//   session,
//   userId,
//   userRole,
//   isEnrolled,
//   onEnroll,
//   onUnenroll,
//   onStartLive,
// }) {
//   const {
//     _id,
//     title,
//     skill,
//     scheduledFor,
//     duration,
//     maxLearners,
//     enrolledLearners = [],
//     tutorId,
//     tutorName,
//     price,
//     status,
//   } = session;
  
//   const isOwner = userId === tutorId;
//   const enrolledCount = enrolledLearners.length;
//   const canEnroll = enrolledCount < maxLearners;
//   const canStart = status === "scheduled" && enrolledCount > 0;

//   return (
//     <Card
//       variant="outlined"
//       sx={{
//         borderRadius: 4,
//         boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//         mb: 3,
//         background: "#fff",
//         transition: "all 0.25s ease",
//         "&:hover": {
//           boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
//           transform: "translateY(-2px)",
//         },
//       }}
//     >
//       <CardContent sx={{ p: 3 }}>
//         {/* Title */}
//         <Typography variant="h6" fontWeight="600" gutterBottom>
//           {title}
//         </Typography>

//         {/* Tutor */}
//         <Box display="flex" alignItems="center" gap={1} mb={1}>
//           <Star size={18} color="#f5b400" />
//           <Typography variant="body2" color="text.secondary">
//             {tutorName || "Unknown Tutor"}
//           </Typography>
//         </Box>

//         {/* Skill */}
//         <Box display="flex" alignItems="center" gap={1} mb={1}>
//           <BookOpen size={18} color="#4f46e5" />
//           <Typography variant="body2" color="text.secondary">
//             {skill}
//           </Typography>
//         </Box>

//         {/* Schedule */}
//         <Box display="flex" alignItems="center" gap={1} mb={1}>
//           <Video size={18} color="#0284c7" />
//           <Typography variant="body2" color="text.secondary">
//             {new Date(scheduledFor).toLocaleString()}
//           </Typography>
//         </Box>

//         {/* Duration */}
//         <Typography variant="body2" color="text.secondary" mb={2}>
//           ⏱ {duration} mins
//         </Typography>

//         {/* Price */}
//         {price && (
//           <Box display="flex" alignItems="center" gap={1} mb={2}>
//             <DollarSign size={18} color="#16a34a" />
//             <Typography variant="body2" fontWeight="500" color="text.primary">
//               ₹{price}
//             </Typography>
//           </Box>
//         )}

//         {/* Status + Capacity */}
//         <Box display="flex" gap={1} mb={2}>
//           <Chip
//             label={`${enrolledCount}/${maxLearners} learners`}
//             size="small"
//             sx={{
//               fontWeight: 500,
//               backgroundColor: canEnroll ? "#e0f2fe" : "#f3f4f6",
//               color: canEnroll ? "#0284c7" : "#6b7280",
//             }}
//           />
//           <Chip
//             label={status.toUpperCase()}
//             size="small"
//             sx={{
//               fontWeight: 600,
//               backgroundColor:
//                 status === "live"
//                   ? "#dcfce7"
//                   : status === "completed"
//                   ? "#f3f4f6"
//                   : "#fef9c3",
//               color:
//                 status === "live"
//                   ? "#16a34a"
//                   : status === "completed"
//                   ? "#6b7280"
//                   : "#ca8a04",
//             }}
//           />
//         </Box>

//         <Divider sx={{ my: 2 }} />

//         {/* Action Buttons */}
//         <Box mt={1} display="flex" flexDirection="column" gap={1}>
//           {status === "scheduled" && (
//             <>
//               {/* Tutor can start session */}
//               {canStart && isOwner && (
//                 <Button
//                   variant="contained"
//                   color="success"
//                   startIcon={<Play size={18} />}
//                   onClick={() => onStartLive?.(_id)}
//                   sx={{ borderRadius: 2, py: 1 }}
//                 >
//                   Start Session
//                 </Button>
//               )}

//               {/* Learner already enrolled → show "Join Session" + Enrolled badge */}
//               {userRole === "learner" && isEnrolled && (
//                 <>
//                   <Button
//                     variant="contained"
//                     color="success"
//                     startIcon={<Video size={18} />}
//                     onClick={() => window.open(`/session/${_id}`, "_blank")}
//                     sx={{ borderRadius: 2, py: 1 }}
//                   >
//                     Join Session
//                   </Button>

//                   <Button
//                     variant="outlined"
//                     startIcon={<CheckCircle size={18} color="#16a34a" />}
//                     sx={{
//                       borderRadius: 2,
//                       py: 1,
//                       borderColor: "#16a34a",
//                       color: "#16a34a",
//                       fontWeight: 600,
//                       cursor: "default",
//                     }}
//                     disabled
//                   >
//                     Enrolled
//                   </Button>
//                 </>
//               )}

//               {/* Learner can enroll */}
//               {userRole === "learner" && !isEnrolled && canEnroll && (
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => onEnroll?.(_id)}
//                   sx={{ borderRadius: 2, py: 1 }}
//                 >
//                   Enroll Now
//                 </Button>
//               )}

//               {/* Session full */}
//               {!canEnroll && !isEnrolled && userRole === "learner" && (
//                 <Chip
//                   label="Session Full"
//                   sx={{
//                     fontWeight: 500,
//                     backgroundColor: "#f3f4f6",
//                     color: "#6b7280",
//                   }}
//                 />
//               )}
//             </>
//           )}

//           {/* Live session button (both tutor & learner) */}
//           {status === "live" && (
//             <Button
//               variant="contained"
//               color="success"
//               startIcon={<Video size={18} />}
//               onClick={() => window.open(`/session/${_id}`, "_blank")}
//               sx={{ borderRadius: 2, py: 1 }}
//             >
//               Join Live
//             </Button>
//           )}
//         </Box>
//       </CardContent>
//     </Card>
//   );
// }

// export default SessionCard;




import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import {
  Video,
  Star,
  DollarSign,
  BookOpen,
  Play,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function SessionCard({
  session,
  userId,
  userRole,
  isEnrolled,
  onEnroll,
  onStartLive,
}) {
  const navigate = useNavigate();

  const {
    _id,
    title,
    skill,
    scheduledFor,
    duration,
    maxLearners,
    enrolledLearners = [],
    tutorId,
    tutorName,
    price,
    status,
  } = session;

  const isOwner = userId === tutorId;
  const enrolledCount = enrolledLearners.length;
  const canEnroll = enrolledCount < maxLearners;
  const canStart = status === "scheduled" && enrolledCount > 0;

  return (
    <Card variant="outlined" sx={{ borderRadius: 4, mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          {title}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Star size={18} color="#f5b400" />
          <Typography variant="body2">{tutorName || "Unknown Tutor"}</Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <BookOpen size={18} color="#4f46e5" />
          <Typography variant="body2">{skill}</Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Video size={18} color="#0284c7" />
          <Typography variant="body2">
            {new Date(scheduledFor).toLocaleString()}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          ⏱ {duration} mins
        </Typography>

        {price && (
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <DollarSign size={18} color="#16a34a" />
            <Typography variant="body2" fontWeight="500">
              ₹{price}
            </Typography>
          </Box>
        )}

        <Box display="flex" gap={1} mb={2}>
          <Chip
            label={`${enrolledCount}/${maxLearners} learners`}
            size="small"
          />
          <Chip label={status.toUpperCase()} size="small" />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mt={1} display="flex" flexDirection="column" gap={1}>
          {status === "scheduled" && (
            <>
              {canStart && isOwner && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => onStartLive?.(_id)}
                >
                  Start Session
                </Button>
              )}

              {userRole === "learner" && isEnrolled && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Video size={18} />}
                    onClick={() =>
                      navigate(`/session/${_id}`, { state: { session } })
                    }
                  >
                    Join Session
                  </Button>
                  <Button variant="outlined" disabled>
                    <CheckCircle size={18} /> Enrolled
                  </Button>
                </>
              )}

              {userRole === "learner" && !isEnrolled && canEnroll && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onEnroll?.(_id)}
                >
                  Enroll Now
                </Button>
              )}
            </>
          )}

          {status === "live" && (
            <Button
              variant="contained"
              color="success"
              startIcon={<Video size={18} />}
              onClick={() =>
                navigate(`/session/${_id}`, { state: { session } })
              }
            >
              Join Live
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default SessionCard;
