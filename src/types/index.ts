export type UserRole = 'student' | 'faculty' | 'admin' | 'hod';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin' | 'hod';
  department: string;
  clubMemberships?: string[];
}

export interface Room {
  id: string;
  name: string;
  type: 'classroom' | 'conference' | 'meeting' | 'lab';
  capacity: number;
  equipment: string[];
  department: string;
  floor: number;
  building: string;
  status: 'available' | 'booked' | 'maintenance';
  qrCode?: string;
  blockOutHours?: {
    start: string;
    end: string;
    days: number[];
  }[];
}

export interface Booking {
  id: string;
  roomId: string;
  requesterId: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type: 'regular' | 'club' | 'class';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: string;
  approvedAt?: string;
  checkIn?: {
    time: Date;
    verifiedBy: string;
  };
  checkOut?: {
    time: Date;
    verifiedBy: string;
  };
  clubEvent?: {
    id: string;
    name: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  members: string[];
  events: ClubEvent[];
  createdAt: string;
  updatedAt: string;
  facultyInCharge: string;
}

export interface ClubEvent {
  id: string;
  clubId: string;
  name: string;
  description: string;
  start: string;
  end: string;
  location: string;
  attendees: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking_request' | 'booking_approved' | 'booking_rejected' | 'booking_reminder' | 'club_event';
  title: string;
  message: string;
  bookingId?: string;
  clubId?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalBookings: number;
  approvedBookings: number;
  pendingBookings: number;
  totalCapacity: number;
  roomUsage: {
    roomId: string;
    bookings: number;
    hours: number;
    utilization: number;
  }[];
  departmentUsage: {
    department: string;
    bookings: number;
    hours: number;
  }[];
  peakHours: {
    hour: number;
    bookings: number;
  }[];
  roomTypes: {
    type: string;
    count: number;
  }[];
} 