// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   IconButton,
// //   Box,
// //   Typography,
// //   Avatar,
// //   TextField,
// //   Divider,
// //   useTheme,
// //   Stack,
// // } from "@mui/material";
// // import {
// //   Videocam,
// //   VideocamOff,
// //   Mic,
// //   MicOff,
// //   CallEnd,
// //   Chat,
// //   Send,
// //   People,
// //   Settings,
// //   Fullscreen,
// //   FullscreenExit,
// // } from "@mui/icons-material";

// // const VideoCall = ({ session, user, onLeave }) => {
// //   const [isVideoOn, setIsVideoOn] = useState(true);
// //   const [isAudioOn, setIsAudioOn] = useState(true);
// //   const [showChat, setShowChat] = useState(true);
// //   const [chatMessage, setChatMessage] = useState("");
// //   const [chatMessages, setChatMessages] = useState(session.chatMessages || []);
// //   const [isFullscreen, setIsFullscreen] = useState(false);
// //   const [stream, setStream] = useState(null);

// //   const videoRef = useRef(null);
// //   const chatEndRef = useRef(null);
// //   const theme = useTheme();

// //   const participants = [
// //     { id: user.id, name: user.name, isHost: session.tutorId === user.id },
// //   ];

// //   // ✅ Request media stream
// //   const getMedia = async () => {
// //     try {
// //       const mediaStream = await navigator.mediaDevices.getUserMedia({
// //         video: true,
// //         audio: true,
// //       });
// //       setStream(mediaStream);
// //     } catch (err) {
// //       console.error("Error accessing media devices:", err);
// //     }
// //   };

// //   // ✅ Initialize media and cleanup on unmount
// //   useEffect(() => {
// //     getMedia();

// //     return () => {
// //       if (stream) {
// //         stream.getTracks().forEach((track) => track.stop());
// //       }
// //       if (videoRef.current) {
// //         videoRef.current.srcObject = null;
// //       }
// //       setStream(null);
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   // ✅ Attach stream to video
// //   useEffect(() => {
// //     if (videoRef.current) {
// //       videoRef.current.srcObject = isVideoOn && stream ? stream : null;
// //     }
// //   }, [stream, isVideoOn]);

// //   // ✅ Enable/disable tracks when toggled
// //   useEffect(() => {
// //     if (stream) {
// //       stream.getVideoTracks().forEach((track) => (track.enabled = isVideoOn));
// //       stream.getAudioTracks().forEach((track) => (track.enabled = isAudioOn));
// //     }
// //   }, [isVideoOn, isAudioOn, stream]);

// //   // ✅ Auto-scroll chat
// //   useEffect(() => {
// //     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [chatMessages]);

// //   const sendMessage = () => {
// //     if (chatMessage.trim()) {
// //       const newMessage = {
// //         id: Date.now().toString(),
// //         userId: user.id,
// //         userName: user.name,
// //         message: chatMessage.trim(),
// //         timestamp: new Date(),
// //       };
// //       setChatMessages((prev) => [...prev, newMessage]);
// //       setChatMessage("");
// //     }
// //   };

// //   // ✅ End call and cleanup immediately
// //   const handleEndCall = () => {
// //     if (stream) {
// //       stream.getTracks().forEach((track) => track.stop());
// //     }
// //     if (videoRef.current) {
// //       videoRef.current.srcObject = null;
// //     }
// //     setStream(null);
// //     onLeave();
// //   };

// //   const toggleFullscreen = () => {
// //     if (!document.fullscreenElement) {
// //       document.documentElement.requestFullscreen();
// //       setIsFullscreen(true);
// //     } else {
// //       document.exitFullscreen();
// //       setIsFullscreen(false);
// //     }
// //   };

// //   return (
// //     <Box
// //       sx={{
// //         width: "100vw",
// //         height: "100vh",
// //         overflow: "hidden",
// //         display: "flex",
// //         flexDirection: "column",
// //         bgcolor: "grey.900",
// //       }}
// //     >
// //       {/* Header (hidden in fullscreen) */}
// //       {!isFullscreen && (
// //         <Box
// //           p={2}
// //           display="flex"
// //           justifyContent="space-between"
// //           alignItems="center"
// //           sx={{ bgcolor: "grey.800" }}
// //         >
// //           <Box display="flex" alignItems="center" gap={2}>
// //             <Box
// //               width={10}
// //               height={10}
// //               borderRadius="50%"
// //               bgcolor="error.main"
// //             />
// //             <Typography variant="h6" color="white">
// //               LIVE – {session.title}
// //             </Typography>
// //           </Box>
// //           <Box display="flex" alignItems="center" gap={1} color="grey.300">
// //             <People />
// //             <Typography>{participants.length}</Typography>
// //             <IconButton onClick={toggleFullscreen} sx={{ color: "white" }}>
// //               <Fullscreen />
// //             </IconButton>
// //           </Box>
// //         </Box>
// //       )}

// //       {/* Main Layout */}
// //       <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
// //         {/* Video Area */}
// //         <Box
// //           flex={1}
// //           sx={{
// //             position: "relative",
// //             backgroundColor: "#000",
// //             display: "flex",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             overflow: "hidden",
// //           }}
// //         >
// //           {isVideoOn && stream ? (
// //             <video
// //               ref={videoRef}
// //               autoPlay
// //               muted
// //               playsInline
// //               style={{
// //                 width: "100%",
// //                 height: "100%",
// //                 objectFit: "cover",
// //               }}
// //             />
// //           ) : (
// //             <Box textAlign="center" color="white">
// //               <Avatar sx={{ width: 80, height: 80, margin: "auto" }}>
// //                 {user.name.charAt(0)}
// //               </Avatar>
// //               <Typography mt={2}>Camera is off</Typography>
// //             </Box>
// //           )}

// //           {/* Control Bar */}
// //           <Stack
// //             direction="row"
// //             spacing={2}
// //             position="absolute"
// //             bottom={24}
// //             left="50%"
// //             sx={{
// //               transform: "translateX(-50%)",
// //               bgcolor: "rgba(0,0,0,0.6)",
// //               borderRadius: 5,
// //               px: 2,
// //               py: 1,
// //               backdropFilter: "blur(6px)",
// //             }}
// //           >
// //             <IconButton
// //               onClick={() => setIsAudioOn((p) => !p)}
// //               sx={{ color: isAudioOn ? "white" : "error.main" }}
// //             >
// //               {isAudioOn ? <Mic /> : <MicOff />}
// //             </IconButton>

// //             <IconButton
// //               onClick={() => setIsVideoOn((p) => !p)}
// //               sx={{ color: isVideoOn ? "white" : "error.main" }}
// //             >
// //               {isVideoOn ? <Videocam /> : <VideocamOff />}
// //             </IconButton>

// //             <IconButton
// //               onClick={() => setShowChat((p) => !p)}
// //               sx={{ color: showChat ? "primary.main" : "white" }}
// //             >
// //               <Chat />
// //             </IconButton>

// //             <IconButton sx={{ color: "white" }}>
// //               <Settings />
// //             </IconButton>

// //             <IconButton onClick={handleEndCall} sx={{ color: "error.main" }}>
// //               <CallEnd />
// //             </IconButton>

// //             {isFullscreen && (
// //               <IconButton onClick={toggleFullscreen} sx={{ color: "white" }}>
// //                 <FullscreenExit />
// //               </IconButton>
// //             )}
// //           </Stack>
// //         </Box>

// //         {/* Chat Panel */}
// //         {showChat && (
// //           <Box
// //             width={320}
// //             sx={{
// //               bgcolor: "grey.50",
// //               display: "flex",
// //               flexDirection: "column",
// //               borderLeft: `1px solid ${theme.palette.divider}`,
// //             }}
// //           >
// //             <Box
// //               p={2}
// //               sx={{
// //                 borderBottom: `1px solid ${theme.palette.divider}`,
// //                 bgcolor: "grey.100",
// //               }}
// //             >
// //               <Typography variant="subtitle1" color="text.primary">
// //                 Session Chat
// //               </Typography>
// //             </Box>

// //             <Box flex={1} p={2} sx={{ overflowY: "auto" }}>
// //               {chatMessages.map((msg) => (
// //                 <Box key={msg.id} mb={2}>
// //                   <Typography variant="subtitle2" color="text.primary">
// //                     {msg.userName}
// //                   </Typography>
// //                   <Typography variant="body2" color="text.secondary">
// //                     {msg.message}
// //                   </Typography>
// //                   <Typography variant="caption" color="text.disabled">
// //                     {new Date(msg.timestamp).toLocaleTimeString([], {
// //                       hour: "2-digit",
// //                       minute: "2-digit",
// //                     })}
// //                   </Typography>
// //                 </Box>
// //               ))}
// //               <div ref={chatEndRef} />
// //             </Box>

// //             <Divider />
// //             <Box p={2} display="flex" gap={1}>
// //               <TextField
// //                 fullWidth
// //                 size="small"
// //                 placeholder="Type a message..."
// //                 variant="outlined"
// //                 value={chatMessage}
// //                 onChange={(e) => setChatMessage(e.target.value)}
// //                 onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// //               />
// //               <IconButton
// //                 onClick={sendMessage}
// //                 disabled={!chatMessage.trim()}
// //                 color="primary"
// //               >
// //                 <Send />
// //               </IconButton>
// //             </Box>
// //           </Box>
// //         )}
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default VideoCall;
// import React, { useState, useEffect, useRef } from "react";
// import {
//   IconButton,
//   Box,
//   Typography,
//   Avatar,
//   TextField,
//   Divider,
//   useTheme,
//   Stack,
//   Drawer,
//   Paper,
// } from "@mui/material";
// import {
//   Videocam,
//   VideocamOff,
//   Mic,
//   MicOff,
//   CallEnd,
//   Chat,
//   Send,
//   People,
//   Settings,
//   Fullscreen,
//   FullscreenExit,
// } from "@mui/icons-material";
// import { useMediaQuery } from "@mui/material";

// const VideoCall = ({ session, user, onLeave }) => {
//   const [isVideoOn, setIsVideoOn] = useState(true);
//   const [isAudioOn, setIsAudioOn] = useState(true);
//   const [showChat, setShowChat] = useState(false);
//   const [chatMessage, setChatMessage] = useState("");
//   const [chatMessages, setChatMessages] = useState(session.chatMessages || []);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [stream, setStream] = useState(null);

//   const videoRef = useRef(null);
//   const chatEndRef = useRef(null);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const participants = [
//     { id: user.id, name: user.name, isHost: session.tutorId === user.id },
//   ];

//   // Request media stream
//   const getMedia = async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       setStream(mediaStream);
//     } catch (err) {
//       console.error("Error accessing media devices:", err);
//     }
//   };

//   useEffect(() => {
//     getMedia();
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach((track) => track.stop());
//       }
//       if (videoRef.current) {
//         videoRef.current.srcObject = null;
//       }
//       setStream(null);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Attach stream to video
//   useEffect(() => {
//     if (videoRef.current) {
//       videoRef.current.srcObject = isVideoOn && stream ? stream : null;
//     }
//   }, [stream, isVideoOn]);

//   // Enable/disable tracks
//   useEffect(() => {
//     if (stream) {
//       stream.getVideoTracks().forEach((track) => (track.enabled = isVideoOn));
//       stream.getAudioTracks().forEach((track) => (track.enabled = isAudioOn));
//     }
//   }, [isVideoOn, isAudioOn, stream]);

//   // Auto-scroll chat
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatMessages]);

//   const sendMessage = () => {
//     if (chatMessage.trim()) {
//       const newMessage = {
//         id: Date.now().toString(),
//         userId: user.id,
//         userName: user.name,
//         message: chatMessage.trim(),
//         timestamp: new Date(),
//       };
//       setChatMessages((prev) => [...prev, newMessage]);
//       setChatMessage("");
//     }
//   };

//   const handleEndCall = () => {
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//     setStream(null);
//     onLeave();
//   };

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen();
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen();
//       setIsFullscreen(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         width: "100vw",
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         bgcolor: "grey.900",
//       }}
//     >
//       {/* Header (desktop only) */}
//       {!isFullscreen && !isMobile && (
//         <Paper
//           elevation={2}
//           sx={{
//             p: 2,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             bgcolor: "grey.800",
//             borderRadius: 0,
//           }}
//         >
//           <Box display="flex" alignItems="center" gap={2}>
//             <Box
//               width={10}
//               height={10}
//               borderRadius="50%"
//               bgcolor="error.main"
//             />
//             <Typography variant="h6" color="white" fontWeight="bold">
//               LIVE – {session.title}
//             </Typography>
//           </Box>
//           <Box display="flex" alignItems="center" gap={1} color="grey.300">
//             <People />
//             <Typography>{participants.length}</Typography>
//             <IconButton onClick={toggleFullscreen} sx={{ color: "white" }}>
//               {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
//             </IconButton>
//           </Box>
//         </Paper>
//       )}

//       {/* Main Layout */}
//       <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
//         {/* Video Area */}
//         <Box
//           flex={1}
//           sx={{
//             position: "relative",
//             backgroundColor: "#000",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           {isVideoOn && stream ? (
//             <video
//               ref={videoRef}
//               autoPlay
//               muted
//               playsInline
//               style={{ width: "100%", height: "100%", objectFit: "cover" }}
//             />
//           ) : (
//             <Box textAlign="center" color="white">
//               <Avatar sx={{ width: 80, height: 80, margin: "auto" }}>
//                 {user.name.charAt(0)}
//               </Avatar>
//               <Typography mt={2}>Camera is off</Typography>
//             </Box>
//           )}

//           {/* Control Bar */}
//           <Stack
//             direction="row"
//             spacing={isMobile ? 3 : 2}
//             position="absolute"
//             bottom={isMobile ? 16 : 24}
//             left="50%"
//             sx={{
//               transform: "translateX(-50%)",
//               bgcolor: "rgba(0,0,0,0.6)",
//               borderRadius: 5,
//               px: isMobile ? 3 : 2,
//               py: 1,
//               backdropFilter: "blur(6px)",
//             }}
//           >
//             <IconButton
//               onClick={() => setIsAudioOn((p) => !p)}
//               sx={{ color: isAudioOn ? "white" : "error.main" }}
//             >
//               {isAudioOn ? <Mic /> : <MicOff />}
//             </IconButton>

//             <IconButton
//               onClick={() => setIsVideoOn((p) => !p)}
//               sx={{ color: isVideoOn ? "white" : "error.main" }}
//             >
//               {isVideoOn ? <Videocam /> : <VideocamOff />}
//             </IconButton>

//             <IconButton
//               onClick={() => setShowChat((prev) => !prev)}
//               sx={{ color: showChat ? "primary.main" : "white" }}
//             >
//               <Chat />
//             </IconButton>

//             {!isMobile && (
//               <IconButton sx={{ color: "white" }}>
//                 <Settings />
//               </IconButton>
//             )}

//             <IconButton onClick={handleEndCall} sx={{ color: "error.main" }}>
//               <CallEnd />
//             </IconButton>
//           </Stack>
//         </Box>

//         {/* Desktop Chat Panel (modern UI) */}
//         {!isMobile && showChat && (
//           <Paper
//             elevation={3}
//             sx={{
//               width: 340,
//               display: "flex",
//               flexDirection: "column",
//               borderLeft: `1px solid ${theme.palette.divider}`,
//               bgcolor: "grey.50",
//             }}
//           >
//             <Box
//               p={2}
//               sx={{
//                 borderBottom: `1px solid ${theme.palette.divider}`,
//                 bgcolor: "grey.100",
//               }}
//             >
//               <Typography variant="subtitle1" fontWeight="bold">
//                 Session Chat
//               </Typography>
//             </Box>

//             <Box flex={1} p={2} sx={{ overflowY: "auto" }}>
//               {chatMessages.map((msg) => (
//                 <Paper
//                   key={msg.id}
//                   elevation={1}
//                   sx={{
//                     p: 1.2,
//                     mb: 1.5,
//                     bgcolor:
//                       msg.userId === user.id
//                         ? "primary.light"
//                         : "background.paper",
//                   }}
//                 >
//                   <Typography variant="subtitle2" fontWeight="bold">
//                     {msg.userName}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {msg.message}
//                   </Typography>
//                 </Paper>
//               ))}
//               <div ref={chatEndRef} />
//             </Box>

//             <Divider />
//             <Box p={2} display="flex" gap={1}>
//               <TextField
//                 fullWidth
//                 size="small"
//                 placeholder="Type a message..."
//                 value={chatMessage}
//                 onChange={(e) => setChatMessage(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               />
//               <IconButton
//                 onClick={sendMessage}
//                 disabled={!chatMessage.trim()}
//                 color="primary"
//               >
//                 <Send />
//               </IconButton>
//             </Box>
//           </Paper>
//         )}
//       </Box>

//       {/* Mobile Chat Drawer (unchanged) */}
//       {isMobile && (
//         <Drawer
//           anchor="bottom"
//           open={showChat}
//           onClose={() => setShowChat(false)}
//           PaperProps={{
//             sx: { height: "60%", borderTopLeftRadius: 16, borderTopRightRadius: 16 },
//           }}
//         >
//           <Box
//             p={2}
//             sx={{
//               borderBottom: `1px solid ${theme.palette.divider}`,
//               bgcolor: "grey.100",
//             }}
//           >
//             <Typography variant="subtitle1" fontWeight="bold">
//               Session Chat
//             </Typography>
//           </Box>

//           <Box flex={1} p={2} sx={{ overflowY: "auto" }}>
//             {chatMessages.map((msg) => (
//               <Box key={msg.id} mb={2}>
//                 <Typography variant="subtitle2" fontWeight="bold">
//                   {msg.userName}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {msg.message}
//                 </Typography>
//               </Box>
//             ))}
//             <div ref={chatEndRef} />
//           </Box>

//           <Divider />
//           <Box p={2} display="flex" gap={1}>
//             <TextField
//               fullWidth
//               size="small"
//               placeholder="Type a message..."
//               value={chatMessage}
//               onChange={(e) => setChatMessage(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             />
//             <IconButton
//               onClick={sendMessage}
//               disabled={!chatMessage.trim()}
//               color="primary"
//             >
//               <Send />
//             </IconButton>
//           </Box>
//         </Drawer>
//       )}
//     </Box>
//   );
// };

// export default VideoCall;
import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Box,
  Typography,
  Avatar,
  TextField,
  Divider,
  useTheme,
  Stack,
  Drawer,
  Paper,
} from "@mui/material";
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  CallEnd,
  Chat,
  Send,
  People,
  Settings,
  Fullscreen,
  FullscreenExit,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";

const VideoCall = ({ session, user, onLeave }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(session.chatMessages || []);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const chatEndRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const participants = [
    { id: user.id, name: user.name, isHost: session.tutorId === user.id },
  ];

  const getMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  useEffect(() => {
    getMedia();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = isVideoOn && stream ? stream : null;
    }
  }, [stream, isVideoOn]);

  useEffect(() => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = isVideoOn));
      stream.getAudioTracks().forEach((track) => (track.enabled = isAudioOn));
    }
  }, [isVideoOn, isAudioOn, stream]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        message: chatMessage.trim(),
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, newMessage]);
      setChatMessage("");
    }
  };

  const handleEndCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
    onLeave();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Format timestamp
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Chat bubble component
  const ChatBubble = ({ msg }) => {
    const isMine = msg.userId === user.id;
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: isMine ? "flex-end" : "flex-start",
          mb: 1.5,
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 1.2,
            maxWidth: "75%",
            bgcolor: isMine ? "#DCF8C6" : "white", // WhatsApp style
            color: "black",
            borderRadius: 3,
            borderTopRightRadius: isMine ? 0 : 12,
            borderTopLeftRadius: isMine ? 12 : 0,
          }}
        >
          {!isMine && (
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ fontSize: "0.8rem", mb: 0.3 }}
            >
              {msg.userName}
            </Typography>
          )}
          <Typography variant="body2">{msg.message}</Typography>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.5,
              opacity: 0.6,
              textAlign: "right",
              fontSize: "0.7rem",
            }}
          >
            {formatTime(msg.timestamp)}
          </Typography>
        </Paper>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "grey.900",
      }}
    >
      {/* Header (desktop only) */}
      {!isFullscreen && !isMobile && (
        <Paper
          elevation={2}
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "grey.800",
            borderRadius: 0,
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Box width={10} height={10} borderRadius="50%" bgcolor="error.main" />
            <Typography variant="h6" color="white" fontWeight="bold">
              LIVE – {session.title}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} color="grey.300">
            <People />
            <Typography>{participants.length}</Typography>
            <IconButton onClick={toggleFullscreen} sx={{ color: "white" }}>
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Box>
        </Paper>
      )}

      {/* Main Layout */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Video Area */}
        <Box
          flex={1}
          sx={{
            position: "relative",
            backgroundColor: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isVideoOn && stream ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Box textAlign="center" color="white">
              <Avatar sx={{ width: 80, height: 80, margin: "auto" }}>
                {user.name.charAt(0)}
              </Avatar>
              <Typography mt={2}>Camera is off</Typography>
            </Box>
          )}

          {/* Control Bar */}
          <Stack
            direction="row"
            spacing={isMobile ? 3 : 2}
            position="absolute"
            bottom={isMobile ? 16 : 24}
            left="50%"
            sx={{
              transform: "translateX(-50%)",
              bgcolor: "rgba(0,0,0,0.6)",
              borderRadius: 5,
              px: isMobile ? 3 : 2,
              py: 1,
              backdropFilter: "blur(6px)",
            }}
          >
            <IconButton
              onClick={() => setIsAudioOn((p) => !p)}
              sx={{ color: isAudioOn ? "white" : "error.main" }}
            >
              {isAudioOn ? <Mic /> : <MicOff />}
            </IconButton>

            <IconButton
              onClick={() => setIsVideoOn((p) => !p)}
              sx={{ color: isVideoOn ? "white" : "error.main" }}
            >
              {isVideoOn ? <Videocam /> : <VideocamOff />}
            </IconButton>

            <IconButton
              onClick={() => setShowChat((prev) => !prev)}
              sx={{ color: showChat ? "primary.main" : "white" }}
            >
              <Chat />
            </IconButton>

            {!isMobile && (
              <IconButton sx={{ color: "white" }}>
                <Settings />
              </IconButton>
            )}

            <IconButton onClick={handleEndCall} sx={{ color: "error.main" }}>
              <CallEnd />
            </IconButton>
          </Stack>
        </Box>

        {/* Desktop Chat Panel */}
        {!isMobile && showChat && (
          <Paper
            elevation={3}
            sx={{
              width: 340,
              display: "flex",
              flexDirection: "column",
              borderLeft: `1px solid ${theme.palette.divider}`,
              bgcolor: "grey.50",
            }}
          >
            <Box
              p={2}
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                bgcolor: "grey.100",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Session Chat
              </Typography>
            </Box>

            <Box flex={1} p={2} sx={{ overflowY: "auto" }}>
              {chatMessages.map((msg) => (
                <ChatBubble key={msg.id} msg={msg} />
              ))}
              <div ref={chatEndRef} />
            </Box>

            <Divider />
            <Box p={2} display="flex" gap={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <IconButton
                onClick={sendMessage}
                disabled={!chatMessage.trim()}
                color="primary"
              >
                <Send />
              </IconButton>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Mobile Chat Drawer */}
      {isMobile && (
        <Drawer
          anchor="bottom"
          open={showChat}
          onClose={() => setShowChat(false)}
          PaperProps={{
            sx: { height: "60%", borderTopLeftRadius: 16, borderTopRightRadius: 16 },
          }}
        >
          <Box
            p={2}
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: "grey.100",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Session Chat
            </Typography>
          </Box>

          <Box flex={1} p={2} sx={{ overflowY: "auto" }}>
            {chatMessages.map((msg) => (
              <ChatBubble key={msg.id} msg={msg} />
            ))}
            <div ref={chatEndRef} />
          </Box>

          <Divider />
          <Box p={2} display="flex" gap={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <IconButton
              onClick={sendMessage}
              disabled={!chatMessage.trim()}
              color="primary"
            >
              <Send />
            </IconButton>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default VideoCall;
