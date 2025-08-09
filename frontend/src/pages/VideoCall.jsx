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

const VideoCall = ({ session, user, onLeave, backendUrl }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(session.chatMessages || []);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);
  const theme = useTheme();

  const participants = [
    { id: user.id, name: user.name, isHost: session.tutorId === user.id },
  ];

  // 1️⃣ Start WebSocket connection
  useEffect(() => {
    socketRef.current = new WebSocket(`${backendUrl}/ws/session/${session.id}`);

    socketRef.current.onopen = () => {
      console.log("Connected to chat WebSocket");
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chat") {
          setChatMessages((prev) => [...prev, data.message]);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message", err);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socketRef.current?.close();
    };
  }, [session.id, backendUrl]);

  // 2️⃣ Get media stream
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
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream && isVideoOn) {
      videoRef.current.srcObject = stream;
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

  // 3️⃣ Send chat message to backend
  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        message: chatMessage.trim(),
        timestamp: new Date().toISOString(),
      };

      socketRef.current?.send(
        JSON.stringify({ type: "chat", sessionId: session.id, message: newMessage })
      );

      setChatMessage("");
    }
  };

  const handleEndCall = () => {
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    socketRef.current?.close();
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

  return (
    <Box sx={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
      {!isFullscreen && (
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center" sx={{ bgcolor: "grey.100" }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box width={10} height={10} borderRadius="50%" bgcolor="error.main" />
            <Typography variant="h6" color="text.primary">
              LIVE - {session.title}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} color="text.secondary">
            <People />
            <Typography>{participants.length}</Typography>
            <IconButton onClick={toggleFullscreen} color="inherit">
              <Fullscreen />
            </IconButton>
          </Box>
        </Box>
      )}

      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Video Section */}
        <Box flex={1} sx={{ position: "relative", backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
          {isVideoOn && stream ? (
            <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Box textAlign="center" color="white">
              <Avatar sx={{ width: 80, height: 80, margin: "auto" }}>{user.name.charAt(0)}</Avatar>
              <Typography mt={2}>Camera is off</Typography>
            </Box>
          )}

          <Stack direction="row" spacing={2} position="absolute" bottom={16} left="50%" sx={{ transform: "translateX(-50%)", bgcolor: "rgba(255,255,255,0.2)", borderRadius: 4, p: 1 }}>
            <IconButton onClick={() => setIsAudioOn((prev) => !prev)} color={isAudioOn ? "primary" : "error"}>
              {isAudioOn ? <Mic /> : <MicOff />}
            </IconButton>
            <IconButton onClick={() => setIsVideoOn((prev) => !prev)} color={isVideoOn ? "primary" : "error"}>
              {isVideoOn ? <Videocam /> : <VideocamOff />}
            </IconButton>
            <IconButton onClick={() => setShowChat((prev) => !prev)} color={showChat ? "primary" : "default"}>
              <Chat />
            </IconButton>
            <IconButton color="default">
              <Settings />
            </IconButton>
            <IconButton onClick={handleEndCall} color="error">
              <CallEnd />
            </IconButton>
            {isFullscreen && (
              <IconButton onClick={toggleFullscreen} color="default">
                <FullscreenExit />
              </IconButton>
            )}
          </Stack>
        </Box>

        {/* Chat Section */}
        {showChat && (
          <Box width={320} sx={{ bgcolor: "#f9f9f9", display: "flex", flexDirection: "column", borderLeft: `1px solid ${theme.palette.divider}` }}>
            <Box p={2} borderBottom={`1px solid ${theme.palette.divider}`}>
              <Typography variant="subtitle1" color="text.primary">
                Session Chat
              </Typography>
            </Box>
            <Box flex={1} p={2} overflow="auto">
              {chatMessages.map((msg) => (
                <Box key={msg.id} mb={2}>
                  <Typography variant="subtitle2" color="text.primary">{msg.userName}</Typography>
                  <Typography variant="body2" color="text.secondary">{msg.message}</Typography>
                  <Typography variant="caption" color="text.disabled">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Typography>
                </Box>
              ))}
              <div ref={chatEndRef} />
            </Box>
            <Divider />
            <Box p={2} display="flex" gap={1}>
              <TextField fullWidth size="small" placeholder="Type a message..." variant="outlined" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
              <IconButton onClick={sendMessage} disabled={!chatMessage.trim()} color="primary">
                <Send />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default VideoCall;
