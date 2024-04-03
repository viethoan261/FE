import { ROUTER } from '@/configs/router';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/reducers';
import { NewsActions } from '@/redux/reducers/news/news.action';
import { INewStatus, INewStatusDict } from '@/types/models/INew';
import { Button, Group, Input, Select, Stack } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardNews } from './components/CardNews';
import { useAuthContext } from '@/hooks/context';
import { RESOURCES, SCOPES, isGrantedPermission } from '@/utils/permissions';
import { removeVietnameseandLowercase } from '@/utils/helpers';

export const News = () => {
  const { state } = useAuthContext();
  const { authorities } = state;
  const [_authorities, setAuthorities] = useState(authorities);

  useEffect(() => {
    setAuthorities(authorities);
  }, [authorities]);

  const dispatch = useAppDispatch();
  const { news } = useAppSelector((state: RootState) => state.news);
  const [_allNews, setAllNews] = useState(news);

  useLayoutEffect(() => {
    dispatch(NewsActions.getAllNews());
  }, [dispatch]);

  const [_statusFilter, setStatusFilter] = useState<string | null>(
    INewStatus.PUBLISHED
  );
  const [_query, setQuery] = useState('');
  const [debounceQuery] = useDebouncedValue(_query, 300);

  useEffect(() => {
    setAllNews(
      news.filter((newsItem) => {
        if (newsItem.status === _statusFilter) {
          if (debounceQuery !== '') {
            if (
              removeVietnameseandLowercase(newsItem.title).includes(
                removeVietnameseandLowercase(debounceQuery)
              ) ||
              removeVietnameseandLowercase(newsItem.content).includes(
                removeVietnameseandLowercase(debounceQuery)
              )
            ) {
              return true;
            } else return false;
          }
          return true;
        } else if (_statusFilter === INewStatus.ALL) {
          if (debounceQuery !== '') {
            if (
              removeVietnameseandLowercase(newsItem.title).includes(
                removeVietnameseandLowercase(debounceQuery)
              ) ||
              removeVietnameseandLowercase(newsItem.content).includes(
                removeVietnameseandLowercase(debounceQuery)
              )
            ) {
              return true;
            } else return false;
          }
          return true;
        } else return false;
      })
    );
  }, [news, _statusFilter, debounceQuery, _query]);

  const navigate = useNavigate();

  return (
    <Stack spacing={'md'} p={'lg'}>
      <Group position="apart">
        <Group>
          <Select
            data={Object.values(INewStatus).map((status) => ({
              label: INewStatusDict[status].label,
              value: status
            }))}
            value={_statusFilter}
            onChange={(value) => setStatusFilter(value)}
          />
        </Group>
        <Group>
          <Input
            icon={<IconSearch size={'1rem'} />}
            placeholder="Tìm kiếm tiêu đề hoặc nội dung"
            onChange={(e) => setQuery(e.currentTarget.value)}
            miw={'250px'}
          />
          {isGrantedPermission(_authorities, RESOURCES.NEWS, SCOPES.CREATE) && (
            <Button onClick={() => navigate(ROUTER.CREATE_NEWS)}>
              <IconPlus size={'1rem'} />
              Tạo mới
            </Button>
          )}
        </Group>
      </Group>

      {_allNews.map((news) => (
        <CardNews news={news} />
      ))}
    </Stack>
  );
};
