import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Roomify
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/rooms">
            Rooms
          </Button>
          <Button color="inherit" component={Link} to="/calendar">
            Calendar
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 