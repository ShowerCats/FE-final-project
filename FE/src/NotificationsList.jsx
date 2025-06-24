// c:\Users\Ori\Downloads\FE Project\FE-final-project\FE\src\NotificationsList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

// Firestore imports
import { useLoading } from './contexts/LoadingContext.jsx'; // Import useLoading
import { firestore as db } from './Firebase/config.js';
import { collection, getDocs, doc, updateDoc, orderBy, query as firestoreQuery } from "firebase/firestore";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyingToNotification, setReplyingToNotification] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const { isLoadingGlobal, setIsLoadingGlobal } = useLoading(); // Use global loading
  const [error, setError] = useState(null); // For page-specific errors

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoadingGlobal(true);
      setError(null);
      try {
        const notificationsCollectionRef = collection(db, "notifications");
        // Optionally, order by timestamp descending
        const q = firestoreQuery(notificationsCollectionRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const notificationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(notificationsData);
      } catch (err) {
        console.error("Error fetching notifications from Firestore:", err);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setIsLoadingGlobal(false);
      }
    };

    fetchNotifications();
  }, [setIsLoadingGlobal]); // Add setIsLoadingGlobal to dependency array

  // --- Reply Dialog Handlers ---
  const handleReplyClick = (notification) => {
    setReplyingToNotification(notification);
    setIsReplyDialogOpen(true);
    setReplyMessage('');
  };

  const handleCloseReplyDialog = () => {
    setIsReplyDialogOpen(false);
    setReplyingToNotification(null);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
        alert("Reply message cannot be empty.");
        return;
    }
    console.log(`Sending reply to: ${replyingToNotification?.sender}`);
    console.log(`Original Notification ID: ${replyingToNotification?.id}`);
    console.log(`Reply Message: ${replyMessage}`);
    alert(`Reply to ${replyingToNotification?.sender} sent (simulated):\n"${replyMessage}"`);
    // --- End Placeholder ---

    handleCloseReplyDialog();
  };
  // --- End Reply Dialog Handlers ---


  const handleMarkAsRead = async (notificationId) => {
    try {
      const notificationDocRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationDocRef, {
        read: true
      });
      // Update local state to reflect the change immediately
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      console.log(`Marked notification ${notificationId} as read in Firestore.`);
    } catch (err) {
      console.error("Error marking notification as read:", err);
      alert("Failed to mark notification as read. Please try again.");
    }
  };

  // If global loading is active, LoadingScreen will be shown by App.jsx
  if (isLoadingGlobal) return null;

  return (
    <Box sx={{ width: '100%', maxWidth: 800, margin: 'auto', padding: 3 }}>
      {error && !isLoadingGlobal && notifications.length === 0 && ( // Show error if loading failed and no data
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4, color: 'red' }}>
          <Typography>{error}</Typography>
        </Box>
      )}
      {!isLoadingGlobal && ( // Render content if not globally loading
        <>
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
                      onClick={() => handleReplyClick(notification)}
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
        </>
      )}

      {/* --- Reply Dialog --- */}
      <Dialog open={isReplyDialogOpen} onClose={handleCloseReplyDialog} fullWidth maxWidth="sm">
        <DialogTitle>Reply to {replyingToNotification?.sender || 'Sender'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Original message: "{replyingToNotification?.message}"
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reply-message"
            label="Your Reply"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
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
