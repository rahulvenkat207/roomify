import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme,
  alpha,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import {
  EventAvailable as EventIcon,
  MeetingRoom as RoomIcon,
  CalendarMonth as CalendarIcon,
  TrendingUp as TrendingIcon,
  AccessTime as TimeIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon, color, trend }: StatCardProps) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: alpha(color, 0.1),
              borderRadius: '12px',
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1) rotate(5deg)',
              },
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: color, mb: 1 }}>
          {value}
        </Typography>
        {trend && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: trend.isPositive ? theme.palette.success.main : theme.palette.error.main,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}

const QuickActionCard = ({ title, description, icon, onClick, color }: QuickActionCardProps) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: alpha(color, 0.1),
              borderRadius: '12px',
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1) rotate(5deg)',
              },
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          onClick={onClick}
          sx={{ 
            color: color,
            '&:hover': {
              backgroundColor: alpha(color, 0.1),
            },
          }}
        >
          Get Started
        </Button>
      </CardActions>
    </Card>
  );
};

const RecentBookingItem = ({ booking }: { booking: any }) => {
  const theme = useTheme();
  
  return (
    <ListItem
      sx={{
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          transform: 'translateX(8px)',
        },
      }}
    >
      <ListItemIcon>
        <EventIcon color="primary" />
      </ListItemIcon>
      <ListItemText
        primary={booking.title}
        secondary={
          <>
            <Typography component="span" variant="body2" color="text.primary">
              {booking.roomName}
            </Typography>
            {' — '}
            {format(new Date(booking.start), 'MMM dd, yyyy h:mm a')}
          </>
        }
      />
    </ListItem>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { rooms, bookings } = useBooking();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const availableRooms = rooms.filter(room => room.status === 'available').length;
  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(booking => new Date(booking.start) > new Date()).length;
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
  const recentBookings = bookings
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
    .slice(0, 5);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2,
      }}>
        <Box>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Welcome to Roomify
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your smart room booking solution
          </Typography>
        </Box>
        <IconButton 
          color="primary" 
          onClick={() => theme.palette.mode === 'dark' ? theme.palette.mode = 'light' : theme.palette.mode = 'dark'}
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
            },
          }}
        >
          {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Box sx={{ display: 'flex' }}>
          <StatCard
            title="Available Rooms"
            value={availableRooms}
            icon={<RoomIcon sx={{ color: theme.palette.primary.main }} />}
            color={theme.palette.primary.main}
            trend={{ value: 5, isPositive: true }}
          />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <StatCard
            title="Total Bookings"
            value={totalBookings}
            icon={<EventIcon sx={{ color: theme.palette.success.main }} />}
            color={theme.palette.success.main}
            trend={{ value: 12, isPositive: true }}
          />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <StatCard
            title="Upcoming Bookings"
            value={upcomingBookings}
            icon={<CalendarIcon sx={{ color: theme.palette.info.main }} />}
            color={theme.palette.info.main}
            trend={{ value: 3, isPositive: false }}
          />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <StatCard
            title="Total Capacity"
            value={totalCapacity}
            icon={<PeopleIcon sx={{ color: theme.palette.warning.main }} />}
            color={theme.palette.warning.main}
            trend={{ value: 8, isPositive: true }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <Box sx={{ display: 'flex' }}>
              <QuickActionCard
                title="Book a Room"
                description="Find and book available rooms for your meetings and events"
                icon={<RoomIcon sx={{ color: theme.palette.primary.main }} />}
                onClick={() => navigate('/rooms')}
                color={theme.palette.primary.main}
              />
            </Box>
            <Box sx={{ display: 'flex' }}>
              <QuickActionCard
                title="View Calendar"
                description="Check the calendar for room availability and your bookings"
                icon={<CalendarIcon sx={{ color: theme.palette.info.main }} />}
                onClick={() => navigate('/calendar')}
                color={theme.palette.info.main}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Card sx={{ height: '100%', width: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimeIcon color="primary" />
                Recent Bookings
              </Typography>
              <List>
                {recentBookings.map((booking, index) => (
                  <React.Fragment key={booking.id}>
                    <RecentBookingItem booking={booking} />
                    {index < recentBookings.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard; 