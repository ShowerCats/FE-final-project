import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog'; // Import Dialog
import DialogActions from '@mui/material/DialogActions'; // Import DialogActions
import DialogContent from '@mui/material/DialogContent'; // Import DialogContent
import DialogContentText from '@mui/material/DialogContentText'; // Optional: for text inside content
import DialogTitle from '@mui/material/DialogTitle'; // Import DialogTitle
import TextField from '@mui/material/TextField'; // Import TextField for reply input

// --- Mock Data (Keep as is) ---
const initialNotifications = [
  {
    id: 1,
    sender: 'Prof. Smith',
    message: 'Your grade for the Midterm Exam has been updated.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: 'grade_update',
    read: false,
  },
  {
    id: 2,
    sender: 'Admin Office',
    message: 'Reminder: Course registration deadline is approaching.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    type: 'announcement',
    read: false,
  },
  {
    id: 3,
    sender: 'Prof. Davis',
    message: 'Assignment 3 feedback is available. Check your grades.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    type: 'grade_update',
    read: true,
  },
  {
    id: 4,
    sender: 'Teaching Assistant',
    message: 'Office hours cancelled for this Wednesday.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: 'info',
    read: false,
  },
];
// --- End Mock Data ---

export default function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false); // State for dialog visibility
  const [replyingToNotification, setReplyingToNotification] = useState(null); // State to hold the notification being replied to
  const [replyMessage, setReplyMessage] = useState(''); // State for the reply message input

  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications'));
    if (storedNotifications && storedNotifications.length > 0) {
      setNotifications(storedNotifications);
    } else {
      setNotifications(initialNotifications);
      // localStorage.setItem('notifications', JSON.stringify(initialNotifications));
    }
  }, []);

  // --- Reply Dialog Handlers ---
  const handleReplyClick = (notification) => {
    setReplyingToNotification(notification); // Store the notification object
    setIsReplyDialogOpen(true); // Open the dialog
    setReplyMessage(''); // Clear previous reply message
  };

  const handleCloseReplyDialog = () => {
    setIsReplyDialogOpen(false); // Close the dialog
    setReplyingToNotification(null); // Clear the notification being replied to
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
        alert("Reply message cannot be empty.");
        return;
    }
    // --- Placeholder for actual send logic ---
    // In a real app, you would:
    // 1. Get the current user's ID/name.
    // 2. Send the replyMessage to the backend API, associating it with:
    //    - The original notification ID (replyingToNotification.id)
    //    - The original sender (replyingToNotification.sender) as the recipient
    //    - The current user as the sender of the reply
    console.log(`Sending reply to: ${replyingToNotification?.sender}`);
    console.log(`Original Notification ID: ${replyingToNotification?.id}`);
    console.log(`Reply Message: ${replyMessage}`);
    alert(`Reply to ${replyingToNotification?.sender} sent (simulated):\n"${replyMessage}"`);
    // --- End Placeholder ---

    handleCloseReplyDialog(); // Close the dialog after sending
  };
  // --- End Reply Dialog Handlers ---


  const handleMarkAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
    // Persist the change to local storage
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    console.log(`Marked notification ${notificationId} as read.`);
  };


  return (
    <Box sx={{ width: '100%', maxWidth: 800, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Notifications
      </Typography>

      {notifications.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          You have no new notifications.
        </Typography>
      ) : (
        <Stack spacing={2} divider={<Divider flexItem />}>
          {notifications.map((notification) => (
            <Paper
              key={notification.id}
              elevation={notification.read ? 1 : 3}
              sx={{
                padding: 2,
                opacity: notification.read ? 0.7 : 1,
                transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                From: {notification.sender} - {new Date(notification.timestamp).toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ my: 1 }}>
                {notification.message}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {notification.type === 'grade_update' && (
                  <Link to="/grades" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" size="small" color="primary">
                      View Grades
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={() => handleReplyClick(notification)} // Pass the notification object
                >
                  Reply
                </Button>
                 {!notification.read && (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleMarkAsRead(notification.id)}
                    >
                        Mark as Read
                    </Button>
                 )}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      {/* --- Reply Dialog --- */}
      <Dialog open={isReplyDialogOpen} onClose={handleCloseReplyDialog} fullWidth maxWidth="sm">
        <DialogTitle>Reply to {replyingToNotification?.sender || 'Sender'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Original message: "{replyingToNotification?.message}"
          </DialogContentText>
          <TextField
            autoFocus // Focus the input field when the dialog opens
            margin="dense"
            id="reply-message"
            label="Your Reply"
            type="text"
            fullWidth
            variant="outlined"
            multiline // Allow multiple lines
            rows={4} // Start with 4 rows high
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)} // Update state on change
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReplyDialog} color="primary">Cancel</Button>
          <Button onClick={handleSendReply} color="primary" variant="contained">Send Reply</Button>
        </DialogActions>
      </Dialog>
      {/* --- End Reply Dialog --- */}

    </Box>
  );
}
