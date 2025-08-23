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
//   CheckCircle,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// function SessionCard({
//   session,
//   userId,
//   userRole,
//   isEnrolled,
//   onEnroll,
//   onStartLive,
// }) {
//   const navigate = useNavigate();

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
//         mb: 3,
//         width: 290, // fixed width
//         height: 340, // 🔹 reduced height (was 380)
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <CardContent
//         sx={{
//           p: 3,
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between", // keeps spacing tight
//           height: "100%",
//         }}
//       >
//         {/* Top Content */}
//         <Box>
//           {/* Title with ellipsis */}
//           <Typography
//             variant="h6"
//             fontWeight="600"
//             gutterBottom
//             sx={{
//               whiteSpace: "nowrap",
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//             }}
//           >
//             {title}
//           </Typography>

//           {/* Tutor */}
//           <Box display="flex" alignItems="center" gap={1} mb={1}>
//             <Star size={18} color="#f5b400" />
//             <Typography
//               variant="body2"
//               sx={{
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 maxWidth: "200px",
//               }}
//             >
//               {tutorName || "Unknown Tutor"}
//             </Typography>
//           </Box>

//           {/* Skill */}
//           <Box display="flex" alignItems="center" gap={1} mb={1}>
//             <BookOpen size={18} color="#4f46e5" />
//             <Typography
//               variant="body2"
//               sx={{
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 maxWidth: "200px",
//               }}
//             >
//               {skill}
//             </Typography>
//           </Box>

//           {/* Time */}
//           <Box display="flex" alignItems="center" gap={1} mb={1}>
//             <Video size={18} color="#0284c7" />
//             <Typography
//               variant="body2"
//               sx={{
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 maxWidth: "200px",
//               }}
//             >
//               {new Date(scheduledFor).toLocaleString()}
//             </Typography>
//           </Box>

//           <Typography variant="body2" color="text.secondary" mb={2}>
//             ⏱ {duration} mins
//           </Typography>

//           {price && (
//             <Box display="flex" alignItems="center" gap={1} mb={2}>
//               <DollarSign size={18} color="#16a34a" />
//               <Typography variant="body2" fontWeight="500">
//                 {price}
//               </Typography>
//             </Box>
//           )}

//           <Box display="flex" gap={1} mb={2}>
//             <Chip
//               label={`${enrolledCount}/${maxLearners} learners`}
//               size="small"
//             />
//             <Chip label={status.toUpperCase()} size="small" />
//           </Box>
//         </Box>

//         <Divider sx={{ my: 1 }} />

//         {/* Actions */}
//         <Box display="flex" flexDirection="column" gap={1}>
//           {status === "scheduled" && userRole === "learner" && (
//             <>
//               {!isEnrolled && canEnroll && (
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   onClick={() => onEnroll?.(_id)}
//                 >
//                   Enroll Now
//                 </Button>
//               )}

//               {isEnrolled && (
//                 <Button
//                   variant="outlined"
//                   disabled
//                   fullWidth
//                   startIcon={<CheckCircle size={18} />}
//                 >
//                   Enrolled
//                 </Button>
//               )}
//             </>
//           )}

//           {status === "live" && (
//             <Button
//               variant="contained"
//               color="success"
//               fullWidth
//               startIcon={<Video size={18} />}
//               onClick={() =>
//                 navigate(`/session/${_id}`, { state: { session } })
//               }
//             >
//               Join Session
//             </Button>
//           )}

//           {/* Tutor start session */}
//           {status === "scheduled" && canStart && isOwner && (
//             <Button
//               variant="contained"
//               color="success"
//               fullWidth
//               onClick={() => onStartLive?.(_id)}
//             >
//               Start Session
//             </Button>
//           )}
//         </Box>
//       </CardContent>
//     </Card>
//   );
// }

// export default SessionCard;
import React, { useEffect, useState } from "react";
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
  onJoin
}) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(session.status);

  useEffect(() => {
    setStatus(session.status);
  }, [session.status]);

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
  } = session;

  const isOwner = userId === tutorId;
  const enrolledCount = enrolledLearners.length;
  const canEnroll = enrolledCount < maxLearners;
  const canStart = status === "scheduled" && enrolledCount > 0;

  return (
    <Card variant="outlined" sx={{ borderRadius: 4, mb: 3, width: 290, height: 340, display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        <Box>
          <Typography variant="h6" fontWeight="600" gutterBottom sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title}
          </Typography>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Star size={18} color="#f5b400" />
            <Typography variant="body2" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}>
              {tutorName || "Unknown Tutor"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <BookOpen size={18} color="#4f46e5" />
            <Typography variant="body2" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}>
              {skill}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Video size={18} color="#0284c7" />
            <Typography variant="body2" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}>
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
                {price}
              </Typography>
            </Box>
          )}

          <Box display="flex" gap={1} mb={2}>
            <Chip label={`${enrolledCount}/${maxLearners} learners`} size="small" />
            <Chip label={status.toUpperCase()} size="small" />
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" flexDirection="column" gap={1}>
          {status === "scheduled" && userRole === "learner" && (
            <>
              {!isEnrolled && canEnroll && (
                <Button variant="contained" color="primary" fullWidth onClick={() => onEnroll?.(_id)}>
                  Enroll Now
                </Button>
              )}

              {isEnrolled && (
                <Button variant="outlined" disabled fullWidth startIcon={<CheckCircle size={18} />}>
                  Enrolled
                </Button>
              )}
            </>
          )}

          {status === "live" && (
            <Button variant="contained" color="success" fullWidth startIcon={<Video size={18} />} onClick={() => {
              // navigate into the live session
              navigate(`/session/${_id}`, { state: { session } });
              onJoin?.(session);
            }}>
              Join Session
            </Button>
          )}

          {status === "scheduled" && canStart && isOwner && (
            <Button variant="contained" color="success" fullWidth onClick={() => onStartLive?.(_id)}>
              Start Session
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default SessionCard;
