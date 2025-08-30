import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Divider,
  IconButton,
  Paper,
  Drawer,
  useTheme,
} from "@mui/material";
import { Send } from "@mui/icons-material";

const ChatBox = ({
  chatMessages,
  chatMessage,
  setChatMessage,
  sendMessage,
  showChat,
  setShowChat,
  isMobile,
  user,
}) => {
  const chatEndRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

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

  const ChatContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // keeps messages + input aligned
      }}
    >
      {/* Header */}
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

      {/* Messages */}
      <Box flex={1} p={2} sx={{ overflowY: "auto" }}>
        {chatMessages.map((msg) => (
          <ChatBubble key={msg.id} msg={msg} />
        ))}
        <div ref={chatEndRef} />
      </Box>

      {/* Input */}
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
    </Box>
  );

  if (isMobile) {
    return (
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
        {ChatContent}
      </Drawer>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        width: 340,
        flexShrink: 0, // 🔑 prevents it from stretching or squishing
        display: "flex",
        flexDirection: "column",
        borderLeft: `1px solid ${theme.palette.divider}`,
        bgcolor: "grey.50",
      }}
    >
      {ChatContent}
    </Paper>
  );
};


export default ChatBox;
