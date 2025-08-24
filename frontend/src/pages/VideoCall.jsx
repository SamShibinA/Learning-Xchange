



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
// //   Drawer,
// //   Paper,
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
// // import { useMediaQuery } from "@mui/material";

// // const VideoCall = ({ session, user, onLeave }) => {
// //   const [isVideoOn, setIsVideoOn] = useState(true);
// //   const [isAudioOn, setIsAudioOn] = useState(true);
// //   const [showChat, setShowChat] = useState(false);
// //   const [chatMessage, setChatMessage] = useState("");
// //   const [chatMessages, setChatMessages] = useState(session.chatMessages || []);
// //   const [isFullscreen, setIsFullscreen] = useState(false);
// //   const [stream, setStream] = useState(null);

// //   const videoRef = useRef(null);
// //   const chatEndRef = useRef(null);
// //   const theme = useTheme();
// //   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

// //   const participants = [
// //     { id: user._id, name: user.name, isHost: session.tutorId === user.id },
// //   ];


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

// //   useEffect(() => {
// //     if (videoRef.current) {
// //       videoRef.current.srcObject = isVideoOn && stream ? stream : null;
// //     }
// //   }, [stream, isVideoOn]);

// //   useEffect(() => {
// //     if (stream) {
// //       stream.getVideoTracks().forEach((track) => (track.enabled = isVideoOn));
// //       stream.getAudioTracks().forEach((track) => (track.enabled = isAudioOn));
// //     }
// //   }, [isVideoOn, isAudioOn, stream]);

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

// //   // Format timestamp
// //   const formatTime = (date) => {
// //     return new Date(date).toLocaleTimeString([], {
// //       hour: "2-digit",
// //       minute: "2-digit",
// //     });
// //   };

// //   // Chat bubble component
// //   const ChatBubble = ({ msg }) => {
// //     const isMine = msg.userId === user.id;
// //     return (
// //       <Box
// //         sx={{
// //           display: "flex",
// //           flexDirection: "column",
// //           alignItems: isMine ? "flex-end" : "flex-start",
// //           mb: 1.5,
// //         }}
// //       >
// //         <Paper
// //           elevation={1}
// //           sx={{
// //             p: 1.2,
// //             maxWidth: "75%",
// //             bgcolor: isMine ? "#DCF8C6" : "white", // WhatsApp style
// //             color: "black",
// //             borderRadius: 3,
// //             borderTopRightRadius: isMine ? 0 : 12,
// //             borderTopLeftRadius: isMine ? 12 : 0,
// //           }}
// //         >
// //           {!isMine && (
// //             <Typography
// //               variant="subtitle2"
// //               fontWeight="bold"
// //               sx={{ fontSize: "0.8rem", mb: 0.3 }}
// //             >
// //               {msg.userName}
// //             </Typography>
// //           )}
// //           <Typography variant="body2">{msg.message}</Typography>
// //           <Typography
// //             variant="caption"
// //             sx={{
// //               display: "block",
// //               mt: 0.5,
// //               opacity: 0.6,
// //               textAlign: "right",
// //               fontSize: "0.7rem",
// //             }}
// //           >
// //             {formatTime(msg.timestamp)}
// //           </Typography>
// //         </Paper>
// //       </Box>
// //     );
// //   };

// //   return (
// //     <Box
// //       sx={{
// //         width: "100vw",
// //         height: "100vh",
// //         display: "flex",
// //         flexDirection: "column",
// //         bgcolor: "grey.900",
// //       }}
// //     >
// //       {/* Header (desktop only) */}
// //       {!isFullscreen && !isMobile && (
// //         <Paper
// //           elevation={2}
// //           sx={{
// //             p: 2,
// //             display: "flex",
// //             justifyContent: "space-between",
// //             alignItems: "center",
// //             bgcolor: "grey.800",
// //             borderRadius: 0,
// //           }}
// //         >
// //           <Box display="flex" alignItems="center" gap={2}>
// //             <Box width={10} height={10} borderRadius="50%" bgcolor="error.main" />
// //             <Typography variant="h6" color="white" fontWeight="bold">
// //               LIVE – {session.title}
// //             </Typography>
// //           </Box>
// //           <Box display="flex" alignItems="center" gap={1} color="grey.300">
// //             <People />
// //             <Typography>{participants.length}</Typography>
// //             <IconButton onClick={toggleFullscreen} sx={{ color: "white" }}>
// //               {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
// //             </IconButton>
// //           </Box>
// //         </Paper>
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
// //           }}
// //         >
// //           {isVideoOn && stream ? (
// //             <video
// //               ref={videoRef}
// //               autoPlay
// //               muted
// //               playsInline
// //               style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
// //             spacing={isMobile ? 3 : 2}
// //             position="absolute"
// //             bottom={isMobile ? 16 : 24}
// //             left="50%"
// //             sx={{
// //               transform: "translateX(-50%)",
// //               bgcolor: "rgba(0,0,0,0.6)",
// //               borderRadius: 5,
// //               px: isMobile ? 3 : 2,
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
// //               onClick={() => setShowChat((prev) => !prev)}
// //               sx={{ color: showChat ? "primary.main" : "white" }}
// //             >
// //               <Chat />
// //             </IconButton>

// //             {!isMobile && (
// //               <IconButton sx={{ color: "white" }}>
// //                 <Settings />
// //               </IconButton>
// //             )}

// //             <IconButton onClick={handleEndCall} sx={{ color: "error.main" }}>
// //               <CallEnd />
// //             </IconButton>
// //           </Stack>
// //         </Box>

// //         {/* Desktop Chat Panel */}
// //         {!isMobile && showChat && (
// //           <Paper
// //             elevation={3}
// //             sx={{
// //               width: 340,
// //               display: "flex",
// //               flexDirection: "column",
// //               borderLeft: `1px solid ${theme.palette.divider}`,
// //               bgcolor: "grey.50",
// //             }}
// //           >
// //             <Box
// //               p={2}
// //               sx={{
// //                 borderBottom: `1px solid ${theme.palette.divider}`,
// //                 bgcolor: "grey.100",
// //               }}
// //             >
// //               <Typography variant="subtitle1" fontWeight="bold">
// //                 Session Chat
// //               </Typography>
// //             </Box>

// //             <Box flex={1} p={2} sx={{ overflowY: "auto" }}>
// //               {chatMessages.map((msg) => (
// //                 <ChatBubble key={msg.id} msg={msg} />
// //               ))}
// //               <div ref={chatEndRef} />
// //             </Box>

// //             <Divider />
// //             <Box p={2} display="flex" gap={1}>
// //               <TextField
// //                 fullWidth
// //                 size="small"
// //                 placeholder="Type a message..."
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
// //           </Paper>
// //         )}
// //       </Box>

// //       {/* Mobile Chat Drawer */}
// //       {isMobile && (
// //         <Drawer
// //           anchor="bottom"
// //           open={showChat}
// //           onClose={() => setShowChat(false)}
// //           PaperProps={{
// //             sx: { height: "60%", borderTopLeftRadius: 16, borderTopRightRadius: 16 },
// //           }}
// //         >
// //           <Box
// //             p={2}
// //             sx={{
// //               borderBottom: `1px solid ${theme.palette.divider}`,
// //               bgcolor: "grey.100",
// //             }}
// //           >
// //             <Typography variant="subtitle1" fontWeight="bold">
// //               Session Chat
// //             </Typography>
// //           </Box>

// //           <Box flex={1} p={2} sx={{ overflowY: "auto" }}>
// //             {chatMessages.map((msg) => (
// //               <ChatBubble key={msg.id} msg={msg} />
// //             ))}
// //             <div ref={chatEndRef} />
// //           </Box>

// //           <Divider />
// //           <Box p={2} display="flex" gap={1}>
// //             <TextField
// //               fullWidth
// //               size="small"
// //               placeholder="Type a message..."
// //               value={chatMessage}
// //               onChange={(e) => setChatMessage(e.target.value)}
// //               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// //             />
// //             <IconButton
// //               onClick={sendMessage}
// //               disabled={!chatMessage.trim()}
// //               color="primary"
// //             >
// //               <Send />
// //             </IconButton>
// //           </Box>
// //         </Drawer>
// //       )}
// //     </Box>
// //   );
// // };

// // export default VideoCall;








// import React, { useEffect, useRef, useState } from "react";

// const VideoCall = ({ session, user, onLeave, backendUrl }) => {
//   const localVideoRef = useRef(null);
//   const [remoteStreams, setRemoteStreams] = useState([]);
//   const wsRef = useRef(null);
//   const peerConnections = useRef({});
//   const localStream = useRef(null);

//   useEffect(() => {
//     // 1. Get local media
//     async function initMedia() {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       localStream.current = stream;
//       localVideoRef.current.srcObject = stream;

//       // 2. Connect to WebSocket signaling server
//       wsRef.current = new WebSocket(backendUrl.replace(/^http/, "ws"));
//       wsRef.current.onopen = () => {
//         wsRef.current.send(JSON.stringify({
//           type: "join",
//           roomId: session.id,
//           userId: user._id,
//         }));
//       };

//       wsRef.current.onmessage = async (msg) => {
//         const data = JSON.parse(msg.data);
//         switch (data.type) {
//           case "user-joined":
//             // Create offer for new peer
//             createPeerConnection(data.userId, true);
//             break;

//           case "offer":
//             await createPeerConnection(data.from, false, data);
//             break;

//           case "answer":
//             await peerConnections.current[data.from]?.setRemoteDescription(data.answer);
//             break;

//           case "candidate":
//             if (data.candidate) {
//               await peerConnections.current[data.from]?.addIceCandidate(data.candidate);
//             }
//             break;

//           case "user-left":
//             handleUserLeft(data.userId);
//             break;
//         }
//       };
//     }

//     initMedia();

//     return () => {
//       // cleanup
//       Object.values(peerConnections.current).forEach(pc => pc.close());
//       localStream.current?.getTracks().forEach(t => t.stop());
//       wsRef.current?.close();
//     };
//   }, []);

//   const createPeerConnection = async (peerId, isInitiator, offerData = null) => {
//     const pc = new RTCPeerConnection();
//     peerConnections.current[peerId] = pc;

//     // Send local tracks
//     localStream.current.getTracks().forEach(track => pc.addTrack(track, localStream.current));

//     // ✅ Fix duplicate remote video
//     pc.ontrack = (event) => {
//       setRemoteStreams(prev => {
//         const exists = prev.find(s => s.peerId === peerId);
//         if (exists) {
//           return prev.map(s => s.peerId === peerId ? { ...s, stream: event.streams[0] } : s);
//         }
//         return [...prev, { peerId, stream: event.streams[0] }];
//       });
//     };

//     // Send ICE candidates
//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         wsRef.current.send(JSON.stringify({
//           type: "candidate",
//           target: peerId,
//           candidate: event.candidate,
//         }));
//       }
//     };

//     if (isInitiator) {
//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);
//       wsRef.current.send(JSON.stringify({ type: "offer", target: peerId, offer }));
//     } else if (offerData) {
//       await pc.setRemoteDescription(offerData.offer);
//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);
//       wsRef.current.send(JSON.stringify({ type: "answer", target: peerId, answer }));
//     }
//   };

//   const handleUserLeft = (peerId) => {
//     peerConnections.current[peerId]?.close();
//     delete peerConnections.current[peerId];
//     setRemoteStreams(prev => prev.filter(s => s.peerId !== peerId));
//   };

//   return (
//     <div style={{ display: "flex" }}>
//       {/* Local video */}
//       <video ref={localVideoRef} autoPlay playsInline muted style={{ width: "200px" }} />
      
//       {/* Remote videos */}
//       {remoteStreams.map(({ peerId, stream }) => (
//         <video
//           key={peerId}
//           autoPlay
//           playsInline
//           style={{ width: "200px" }}
//           ref={video => video && (video.srcObject = stream)}
//         />
//       ))}
//     </div>
//   );
// };

// export default VideoCall;


import React, { useEffect, useRef, useState } from "react";
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

const VideoCall = ({ session, user, onLeave, backendUrl }) => {
  const localVideoRef = useRef(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const wsRef = useRef(null);
  const peerConnections = useRef({});
  const localStream = useRef(null);

  // UI state
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(session.chatMessages || []);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const chatEndRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const participants = [
    { id: user._id, name: user.name, isHost: session.tutorId === user._id },
    ...remoteStreams.map((s) => ({ id: s.peerId, name: s.peerId })),
  ];

  // --- WebRTC + WebSocket Signaling ---
  useEffect(() => {
    async function initMedia() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStream.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      wsRef.current = new WebSocket(backendUrl.replace(/^http/, "ws"));
      wsRef.current.onopen = () => {
        wsRef.current.send(
          JSON.stringify({
            type: "join",
            roomId: session.id,
            userId: user._id,
          })
        );
      };

      wsRef.current.onmessage = async (msg) => {
        const data = JSON.parse(msg.data);
        switch (data.type) {
          case "user-joined":
            createPeerConnection(data.userId, true);
            break;
          case "offer":
            await createPeerConnection(data.from, false, data);
            break;
          case "answer":
            await peerConnections.current[data.from]?.setRemoteDescription(
              data.answer
            );
            break;
          case "candidate":
            if (data.candidate) {
              await peerConnections.current[data.from]?.addIceCandidate(
                data.candidate
              );
            }
            break;
          case "user-left":
            handleUserLeft(data.userId);
            break;
        }
      };
    }
    initMedia();

    return () => {
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      localStream.current?.getTracks().forEach((t) => t.stop());
      wsRef.current?.close();
    };
  }, []);

  const createPeerConnection = async (peerId, isInitiator, offerData = null) => {
    const pc = new RTCPeerConnection();
    peerConnections.current[peerId] = pc;

    localStream.current.getTracks().forEach((track) =>
      pc.addTrack(track, localStream.current)
    );

    pc.ontrack = (event) => {
      setRemoteStreams((prev) => {
        const exists = prev.find((s) => s.peerId === peerId);
        if (exists) {
          return prev.map((s) =>
            s.peerId === peerId ? { ...s, stream: event.streams[0] } : s
          );
        }
        return [...prev, { peerId, stream: event.streams[0] }];
      });
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        wsRef.current.send(
          JSON.stringify({
            type: "candidate",
            target: peerId,
            candidate: event.candidate,
          })
        );
      }
    };

    if (isInitiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      wsRef.current.send(
        JSON.stringify({ type: "offer", target: peerId, offer })
      );
    } else if (offerData) {
      await pc.setRemoteDescription(offerData.offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      wsRef.current.send(
        JSON.stringify({ type: "answer", target: peerId, answer })
      );
    }
  };

  const handleUserLeft = (peerId) => {
    peerConnections.current[peerId]?.close();
    delete peerConnections.current[peerId];
    setRemoteStreams((prev) => prev.filter((s) => s.peerId !== peerId));
  };

  const handleEndCall = () => {
    Object.values(peerConnections.current).forEach((pc) => pc.close());
    peerConnections.current = {};
    localStream.current?.getTracks().forEach((t) => t.stop());
    wsRef.current?.close();
    onLeave();
  };

  // Chat + UI
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        userId: user._id,
        userName: user.name,
        message: chatMessage.trim(),
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, newMessage]);
      setChatMessage("");
    }
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

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const ChatBubble = ({ msg }) => {
    const isMine = msg.userId === user._id;
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
            bgcolor: isMine ? "#DCF8C6" : "white",
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
      {/* Header */}
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
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Local Video */}
          {isVideoOn ? (
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: remoteStreams.length ? "45%" : "100%",
                height: "auto",
                margin: "5px",
                objectFit: "cover",
              }}
            />
          ) : (
            <Box textAlign="center" color="white">
              <Avatar sx={{ width: 80, height: 80, margin: "auto" }}>
                {user.name.charAt(0)}
              </Avatar>
              <Typography mt={2}>Camera is off</Typography>
            </Box>
          )}

          {/* Remote Videos */}
          {remoteStreams.map(({ peerId, stream }) => (
            <video
              key={peerId}
              autoPlay
              playsInline
              style={{ width: "45%", height: "auto", margin: "5px" }}
              ref={(video) => video && (video.srcObject = stream)}
            />
          ))}

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
              onClick={() => {
                setIsAudioOn((p) => !p);
                localStream.current?.getAudioTracks().forEach(
                  (track) => (track.enabled = !isAudioOn)
                );
              }}
              sx={{ color: isAudioOn ? "white" : "error.main" }}
            >
              {isAudioOn ? <Mic /> : <MicOff />}
            </IconButton>

            <IconButton
              onClick={() => {
                setIsVideoOn((p) => !p);
                localStream.current?.getVideoTracks().forEach(
                  (track) => (track.enabled = !isVideoOn)
                );
              }}
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
            sx: {
              height: "60%",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
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
