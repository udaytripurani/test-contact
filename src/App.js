import React from 'react';
import { Typography } from '@mui/material';
import ContactManager from './ContactManager';
import logo from './logo.svg'; 


import '@fontsource/poppins';

function App() {
  return (
    <div style={{ padding: '0', margin: '0', height: '100vh', position: 'relative' }}>
      
      <img
        src={logo} 
        alt="Logo"
        style={{
          position: 'absolute',
          top: '-2px', 
          left: '10px', 
          width: '125px', 
          height: '100px', 
        }}
      />
      
      
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{
          paddingTop: '2rem',
          fontFamily: 'Poppins, sans-serif', 
          fontWeight: 'bold', 
          animation: 'popAnimation 0.5s ease-out', 
          color: '#181c39', 
        }}
      >
        Erino Contact Management
      </Typography>

      <ContactManager />
    </div>
  );
}

export default App;
