import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  MeetingRoom as RoomIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { useBooking } from '../context/BookingContext';
import { Room } from '../types';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, icon, color, trend }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            backgroundColor: `${color}20`,
            borderRadius: '12px',
            p: 1,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ mb: 1 }}>
        {value}
      </Typography>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TrendingIcon
            sx={{
              color: trend.isPositive ? 'success.main' : 'error.main',
              transform: trend.isPositive ? 'none' : 'rotate(180deg)',
              mr: 1,
            }}
          />
          <Typography
            variant="body2"
            color={trend.isPositive ? 'success.main' : 'error.main'}
          >
            {trend.value}% from last month
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const AnalyticsDashboard: React.FC = () => {
  const { rooms, bookings, analytics } = useBooking();

  const totalBookings = bookings.length;
  const approvedBookings = bookings.filter(b => b.status === 'approved').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);

  const getRoomTypeCount = (type: Room['type']) => {
    return rooms.filter(room => room.type === type).length;
  };

  const getPeakHours = () => {
    const hourCounts = new Array(24).fill(0);
    bookings.forEach(booking => {
      const startHour = new Date(booking.start).getHours();
      const endHour = new Date(booking.end).getHours();
      for (let hour = startHour; hour <= endHour; hour++) {
        hourCounts[hour]++;
      }
    });
    return hourCounts;
  };

  const peakHours = getPeakHours();
  const maxBookings = Math.max(...peakHours);
  const peakHourIndex = peakHours.indexOf(maxBookings);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Box>
          <AnalyticsCard
            title="Total Bookings"
            value={totalBookings}
            icon={<ScheduleIcon sx={{ color: 'primary.main' }} />}
            color="#1976d2"
            trend={{ value: 12, isPositive: true }}
          />
        </Box>
        <Box>
          <AnalyticsCard
            title="Approved Bookings"
            value={approvedBookings}
            icon={<RoomIcon sx={{ color: 'success.main' }} />}
            color="#2e7d32"
            trend={{ value: 8, isPositive: true }}
          />
        </Box>
        <Box>
          <AnalyticsCard
            title="Pending Approvals"
            value={pendingBookings}
            icon={<PeopleIcon sx={{ color: 'warning.main' }} />}
            color="#ed6c02"
          />
        </Box>
        <Box>
          <AnalyticsCard
            title="Total Capacity"
            value={totalCapacity}
            icon={<PeopleIcon sx={{ color: 'info.main' }} />}
            color="#0288d1"
          />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Room Types Distribution
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <RoomIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Classrooms"
                    secondary={`${getRoomTypeCount('classroom')} rooms`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RoomIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Conference Rooms"
                    secondary={`${getRoomTypeCount('conference')} rooms`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RoomIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Labs"
                    secondary={`${getRoomTypeCount('lab')} rooms`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RoomIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Auditoriums"
                    secondary={`${getRoomTypeCount('auditorium')} rooms`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Peak Hours
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Most Active Hour: {peakHourIndex}:00 ({maxBookings} bookings)
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {peakHours.map((count, hour) => (
                    <Box key={hour} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">
                          {hour}:00
                        </Typography>
                        <Typography variant="body2">
                          {count} bookings
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(count / maxBookings) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: count === maxBookings ? 'primary.main' : 'primary.light',
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AnalyticsDashboard; 