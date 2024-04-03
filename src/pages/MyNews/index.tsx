import { useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/reducers';
import { Group, Stack, Text, useMantineTheme } from '@mantine/core';
import { IconNews } from '@tabler/icons-react';
import { CardNews } from '../Home/components/MyNews';

export const MyNews = () => {
  const { myNews } = useAppSelector((state: RootState) => state.news);
  const theme = useMantineTheme();

  return (
    <Stack>
      <Group position="apart">
        <Group spacing={'xs'}>
          <IconNews
            size={'2rem'}
            style={{
              background: `${theme.colors.blue[7]}`,
              borderRadius: '50%',
              padding: '5px'
            }}
            color="white"
          />
          <Text fw={'bold'} fz={'md'}>
            Tất cả thông báo
          </Text>
        </Group>
      </Group>
      {myNews.map((news) => (
        <CardNews news={news} />
      ))}
    </Stack>
  );
};
