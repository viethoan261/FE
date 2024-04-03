import { useAppDispatch } from '@/hooks/redux';
import { Stack } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { BalanceHistory } from './components/BalanceHistory';
import { MyRequests } from './components/MyRequests';
import { TimeoffActions } from '@/redux/reducers/timeoff/timeoff.action';
import { IBalance } from '@/types/models/IBalance';
import { IRequest } from '@/types/models/IRequest';

export const TimeOff = () => {
  const dispatch = useAppDispatch();
  const [_balanceHistory, setBalanceHistory] = useState<IBalance[]>();
  const [_remainTimeoffDays, setRemainTimeoffDays] = useState<IRequest[]>();

  const [balanceHistoryTrigger, setBalanceHistoryTrigger] = useState(0);

  const triggerBalanceHistory = () => {
    setBalanceHistoryTrigger((prevTrigger) => prevTrigger + 1);
    console.log('asdasd');
    dispatch(TimeoffActions.getBalanceHistory());
    dispatch(TimeoffActions.getMyTimeoff());
  };

  const getBalanceHistory = useCallback(() => {
    dispatch(
      TimeoffActions.getBalanceHistory({
        onSuccess: (data: IBalance[]) => {
          setBalanceHistory(data);
        }
      })
    );
  }, [dispatch]);

  const getRemainTimeoffDays = useCallback(() => {
    dispatch(
      TimeoffActions.getMyTimeoff({
        onSuccess: (data: IRequest[]) => {
          setRemainTimeoffDays(data);
        }
      })
    );
  }, [dispatch]);

  useEffect(() => {
    getBalanceHistory();
  }, [getBalanceHistory]);

  useEffect(() => {
    console.log('asdasd');
    getBalanceHistory();
    getRemainTimeoffDays();
  }, [
    balanceHistoryTrigger,
    dispatch,
    getBalanceHistory,
    getRemainTimeoffDays
  ]);

  return (
    <Stack px={'xl'}>
      <MyRequests triggerBalanceHistory={triggerBalanceHistory} />
      <BalanceHistory
        _balanceHistory={_balanceHistory}
        _remainTimeoffDays={_remainTimeoffDays}
      />
    </Stack>
  );
};
