import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
} from '@mui/material';
import { useBooking } from '../context/BookingContext';
import { Room } from '../types';

const RoomList: React.FC = () => {
  const { rooms, bookings, bookRoom, isRoomAvailable } = useBooking();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [bookingTitle, setBookingTitle] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handleBookRoom = () => {
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setOpenDialog(false);
        setBookingTitle('');
        setSelectedRoom(null);
      }
    }
  };

  const getRoomStatus = (room: Room) => {
    const now = new Date();
    const hasActiveBooking = bookings.some(
      booking =>
        booking.roomId === room.id.toString() &&
        booking.status === 'approved' &&
        new Date(booking.start) <= now &&
        new Date(booking.end) >= now
    );

    return hasActiveBooking ? 'booked' : 'available';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{room.name}</Typography>
                  <Chip
                    label={getRoomStatus(room)}
                    color={getRoomStatus(room) === 'available' ? 'success' : 'error'}
                  />
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  Capacity: {room.capacity} people
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Type: {room.type}
                </Typography>
                {room.equipment.length > 0 && (
                  <Typography color="textSecondary" gutterBottom>
                    Equipment: {room.equipment.join(', ')}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setSelectedRoom(room.id.toString());
                    setOpenDialog(true);
                  }}
                  disabled={getRoomStatus(room) === 'booked'}
                >
                  Book Room
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Book Room</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={bookingTitle}
            onChange={(e) => setBookingTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Start Time"
            type="datetime-local"
            value={startDate.toISOString().slice(0, 16)}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="End Time"
            type="datetime-local"
            value={endDate.toISOString().slice(0, 16)}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleBookRoom} variant="contained" color="primary">
            Book
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoomList; 