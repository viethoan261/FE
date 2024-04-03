import { Col, Grid, Stack } from '@mantine/core';
import { CheckAttendance } from './components/CheckAttendance';
import { MyNews } from './components/MyNews';
import { MyTimeOff } from './components/MyTimeoff';

export const Home = () => {
  return (
    <Stack px={'xl'} spacing={30}>
      {/* <UpcomingEvents /> */}
      <Grid gutter={50}>
        <Col span={7}>
          <MyTimeOff />
        </Col>
        <Col span={5}>
          <CheckAttendance />
        </Col>
      </Grid>
      <Grid gutter={50}>
        <Col span={7}>
          <MyNews />
        </Col>
      </Grid>
    </Stack>
  );
};
