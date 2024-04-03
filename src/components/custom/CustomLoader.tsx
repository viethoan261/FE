import { Box, Loader } from '@mantine/core';

const CustomLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#FFF',
      width: '100%',
      height: '100%'
    }}
  >
    <Loader color="secondary" size="xl" />
  </Box>
);

export default CustomLoader;
