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
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// Firestore imports
import { useLoading } from './contexts/LoadingContext.jsx';
import { firestore as db } from './Firebase/config.js';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, orderBy, query as firestoreQuery } from "firebase/firestore";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyingToNotification, setReplyingToNotification] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const { isLoadingGlobal, setIsLoadingGlobal } = useLoading();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoadingGlobal(true);
      setError(null);
      try {
        const notificationsCollectionRef = collection(db, "notifications");
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
  }, [setIsLoadingGlobal]);

  const handleReplyClick = (notification) => {
    setReplyingToNotification(notification);
    setIsReplyDialogOpen(true);
    setReplyMessage('');
    setError(null); // Clear previous errors when opening dialog
  };

  const handleCloseReplyDialog = () => {
    setIsReplyDialogOpen(false);
    setReplyingToNotification(null);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      setError("Reply message cannot be empty.");
      return;
    }
    setIsActionLoading(true);
    setError(null);

    try {
      // This creates a new notification, as if the portal user is replying.
      const newNotification = {
        sender: 'Student Portal User', // Placeholder for the current user
        message: `Reply to "${replyingToNotification.sender}": ${replyMessage}`,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'message',
      };

      await addDoc(collection(db, "notifications"), newNotification);
      handleCloseReplyDialog();
    } catch (err) {
      console.error("Error sending reply:", err);
      setError("Failed to send reply. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    const originalNotifications = [...notifications];
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );

    try {
      const notificationDocRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationDocRef, { read: true });
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setError("Failed to update notification. Please try again.");
      setNotifications(originalNotifications);
    }
  };

  const handleOpenDeleteDialog = (notification) => {
    setNotificationToDelete(notification);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setNotificationToDelete(null);
  };

  const handleDeleteNotification = async () => {
    if (!notificationToDelete) return;

    setIsActionLoading(true);
    setError(null);
    const originalNotifications = [...notifications];

    // Optimistic UI update
    setNotifications(prev => prev.filter(n => n.id !== notificationToDelete.id));

    try {
      await deleteDoc(doc(db, "notifications", notificationToDelete.id));
      handleCloseDeleteDialog();
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError("Failed to delete notification. Please try again.");
      setNotifications(originalNotifications); // Revert on failure
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoadingGlobal) return null;

  return (
    <Box sx={{ width: '100%', maxWidth: 800, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Notifications
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {notifications.length === 0 && !isLoadingGlobal ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          You have no notifications.
        </Typography>
      ) : (
        <Stack spacing={2} divider={<Divider flexItem />}>
          {notifications.map((notification) => (
            <Paper
              key={notification.id}
              elevation={notification.read ? 1 : 3}
              sx={{
                padding: 2,
                backgroundColor: notification.read ? 'grey.100' : 'background.paper',
                opacity: notification.read ? 0.8 : 1,
                transition: 'opacity 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                From: {notification.sender} - {new Date(notification.timestamp).toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ my: 1 }}>
                {notification.message}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {notification.type === 'grade_update' && notification.gradeId && (
                  <Link to={`/grades?highlight=${notification.gradeId}`} style={{ textDecoration: 'none' }}>
                    <Button variant="contained" size="small" color="primary">
                      View Grade
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
                <IconButton
                  aria-label="delete"
                  color="error"
                  sx={{ marginLeft: 'auto' }}
                  onClick={() => handleOpenDeleteDialog(notification)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      <Dialog open={isReplyDialogOpen} onClose={handleCloseReplyDialog} fullWidth maxWidth="sm">
        <DialogTitle>Reply to {replyingToNotification?.sender || 'Sender'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Original message: "{replyingToNotification?.message}"
          </DialogContentText>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
            disabled={isActionLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReplyDialog} disabled={isActionLoading}>Cancel</Button>
          <Button onClick={handleSendReply} color="primary" variant="contained" disabled={isActionLoading}>
            {isActionLoading ? <CircularProgress size={24} /> : "Send Reply"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this notification? This action cannot be undone.
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
              "{notificationToDelete?.message}"
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={isActionLoading}>Cancel</Button>
          <Button onClick={handleDeleteNotification} color="error" autoFocus disabled={isActionLoading}>
            {isActionLoading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
