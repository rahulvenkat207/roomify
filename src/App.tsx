import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import RoomList from './pages/RoomList';
import BookingCalendar from './pages/BookingCalendar';
import { BookingProvider } from './context/BookingContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BookingProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/rooms" element={<RoomList />} />
              <Route path="/calendar" element={<BookingCalendar />} />
            </Routes>
          </div>
        </Router>
      </BookingProvider>
    </ThemeProvider>
  );
}

export default App;
