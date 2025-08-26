// import React, { useEffect, useRef, useState } from "react";
// import {
//   IconButton,
//   Box,
//   Typography,
//   Avatar,
//   useTheme,
//   Stack,
//   Paper,
// } from "@mui/material";
// import {
//   Videocam,
//   VideocamOff,
//   Mic,
//   MicOff,
//   CallEnd,
//   Chat,
//   People,
//   Settings,
//   Fullscreen,
//   FullscreenExit,
// } from "@mui/icons-material";
// import { useMediaQuery } from "@mui/material";
// import ChatBox from "./ChatBox";


// const RemoteVideo = ({ stream }) => {
//   const videoRef = React.useRef(null);

//   React.useEffect(() => {
//     if (videoRef.current) {
//       videoRef.current.srcObject = stream;
//     }
//   }, [stream]);

//   return (
//     <video
//       ref={videoRef}
//       autoPlay
//       playsInline
//       style={{ width: "45%", height: "auto", margin: "5px" }}
//     />
//   );
// };


// const VideoCall = ({ session, user, onLeave, backendUrl }) => {
//   const localVideoRef = useRef(null);
//   const [remoteStreams, setRemoteStreams] = useState([]);
//   const wsRef = useRef(null);
//   const peerConnections = useRef({});
//   const localStream = useRef(null);

//   // UI state
//   const [isVideoOn, setIsVideoOn] = useState(true);
//   const [isAudioOn, setIsAudioOn] = useState(true);
//   const [showChat, setShowChat] = useState(false);
//   const [chatMessage, setChatMessage] = useState("");
//   const [chatMessages, setChatMessages] = useState(session.chatMessages || []);
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const participants = [
//     { id: user._id, name: user.name, isHost: session.tutorId === user._id },
//     ...remoteStreams.map((s) => ({ id: s.peerId, name: s.peerId })),
//   ];

//   // --- WebRTC + WebSocket Signaling ---
//   useEffect(() => {
//     async function initMedia() {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       localStream.current = stream;
//       if (localVideoRef.current) localVideoRef.current.srcObject = stream;

//       wsRef.current = new WebSocket(backendUrl.replace(/^http/, "ws"));
//       wsRef.current.onopen = () => {
//         wsRef.current.send(
//           JSON.stringify({
//             type: "join",
//             roomId: session.id,
//             userId: user._id,
//           })
//         );
//       };

//       wsRef.current.onmessage = async (msg) => {
//         const data = JSON.parse(msg.data);
//         switch (data.type) {
//           case "user-joined":
//             createPeerConnection(data.userId, true);
//             break;
//           case "offer":
//             await createPeerConnection(data.from, false, data);
//             break;
//           case "answer":
//             await peerConnections.current[data.from]?.setRemoteDescription(
//               data.answer
//             );
//             break;
//           case "candidate":
//             if (data.candidate) {
//               await peerConnections.current[data.from]?.addIceCandidate(
//                 data.candidate
//               );
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
//       Object.values(peerConnections.current).forEach((pc) => pc.close());
//       localStream.current?.getTracks().forEach((t) => t.stop());
//       wsRef.current?.close();
//     };
//   }, []);

//   const createPeerConnection = async (peerId, isInitiator, offerData = null) => {
//     const pc = new RTCPeerConnection();
//     peerConnections.current[peerId] = pc;

//     localStream.current.getTracks().forEach((track) =>
//       pc.addTrack(track, localStream.current)
//     );

//     pc.ontrack = (event) => {
//       setRemoteStreams((prev) => {
//         const exists = prev.find((s) => s.peerId === peerId);
//         if (exists) {
//           return prev.map((s) =>
//             s.peerId === peerId ? { ...s, stream: event.streams[0] } : s
//           );
//         }
//         return [...prev, { peerId, stream: event.streams[0] }];
//       });
//     };

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         wsRef.current.send(
//           JSON.stringify({
//             type: "candidate",
//             target: peerId,
//             candidate: event.candidate,
//           })
//         );
//       }
//     };

//     if (isInitiator) {
//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);
//       wsRef.current.send(
//         JSON.stringify({ type: "offer", target: peerId, offer })
//       );
//     } else if (offerData) {
//       await pc.setRemoteDescription(offerData.offer);
//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);
//       wsRef.current.send(
//         JSON.stringify({ type: "answer", target: peerId, answer })
//       );
//     }
//   };

//   const handleUserLeft = (peerId) => {
//     peerConnections.current[peerId]?.close();
//     delete peerConnections.current[peerId];
//     setRemoteStreams((prev) => prev.filter((s) => s.peerId !== peerId));
//   };

//   const handleEndCall = () => {
//     Object.values(peerConnections.current).forEach((pc) => pc.close());
//     peerConnections.current = {};
//     localStream.current?.getTracks().forEach((t) => t.stop());
//     wsRef.current?.close();
//     onLeave();
//   };

//   const sendMessage = () => {
//     if (chatMessage.trim()) {
//       const newMessage = {
//         id: Date.now().toString(),
//         userId: user._id,
//         userName: user.name,
//         message: chatMessage.trim(),
//         timestamp: new Date(),
//       };
//       setChatMessages((prev) => [...prev, newMessage]);
//       setChatMessage("");
//     }
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
//       {/* Header */}
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
//             <Box width={10} height={10} borderRadius="50%" bgcolor="error.main" />
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
//             flexWrap: "wrap",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           {/* Local Video */}
//           {isVideoOn ? (
//             <video
//               ref={localVideoRef}
//               autoPlay
//               muted
//               playsInline
//               style={{
//                 width: remoteStreams.length ? "45%" : "100%",
//                 height: "auto",
//                 margin: "5px",
//                 objectFit: "cover",
//               }}
//             />
//           ) : (
//             <Box textAlign="center" color="white">
//               <Avatar sx={{ width: 80, height: 80, margin: "auto" }}>
//                 {user.name.charAt(0)}
//               </Avatar>
//               <Typography mt={2}>Camera is off</Typography>
//             </Box>
//           )}

//           {/* Remote Videos
//           {remoteStreams.map(({ peerId, stream }) => (
//             <video
//               key={peerId}
//               autoPlay
//               playsInline
//               style={{ width: "45%", height: "auto", margin: "5px" }}
//               ref={(video) => video && (video.srcObject = stream)}
//             />
//           ))} */}

//           {remoteStreams.map(({ peerId, stream }) => (
//           <RemoteVideo key={peerId} stream={stream} />
//           ))}


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
//               onClick={() => {
//                 setIsAudioOn((prev) => {
//                   localStream.current?.getAudioTracks().forEach(
//                     (track) => (track.enabled = !prev)
//                   );
//                   return !prev;
//                 });
//               }}
//               sx={{ color: isAudioOn ? "white" : "error.main" }}
//             >
//               {isAudioOn ? <Mic /> : <MicOff />}
//             </IconButton>

//             <IconButton
//               onClick={() => {
//                 setIsVideoOn((prev) => {
//                   localStream.current?.getVideoTracks().forEach(
//                     (track) => (track.enabled = !prev)
//                   );
//                   return !prev;
//                 });
//               }}
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

//         {/* Only show ChatBox when toggled */}
//       {showChat && (
//         <ChatBox
//           chatMessages={chatMessages}
//           chatMessage={chatMessage}
//           setChatMessage={setChatMessage}
//           sendMessage={sendMessage}
//           showChat={showChat}
//           setShowChat={setShowChat}
//           isMobile={isMobile}
//           user={user}
//           sx={{ height: "100%" }}   // 🔑 ensures full-height next to video
//         />
//       )}

//       </Box>
//     </Box>
//   );
// };

// export default VideoCall;

import React, { useEffect, useRef, useState } from "react";
import {
  IconButton,
  Box,
  Typography,
  Avatar,
  useTheme,
  Stack,
  Paper,
} from "@mui/material";
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  CallEnd,
  Chat,
  People,
  Settings,
  Fullscreen,
  FullscreenExit,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import ChatBox from "./ChatBox";

const RemoteVideo = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      style={{ width: "45%", height: "auto", margin: "5px", objectFit: "cover" }}
    />
  );
};

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const participants = [
    { id: user._id, name: user.name, isHost: session.tutorId === user._id },
    ...remoteStreams.map((s) => ({ id: s.peerId, name: s.peerId })),
  ];

  // --- Init Media + Signaling ---
  useEffect(() => {
    async function initMedia() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

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

  // 🔑 Re-bind local video when toggling
  useEffect(() => {
    if (localVideoRef.current) {
      if (isVideoOn) {
        localVideoRef.current.srcObject = localStream.current;
      } else {
        localVideoRef.current.srcObject = null;
      }
    }
  }, [isVideoOn]);

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

    setRemoteStreams((prev) => {
      const leavingUser = prev.find((s) => s.peerId === peerId);
      if (leavingUser?.stream) {
        leavingUser.stream.getTracks().forEach((t) => t.stop()); // cleanup tracks
      }
      return prev.filter((s) => s.peerId !== peerId);
    });
  };

  const handleEndCall = () => {
    Object.values(peerConnections.current).forEach((pc) => pc.close());
    peerConnections.current = {};

    localStream.current?.getTracks().forEach((t) => t.stop());
    if (localVideoRef.current) localVideoRef.current.srcObject = null;

    setRemoteStreams([]); // clear remotes
    wsRef.current?.close();
    onLeave();
  };

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
            <RemoteVideo key={peerId} stream={stream} />
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
                setIsAudioOn((prev) => {
                  localStream.current?.getAudioTracks().forEach(
                    (track) => (track.enabled = !prev)
                  );
                  return !prev;
                });
              }}
              sx={{ color: isAudioOn ? "white" : "error.main" }}
            >
              {isAudioOn ? <Mic /> : <MicOff />}
            </IconButton>

            <IconButton
              onClick={() => {
                setIsVideoOn((prev) => {
                  localStream.current?.getVideoTracks().forEach(
                    (track) => (track.enabled = !prev)
                  );
                  return !prev;
                });
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

        {/* ChatBox */}
        {showChat && (
          <ChatBox
            chatMessages={chatMessages}
            chatMessage={chatMessage}
            setChatMessage={setChatMessage}
            sendMessage={sendMessage}
            showChat={showChat}
            setShowChat={setShowChat}
            isMobile={isMobile}
            user={user}
            sx={{ height: "100%" }}
          />
        )}
      </Box>
    </Box>
  );
};

export default VideoCall;

