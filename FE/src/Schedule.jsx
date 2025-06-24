import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import calendar styles

import { useLoading } from './contexts/LoadingContext.jsx';
import { firestore as db } from './Firebase/config.js';
import { collection, getDocs, query, orderBy, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

export default function Schedule() {
  const { isLoadingGlobal, setIsLoadingGlobal } = useLoading();
  const [events, setEvents] = useState([]); // Renamed from schedule to events
  const [error, setError] = useState(null);
  const [localLoading, setLocalLoading] = useState(false); // For form submissions/deletions

  // State for Add/Edit Event Dialog
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({ // Holds data for add/edit form
    id: null, // Firestore document ID
    title: '',
    start: '', // ISO string for date/time
    end: '',   // ISO string for date/time
    type: 'class', // Default type
    description: ''
  });

  // State for Delete Confirmation Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoadingGlobal(true);
    setError(null);
    try {
      // Fetch events from the 'calendarEvents' collection
      const eventsQuery = query(collection(db, "calendarEvents"), orderBy("start", "desc")); // Order by start time
      const querySnapshot = await getDocs(eventsQuery);
      const eventsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          // Convert Firestore timestamp/ISO string to Date objects for react-big-calendar
          start: data.start ? new Date(data.start) : new Date(),
          end: data.end ? new Date(data.end) : new Date(),
          type: data.type || 'class',
          description: data.description || ''
        };
      });
      setEvents(eventsData);
    } catch (err) {
      console.error("Error fetching events from Firestore:", err);
      setError("Failed to load schedule. Please try again later.");
    } finally {
      setIsLoadingGlobal(false);
    }
  }, [setIsLoadingGlobal]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers for Add/Edit Event Dialog
  const handleOpenAddDialog = useCallback((slotInfo = {}) => {
    setIsEditing(false);
    // Pre-fill start/end if a slot was selected on the calendar
    setCurrentEvent({
      id: null,
      title: '',
      start: slotInfo.start ? moment(slotInfo.start).format('YYYY-MM-DDTHH:mm') : moment().format('YYYY-MM-DDTHH:mm'),
      end: slotInfo.end ? moment(slotInfo.end).format('YYYY-MM-DDTHH:mm') : moment().add(1, 'hour').format('YYYY-MM-DDTHH:mm'),
      type: 'class',
      description: ''
    });
    setOpenFormDialog(true);
  }, []);

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    setError(null); // Clear any form-specific errors
  };

  const handleOpenEditDialog = useCallback((event) => {
    setIsEditing(true);
    setCurrentEvent({
      id: event.id,
      title: event.title,
      start: moment(event.start).format('YYYY-MM-DDTHH:mm'),
      end: moment(event.end).format('YYYY-MM-DDTHH:mm'),
      type: event.type,
      description: event.description
    });
    setOpenFormDialog(true);
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setCurrentEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    if (!currentEvent.title || !currentEvent.start || !currentEvent.end || !currentEvent.type) {
      setError("Title, Start Time, End Time, and Type are required.");
      return;
    }
    setLocalLoading(true);
    setError(null);
    try {
      const eventData = {
        title: currentEvent.title,
        start: currentEvent.start, // Store as ISO string
        end: currentEvent.end,     // Store as ISO string
        type: currentEvent.type,
        description: currentEvent.description
      };

      if (isEditing && currentEvent.id) {
        const eventRef = doc(db, "calendarEvents", currentEvent.id);
        await updateDoc(eventRef, eventData);
      } else {
        await addDoc(collection(db, "calendarEvents"), eventData);
      }
      handleCloseFormDialog();
      fetchData(); // Refetch data to show changes
    } catch (err) {
      console.error("Error saving event:", err);
      setError(`Failed to ${isEditing ? 'update' : 'add'} event. Please try again.`);
    } finally {
      setLocalLoading(false);
    }
  };

  // Handlers for Delete Event Dialog
  const handleOpenDeleteDialog = (event) => {
    setEventToDelete(event);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setEventToDelete(null);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    setLocalLoading(true);
    try {
      await deleteDoc(doc(db, "calendarEvents", eventToDelete.id));
      handleCloseDeleteDialog();
      fetchData(); // Refetch data after deletion
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete event. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  // Calendar event styling
  const eventPropGetter = useCallback((event) => {
    let backgroundColor = '';
    switch (event.type) {
      case 'class':
        backgroundColor = '#3f51b5'; // Primary blue
        break;
      case 'test':
        backgroundColor = '#f44336'; // Red
        break;
      default:
        backgroundColor = '#9e9e9e'; // Grey
    }
    return { style: { backgroundColor } };
  }, []);

  if (isLoadingGlobal) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          My Schedule
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenAddDialog()} // Call without slotInfo for manual add
          >Add New Event</Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ height: '70vh', minHeight: 500 }}> {/* Set a height for the calendar */}
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            selectable // Allows selecting time slots
            onSelectSlot={handleOpenAddDialog} // Open add dialog when a slot is selected
            onSelectEvent={handleOpenEditDialog} // Open edit dialog when an event is clicked
            eventPropGetter={eventPropGetter} // Apply custom styles based on event type
            views={['month', 'week', 'day', 'agenda']} // Available views
            defaultView="month"
            // Optional: Customize toolbar or messages
            // components={{ toolbar: CustomToolbar }}
            // messages={{ next: 'Next', previous: 'Back', today: 'Today', month: 'Month', week: 'Week', day: 'Day', agenda: 'Agenda' }}
          />
        </Box>
      </Paper>

      {/* Add/Edit Event Dialog */}
      <Dialog open={openFormDialog} onClose={handleCloseFormDialog}>
        <DialogTitle>{isEditing ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Event Title"
            type="text"
            fullWidth
            variant="outlined"
            value={currentEvent.title}
            onChange={handleFormChange}
            required
          />
          <TextField
            margin="dense"
            name="start"
            label="Start Time"
            type="datetime-local"
            fullWidth
            variant="outlined"
            value={currentEvent.start}
            onChange={handleFormChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            margin="dense"
            name="end"
            label="End Time"
            type="datetime-local"
            fullWidth
            variant="outlined"
            value={currentEvent.end}
            onChange={handleFormChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="event-type-label">Event Type</InputLabel>
            <Select
              labelId="event-type-label"
              name="type"
              value={currentEvent.type}
              label="Event Type"
              onChange={handleFormChange}
            >
              <MenuItem value="class">Class</MenuItem>
              <MenuItem value="test">Test</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="description"
            label="Description (Optional)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={currentEvent.description}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFormDialog} disabled={localLoading}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained" disabled={localLoading}>
            {localLoading ? <CircularProgress size={24} /> : (isEditing ? 'Save Changes' : 'Add Event')}
          </Button>
          {isEditing && (
            <IconButton color="error" onClick={() => {
              handleCloseFormDialog(); // Close edit dialog
              handleOpenDeleteDialog(currentEvent); // Open delete confirmation
            }} disabled={localLoading}>
              <DeleteIcon />
            </IconButton>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the event "{eventToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={localLoading}>Cancel</Button>
          <Button onClick={handleDeleteEvent} color="error" autoFocus disabled={localLoading}>
            {localLoading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
