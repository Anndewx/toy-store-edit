import React from 'react';
import { Typography, Box } from '@mui/material';

function CartPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        ตะกร้าสินค้าของคุณ
      </Typography>
      <Typography variant="body1">
        ตอนนี้ยังไม่มีสินค้าในตะกร้า
      </Typography>
    </Box>
  );
}

export default CartPage;