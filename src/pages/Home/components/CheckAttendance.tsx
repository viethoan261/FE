import CustomLoader from '@/components/custom/CustomLoader';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/reducers';
import { AttendanceAction } from '@/redux/reducers/attendance/attendance.action';
import {
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  useMantineTheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconClock2, IconLogin, IconLogout } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

export const CheckAttendance = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(AttendanceAction.getMyAttendances());
  }, [dispatch]);

  const { myAttendances } = useAppSelector(
    (state: RootState) => state.attendance
  );

  const [_currentDate, setCurrentDate] = useState(dayjs(new Date()));

  const checkIfCheckInToday = useCallback(() => {
    const index = myAttendances.findIndex(({ start }) => {
      if (
        dayjs(start).date() === _currentDate.date() &&
        dayjs(start).month() === _currentDate.month()
      ) {
        return true;
      } else {
        return false;
      }
    });
    return index === -1 ? false : true;
  }, [_currentDate, myAttendances]);

  const theme = useMantineTheme();

  // const [_checkinDate, setCheckinDate] = useState<dayjs.Dayjs>();
  const [_isCheckin, setIsCheckin] = useState(checkIfCheckInToday());

  useEffect(() => {
    setIsCheckin(checkIfCheckInToday());
  }, [checkIfCheckInToday]);

  const [opened, { close, open }] = useDisclosure();
  const [note, setNote] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(dayjs(new Date()));
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleCheckIn = () => {
    if (!_isCheckin) {
      dispatch(AttendanceAction.checkin());
      setIsCheckin(!_isCheckin);
      // dispatch(AttendanceAction.getMyAttendances());
    } else {
      open();
    }
  };

  const handleCheckOut = () => {
    dispatch(AttendanceAction.checkout(note));
    setNote('');
    close();
  };

  return myAttendances ? (
    <Card withBorder w={'100%'} p={'xl'} shadow={'xs'}>
      <Stack>
        <Group position="apart">
          <Group>
            <IconClock2
              size={'2rem'}
              style={{
                background: `${theme.colors.blue[7]}`,
                borderRadius: '50%',
                padding: '5px'
              }}
              color="white"
            />
            <Text fw={'bold'} fz={'md'}>
              Check in/out
            </Text>
          </Group>
          <Text fw={'bold'} fz={'md'}>
            {_currentDate.format('hh:mm - DD MMM').toString()}
          </Text>
        </Group>
        <Button
          color={_isCheckin ? 'red' : 'blue'}
          leftIcon={_isCheckin ? <IconLogout /> : <IconLogin />}
          onClick={handleCheckIn}
        >
          {_isCheckin ? 'Check out' : 'Check in'}
        </Button>
      </Stack>

      <Modal opened={opened} onClose={close} title="Check out">
        <Stack>
          <Textarea
            label="Ghi chú"
            value={note}
            onChange={(e) => setNote(e.currentTarget.value)}
            placeholder="Có thể để trống"
          />
          <Group position="right">
            <Button variant="outline">Huỷ</Button>
            <Button onClick={handleCheckOut}>Check out</Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  ) : (
    <CustomLoader></CustomLoader>
  );
};
