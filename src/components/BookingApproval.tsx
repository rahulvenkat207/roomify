import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import { useBooking } from '../context/BookingContext';
import { Booking } from '../types';

interface BookingApprovalProps {
  booking: Booking;
  onApprove: (bookingId: string) => void;
  onReject: (bookingId: string) => void;
}

const BookingApproval: React.FC<BookingApprovalProps> = ({
  booking,
  onApprove,
  onReject,
}) => {
  const { currentUser } = useBooking();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{booking.title}</Typography>
            <Chip
              label={booking.status}
              color={getStatusColor(booking.status) as 'success' | 'error' | 'warning' | 'default'}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Room
            </Typography>
            <Typography>{booking.roomId}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Requester
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar>{booking.requesterId[0]}</Avatar>
              <Typography>{booking.requesterId}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Time
            </Typography>
            <Typography>
              {new Date(booking.start).toLocaleString()} - {new Date(booking.end).toLocaleString()}
            </Typography>
          </Box>

          {booking.description && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography>{booking.description}</Typography>
            </Box>
          )}

          {booking.clubEvent && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Club Event
              </Typography>
              <Typography>{booking.clubEvent.name}</Typography>
            </Box>
          )}

          {booking.status === 'pending' && currentUser?.role === 'faculty' && (
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => onApprove(booking.id)}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => onReject(booking.id)}
              >
                Reject
              </Button>
            </Box>
          )}

          {booking.status === 'approved' && (
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {/* Handle check-in */}}
              >
                Check In
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {/* Handle check-out */}}
              >
                Check Out
              </Button>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BookingApproval; 