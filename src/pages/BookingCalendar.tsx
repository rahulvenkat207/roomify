import React, { useState } from 'react';
import { Container, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem } from '@mui/material';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { useBooking } from '../context/BookingContext';
import { Booking } from '../types';

interface BookingEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  roomId: string;
  roomName: string;
  userId: string;
}

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const BookingCalendar = () => {
  const { rooms, bookings, bookRoom, cancelBooking, isRoomAvailable } = useBooking();
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [bookingTitle, setBookingTitle] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handleSelect = ({ start, end }: { start: Date; end: Date }) => {
    setStartDate(start);
    setEndDate(end);
    setOpenDialog(true);
  };

  const handleEventSelect = (event: BookingEvent) => {
    setSelectedEvent(event);
  };

  const handleCreateBooking = () => {
    if (selectedRoom && bookingTitle) {
      const room = rooms.find(r => r.id.toString() === selectedRoom);
      if (room && isRoomAvailable(selectedRoom, startDate, endDate)) {
        bookRoom({
          roomId: selectedRoom,
          requesterId: 'user1', // In a real app, this would come from authentication
          title: bookingTitle,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          type: 'regular',
        });
        setOpenDialog(false);
        setBookingTitle('');
        setSelectedRoom(null);
      }
    }
  };

  const handleCancelBooking = () => {
    if (selectedEvent) {
      cancelBooking(selectedEvent.id);
      setSelectedEvent(null);
    }
  };

  const calendarEvents: BookingEvent[] = bookings.map(booking => ({
    id: booking.id,
    title: `${booking.title} - ${booking.roomId}`,
    start: new Date(booking.start),
    end: new Date(booking.end),
    roomId: booking.roomId,
    roomName: booking.roomId,
    userId: booking.requesterId,
  }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Room Booking Calendar
        </Typography>
        <div style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={['month', 'week', 'day']}
            defaultView="week"
            selectable
            onSelectSlot={handleSelect}
            onSelectEvent={handleEventSelect}
            eventPropGetter={(event: BookingEvent) => ({
              style: {
                backgroundColor: '#1976d2',
                borderRadius: '4px',
              },
            })}
          />
        </div>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create Booking</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={bookingTitle}
            onChange={(e) => setBookingTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            select
            fullWidth
            label="Room"
            value={selectedRoom || ''}
            onChange={(e) => setSelectedRoom(e.target.value)}
            margin="normal"
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id.toString()}>
                {room.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Start Time"
            type="datetime-local"
            value={format(startDate, "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="End Time"
            type="datetime-local"
            value={format(endDate, "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateBooking} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <>
              <p><strong>Title:</strong> {selectedEvent.title}</p>
              <p><strong>Room:</strong> {selectedEvent.roomName}</p>
              <p><strong>Start:</strong> {format(selectedEvent.start, 'PPpp')}</p>
              <p><strong>End:</strong> {format(selectedEvent.end, 'PPpp')}</p>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEvent(null)}>Close</Button>
          <Button onClick={handleCancelBooking} color="error">
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingCalendar; 