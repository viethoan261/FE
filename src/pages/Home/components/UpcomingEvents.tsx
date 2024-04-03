import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/reducers';
import { EventActions } from '@/redux/reducers/event/event.action';
import { IEvent } from '@/types/models/IEvent';
import {
  Avatar,
  Card,
  CardSection,
  Col,
  Grid,
  Group,
  Popover,
  Stack,
  Text,
  Tooltip,
  useMantineTheme
} from '@mantine/core';
import {
  IconCake,
  IconCalendarEvent,
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
  IconTimelineEvent
} from '@tabler/icons-react';
import {
  addDays,
  addWeeks,
  format,
  isSameDay,
  lastDayOfWeek,
  startOfWeek,
  subWeeks
} from 'date-fns';
import { useLayoutEffect, useState } from 'react';
import { EventPopover, EventType } from './EventPopover';

export const UpcomingEvents = () => {
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(EventActions.getAllEvents());
  }, [dispatch]);

  const { events } = useAppSelector((state: RootState) => state.event);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  // const [currentWeek, setCurrentWeek] = useState(getWeek(currentMonth));

  const changeWeekHandle = (btnType: string) => {
    if (btnType === 'prev') {
      setCurrentMonth(subWeeks(currentMonth, 1));
      // setCurrentWeek(getWeek(subWeeks(currentMonth, 1)));
    }
    if (btnType === 'next') {
      setCurrentMonth(addWeeks(currentMonth, 1));
      // setCurrentWeek(getWeek(addWeeks(currentMonth, 1)));
    }
  };

  const theme = useMantineTheme();

  // const calculateAniversary = (joinDate: string, day: Date) => {

  // };

  const renderHeader = () => {
    const dateFormat = 'MMM d';
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const endDate = addDays(startDate, 6); // Calculate the end date by adding 6 days to the start date
    const headerText = `${format(startDate, dateFormat)} – ${format(
      endDate,
      dateFormat
    )}, ${format(currentMonth, 'yyyy')}`;

    return (
      <Grid align="center">
        <Col span={4}>
          <Group position="left" spacing={'xs'}>
            <IconCalendarEvent
              size={'2rem'}
              style={{
                background: `${theme.colors.blue[7]}`,
                borderRadius: '50%',
                padding: '5px'
              }}
              color="white"
            />
            <Text fw={'bold'} fz={'md'}>
              Sự kiện sắp tới
            </Text>
          </Group>
        </Col>
        <Col span={4}>
          <Group position="center" spacing={'xs'}>
            <IconChevronLeft
              size={'1rem'}
              onClick={() => changeWeekHandle('prev')}
            />
            <Text fw={'bold'}>{headerText}</Text>
            <IconChevronRight
              size={'1rem'}
              onClick={() => changeWeekHandle('next')}
            />
          </Group>
        </Col>
        <Col span={4}>
          <Group position="right">
            <Tooltip label="Xem toàn bộ lịch">
              <IconExternalLink cursor={'pointer'} />
            </Tooltip>
          </Group>
        </Col>
      </Grid>
    );
  };

  const renderCells = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
    const dateFormat = 'EEE d';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);

        const usersWithBirthday: IEvent[] = [];

        const usersWithAnniversary: IEvent[] = [];

        events.forEach((user: IEvent) => {
          const userBirthDate = new Date(user.dayOfBirth);
          const userJoinDate = new Date(user.joinDate);

          if (
            userBirthDate.getMonth() === day.getMonth() &&
            userBirthDate.getDate() === day.getDate()
          ) {
            usersWithBirthday.push(user);
          }

          if (
            userJoinDate.getMonth() === day.getMonth() &&
            userJoinDate.getDate() === day.getDate()
          ) {
            usersWithAnniversary.push(user);
          }
        });

        days.push(
          <Col span={'auto'} h={150} pos={'relative'}>
            <Card p={'xs'} h={'100%'} withBorder radius={0}>
              <CardSection
                withBorder
                p={'sm'}
                sx={{ border: '1px solid black' }}
                bg={'gray.1'}
              >
                <Text
                  align="center"
                  fw={isSameDay(day, new Date()) ? 'bold' : ''}
                  fz={'md'}
                  color={isSameDay(day, new Date()) ? 'blue' : 'dimmed'}
                >
                  {formattedDate}
                </Text>
              </CardSection>
              <Stack py={'xs'}>
                <Popover
                  position="bottom"
                  withArrow
                  shadow="md"
                  width={360}
                  zIndex={'999'}
                >
                  {usersWithBirthday.length > 0 ? (
                    <Popover.Target>
                      <Group spacing={'xs'}>
                        <IconCake
                          size={'1.3rem'}
                          style={{
                            background: 'white',
                            borderRadius: '50%',
                            border: '2px solid blue',
                            padding: '2px'
                          }}
                          color="blue"
                          cursor={'pointer'}
                        />
                        {usersWithBirthday.map((user) => (
                          <Avatar
                            size={'1.3rem'}
                            radius={'xl'}
                            src={user.avatarFileId}
                          />
                        ))}
                      </Group>
                    </Popover.Target>
                  ) : null}
                  <Popover.Dropdown>
                    <EventPopover
                      usersList={usersWithBirthday}
                      date={formattedDate}
                      type={EventType.BIRTHDAY}
                    />
                  </Popover.Dropdown>
                </Popover>
                {usersWithAnniversary.length > 0 ? (
                  <Group spacing={'xs'}>
                    <IconTimelineEvent
                      size={'1.2rem'}
                      style={{
                        background: 'white',
                        borderRadius: '50%',
                        border: '2px solid blue',
                        padding: '2px'
                      }}
                      color="blue"
                      cursor={'pointer'}
                    />
                    {usersWithAnniversary.map((user) => (
                      <Avatar
                        size={'1.3rem'}
                        radius={'xl'}
                        src={user.avatarFileId}
                      />
                    ))}
                  </Group>
                ) : null}
              </Stack>
            </Card>
          </Col>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Grid w={'100%'} gutter={0}>
          {days}
        </Grid>
      );
      days = [];
    }
    return (
      <Group w={'full'} mt={'xl'}>
        {rows}
      </Group>
    );
  };

  return (
    <Card withBorder w={'100%'} p={'xl'} shadow={'xs'}>
      {renderHeader()}
      {renderCells()}
      <Group spacing={'xl'} mt={'xl'}>
        <Group spacing={'xs'}>
          <IconTimelineEvent
            size={'1.2rem'}
            style={{
              background: 'white',
              borderRadius: '50%',
              border: '2px solid blue',
              padding: '2px'
            }}
            color="blue"
            cursor={'pointer'}
          />
          <Text fz={'xs'}>Ngày kỉ niệm</Text>
        </Group>
        <Group spacing={'xs'}>
          <IconCake
            size={'1.2rem'}
            style={{
              background: 'white',
              borderRadius: '50%',
              border: '2px solid blue',
              padding: '2px'
            }}
            color="blue"
            cursor={'pointer'}
          />
          <Text fz={'xs'}>Sinh nhật</Text>
        </Group>
      </Group>
    </Card>
  );
};
