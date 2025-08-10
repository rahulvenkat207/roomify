import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Booking, 
  Room, 
  User, 
  Notification, 
  Analytics,
  UserRole 
} from '../types';
import { Grid } from '@mui/material';
import { useBookings } from '../context/BookingContext';

interface BookingContextType {
  rooms: Room[];
  bookings: Booking[];
  users: User[];
  notifications: Notification[];
  analytics: Analytics;
  currentUser: User | null;
  bookRoom: (booking: Omit<Booking, 'id' | 'status' | 'approvedBy' | 'approvedAt'>) => void;
  approveBooking: (bookingId: string, approverId: string) => void;
  rejectBooking: (bookingId: string, approverId: string) => void;
  cancelBooking: (bookingId: string) => void;
  checkIn: (bookingId: string, verifierId: string) => void;
  checkOut: (bookingId: string, verifierId: string) => void;
  isRoomAvailable: (roomId: string, start: Date, end: Date) => boolean;
  getRoomAnalytics: (roomId: number) => Analytics['roomUsage'][0] | undefined;
  getDepartmentAnalytics: (department: string) => Analytics['departmentUsage'][0] | undefined;
  getUserAnalytics: (userId: string) => Analytics['userStats'][0] | undefined;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  setCurrentUser: (user: User | null) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      name: 'Conference Room A',
      capacity: 20,
      status: 'available',
      equipment: ['Projector', 'Whiteboard', 'Video Conference'],
      type: 'conference',
      department: 'Computer Science',
    },
    // Add more rooms...
  ]);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<Analytics>({
    roomUsage: [],
    departmentUsage: [],
    userStats: [],
  });

  const bookRoom = useCallback((booking: Omit<Booking, 'id' | 'status' | 'approvedBy' | 'approvedAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: uuidv4(),
      status: 'pending',
    };

    setBookings(prev => [...prev, newBooking]);

    // Add notification for approval request
    addNotification({
      userId: booking.userId,
      type: 'booking_created',
      title: 'Booking Request Created',
      message: `Your booking request for ${booking.roomName} has been created and is pending approval.`,
      bookingId: newBooking.id,
    });
  }, []);

  const approveBooking = useCallback((bookingId: string, approverId: string) => {
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          status: 'approved',
          approvedBy: approverId,
          approvedAt: new Date(),
        };
      }
      return booking;
    }));

    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      addNotification({
        userId: booking.userId,
        type: 'booking_approved',
        title: 'Booking Approved',
        message: `Your booking request for ${booking.roomName} has been approved.`,
        bookingId,
      });
    }
  }, [bookings]);

  const rejectBooking = useCallback((bookingId: string, approverId: string) => {
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          status: 'rejected',
          approvedBy: approverId,
          approvedAt: new Date(),
        };
      }
      return booking;
    }));

    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      addNotification({
        userId: booking.userId,
        type: 'booking_rejected',
        title: 'Booking Rejected',
        message: `Your booking request for ${booking.roomName} has been rejected.`,
        bookingId,
      });
    }
  }, [bookings]);

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        return { ...booking, status: 'cancelled' };
      }
      return booking;
    }));
  }, []);

  const checkIn = useCallback((bookingId: string, verifierId: string) => {
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          checkIn: {
            time: new Date(),
            verifiedBy: verifierId,
          },
        };
      }
      return booking;
    }));
  }, []);

  const checkOut = useCallback((bookingId: string, verifierId: string) => {
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          checkOut: {
            time: new Date(),
            verifiedBy: verifierId,
          },
        };
      }
      return booking;
    }));
  }, []);

  const isRoomAvailable = (roomId: string, start: Date, end: Date): boolean => {
    return !bookings.some(
      booking =>
        booking.roomId === roomId &&
        booking.status === 'approved' &&
        new Date(booking.start) <= end &&
        new Date(booking.end) >= start
    );
  };

  const getRoomAnalytics = useCallback((roomId: number) => {
    return analytics.roomUsage.find(room => room.roomId === roomId);
  }, [analytics]);

  const getDepartmentAnalytics = useCallback((department: string) => {
    return analytics.departmentUsage.find(dept => dept.department === department);
  }, [analytics]);

  const getUserAnalytics = useCallback((userId: string) => {
    return analytics.userStats.find(user => user.userId === userId);
  }, [analytics]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      createdAt: new Date(),
      read: false,
    };
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    }));
  }, []);

  const value = {
    rooms,
    bookings,
    users,
    notifications,
    analytics,
    currentUser,
    bookRoom,
    approveBooking,
    rejectBooking,
    cancelBooking,
    checkIn,
    checkOut,
    isRoomAvailable,
    getRoomAnalytics,
    getDepartmentAnalytics,
    getUserAnalytics,
    addNotification,
    markNotificationAsRead,
    setCurrentUser,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; 

<Grid item xs={12} sm={6} md={3}>
  {/* ... */}
</Grid> 