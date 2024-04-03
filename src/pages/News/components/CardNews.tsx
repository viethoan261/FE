import { ROUTER } from '@/configs/router';
import { useAuthContext } from '@/hooks/context';
import { useAppDispatch } from '@/hooks/redux';
import { NewsActions } from '@/redux/reducers/news/news.action';
import { INew, INewStatus, INewStatusDict } from '@/types/models/INew';
import { formatDateFromISOString } from '@/utils/helpers';
import { RESOURCES, SCOPES, isGrantedPermission } from '@/utils/permissions';
import { Badge, Card, Divider, Group, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconClock, IconEdit, IconFlag, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  news: INew;
}

export const CardNews = ({ news }: Props) => {
  const { state } = useAuthContext();
  const { authorities } = state;
  const [_authorities, setAuthorities] = useState(authorities);

  useEffect(() => {
    setAuthorities(authorities);
  }, [authorities]);

  const isGrantedUpdatePermission = isGrantedPermission(
    _authorities,
    RESOURCES.NEWS,
    SCOPES.UPDATE
  );
  const isGrantedDeletePermission = isGrantedPermission(
    _authorities,
    RESOURCES.NEWS,
    SCOPES.DELETE
  );

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isImportant, status, title, createdAt, authorName, id } = news;

  const openDeleteModal = (id: string) =>
    modals.openConfirmModal({
      title: 'Xoá thông báo',
      labels: { confirm: 'Xác nhận', cancel: 'Huỷ' },
      onConfirm: () => {
        dispatch(
          NewsActions.deleteNew(id, {
            onSuccess: () => dispatch(NewsActions.getAllNews())
          })
        );
      }
    });

  return (
    <Card
      withBorder
      radius={'sm'}
      onClick={() => navigate(`${ROUTER.NEWS}/${id}`)}
      sx={{ cursor: 'pointer' }}
    >
      <Group position="apart" align="center">
        <Stack spacing={'xs'}>
          <Group spacing={'xs'} align="center">
            {isImportant ? (
              <IconFlag color="red" size={'1.2rem'} stroke={'1.5'} />
            ) : null}
            <Text fw={600}>{title}</Text>
            <Badge radius={'xs'} color={INewStatusDict[status].color}>
              {INewStatusDict[status].label}
            </Badge>
          </Group>
          <Group spacing={'xs'} align="center">
            <IconClock color="gray" size={'1rem'} />
            <Text color="dimmed">{formatDateFromISOString(createdAt)}</Text>
            <Divider orientation="vertical" />
            <Text>{authorName}</Text>
          </Group>
        </Stack>
        <Group>
          {status === INewStatus.DRAFT && isGrantedUpdatePermission ? (
            <IconEdit
              size={'1.2rem'}
              cursor={'pointer'}
              onClick={() => navigate(`${ROUTER.NEWS}/${id}`)}
            />
          ) : null}
          {isGrantedDeletePermission && (
            <IconTrash
              color="red"
              size={'1.2rem'}
              cursor={'pointer'}
              onClick={(e) => {
                e.stopPropagation();
                openDeleteModal(id);
              }}
            />
          )}
        </Group>
      </Group>
    </Card>
  );
};
