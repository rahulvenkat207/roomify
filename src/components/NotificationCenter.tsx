import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useBooking } from '../context/BookingContext';
import { Notification } from '../types';

const NotificationCenter: React.FC = () => {
  const { notifications, markNotificationAsRead } = useBooking();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking_request':
        return <EventIcon color="primary" />;
      case 'booking_approved':
        return <CheckCircleIcon color="success" />;
      case 'booking_rejected':
        return <CancelIcon color="error" />;
      case 'booking_reminder':
        return <ScheduleIcon color="warning" />;
      case 'club_event':
        return <PeopleIcon color="info" />;
      default:
        return <NotificationsIcon color="action" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Box>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 360, maxHeight: 480 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No notifications"
                sx={{ textAlign: 'center', color: 'text.secondary' }}
              />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  bgcolor: notification.read ? 'inherit' : 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' },
                }}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block' }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Menu>
    </Box>
  );
};

export default NotificationCenter; 