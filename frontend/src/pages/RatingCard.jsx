import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Rating,
  Box,
  Avatar,
  useTheme,
} from "@mui/material";

const RatingCard = ({ open, onSubmit, tutor }) => {
  const [value, setValue] = useState(0);
  const theme = useTheme();

  const handleSubmit = () => {
    if (value > 0) {
      onSubmit(value);
    }
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          bgcolor: theme.palette.grey[900],
          color: "white",
          borderRadius: 3,
          p: 2,
        },
      }}
      disableEscapeKeyDown
    >
      <DialogTitle
        sx={{ textAlign: "center", fontWeight: "bold", color: "white" }}
      >
        Rate Your Tutor
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center" }}>
        <Avatar
          src={tutor?.avatarUrl}
          sx={{
            width: 80,
            height: 80,
            margin: "0 auto",
            bgcolor: theme.palette.primary.main,
            fontSize: 28,
          }}
        >
          {tutor?.name?.charAt(0)}
        </Avatar>
        <Typography variant="h6" mt={2} gutterBottom>
          {tutor?.name}
        </Typography>
        <Typography variant="body2" color="grey.400" gutterBottom>
          Please rate your learning experience with this tutor
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Rating
            name="tutor-rating"
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            precision={0.5}
            size="large"
            sx={{
              "& .MuiRating-iconEmpty": { color: "grey.600" },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={value === 0}
          sx={{
            px: 4,
            py: 1,
            borderRadius: 2,
            fontWeight: "bold",
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RatingCard;
