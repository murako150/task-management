import React from 'react';
import { Container, Typography } from '@mui/material';

function CommonFooter() {
  return (
    <footer style={{ backgroundColor: '#f8f9fa', padding: '10px', textAlign: 'center' }}>
      <Container>
        <Typography variant="body2" color="textSecondary">
          © 2024 Your Company Name. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
}

export default CommonFooter;