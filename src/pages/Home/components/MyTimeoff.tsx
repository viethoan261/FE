import { ROUTER } from '@/configs/router';
import { useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/reducers';
import {
  IRequest,
  IRequestStatusDict,
  IRequestTypeDict
} from '@/types/models/IRequest';
import {
  Badge,
  Card,
  Center,
  Col,
  Grid,
  Group,
  Stack,
  Text,
  useMantineTheme
} from '@mantine/core';
import { IconIdOff } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transformDate } from '../helper';

export const MyTimeOff = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { myRequests } = useAppSelector((state: RootState) => state.timeoff);

  const [_todayRequests, setTodayRequest] = useState<IRequest[]>([]);

  useEffect(() => {
    setTodayRequest(
      // myRequests.filter((request) => {
      //   const today = new Date();
      //   const from = dayjs(request.dateFrom).toDate();
      //   // const to = dayjs(request.dateTo).toDate();
      //   if (today <= from) {
      //     return true;
      //   }
      // })
      myRequests.slice(0, 2)
    );
  }, [myRequests]);

  return (
    <Card withBorder w={'100%'} p={'xl'} shadow={'xs'}>
      <Stack spacing={'lg'}>
        <Group position="apart">
          <Group spacing={'xs'}>
            <IconIdOff
              size={'2rem'}
              style={{
                background: `${theme.colors.blue[7]}`,
                borderRadius: '50%',
                padding: '5px'
              }}
              color="white"
            />
            <Text fw={'bold'} fz={'md'}>
              Lịch nghỉ phép
            </Text>
          </Group>
          <Text
            color="blue.8"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate(ROUTER.TIME_OFF)}
          >
            Xem tất cả
          </Text>
        </Group>
        <Grid>
          {_todayRequests.slice(0, 3).map((request) => (
            <Col span={12}>
              <CustomCard request={request} />
            </Col>
          ))}
        </Grid>
        <Center>
          <Group align="center" spacing={0}>
            <Center>
              {/* <Text align="center">
                {`Bạn còn ${_remainTimeoffDays} ngày nghỉ có lương.`}
              </Text> */}
              <Text
                onClick={() => navigate(ROUTER.TIME_OFF)}
                style={{ cursor: 'pointer' }}
                color="blue"
              >
                Tạo yêu cầu
              </Text>
            </Center>
          </Group>
        </Center>
      </Stack>
    </Card>
  );
};

interface CustomCardProps {
  request: IRequest;
}

const CustomCard: React.FC<CustomCardProps> = ({ request }) => {
  const { dateFrom, type, dayOff, status } = request;
  const theme = useMantineTheme();
  return (
    <Card withBorder radius={'sm'} px={'sm'} py={0} shadow="xs">
      <Grid>
        <Col
          span={3}
          sx={{ borderRight: `1px solid ${theme.colors.gray[4]}` }}
          py={'sm'}
        >
          <Stack align="center" spacing={0}>
            <Text fw={600} fz={'1.8rem'}>
              {transformDate(dateFrom).date}
            </Text>
            <Text color="dimmed" fz={'0.8rem'}>
              {transformDate(dateFrom).month}
            </Text>
          </Stack>
        </Col>
        <Col span={9} pl={'lg'}>
          <Group align="center" position="apart" h={'100%'}>
            <Stack spacing={0}>
              <Text>{IRequestTypeDict[type].label}</Text>
              <Text color="dimmed" fz={'0.8rem'}>
                {dayOff} ngày
              </Text>
            </Stack>
            <Badge
              radius={'sm'}
              p={'md'}
              color={IRequestStatusDict[status].color}
            >
              {IRequestStatusDict[status].label}
            </Badge>
          </Group>
        </Col>
      </Grid>
    </Card>
  );
};
