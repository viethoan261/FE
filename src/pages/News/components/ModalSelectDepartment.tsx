import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/reducers';
import { DepartmentActions } from '@/redux/reducers/department/department.action';
import { UserActions } from '@/redux/reducers/user/user.action';
import { IUser } from '@/types/models/IUser';
import {
  Avatar,
  Button,
  Card,
  Group,
  MultiSelect,
  ScrollArea,
  Stack,
  Text,
  useMantineTheme
} from '@mantine/core';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useState
} from 'react';

interface Props {
  close: () => void;
  setUserIds: Dispatch<SetStateAction<string[]>>;
  userIds: string[];
}

export const ModalSelectDepartment = ({
  close,
  setUserIds,
  userIds
}: Props) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(UserActions.getAllUser());
  }, [dispatch]);

  const { users } = useAppSelector((state: RootState) => state.user);
  const getSelectedUsers = () => {
    return users.filter(({ id }) => {
      if (userIds.includes(id)) return true;
      else return false;
    });
  };

  const [_users, setUsers] = useState<IUser[]>(() => getSelectedUsers());

  const handleChange = (selected: string[]) => {
    const users = selected.flatMap((id) => {
      const selectedDepartment = departments.find((item) => item.id === id);
      return selectedDepartment?.users || [];
    });
    setUsers(users);
  };

  useLayoutEffect(() => {
    dispatch(DepartmentActions.getAllDepartment());
  }, [dispatch]);

  const { departments } = useAppSelector(
    (state: RootState) => state.department
  );

  const data = departments.map((department) => ({
    value: department.id,
    label: department.name
  }));

  const theme = useMantineTheme();

  const handleRemoveUser = (userId: string) => {
    const updateUsers = _users.filter((user) => user.id !== userId);
    setUsers(updateUsers);
  };

  const handleConfirm = () => {
    setUserIds(_users.map((user) => user.id));
    close();
  };

  const handleCancel = () => {
    setUserIds([]);
    close();
  };

  return (
    <Stack mih={'400px'} justify={'space-between'} spacing={'lg'}>
      <MultiSelect data={data} label="Chọn phòng ban" onChange={handleChange} />
      <ScrollArea h={'300px'}>
        {_users.map((user) => {
          return (
            <Card
              key={user.id}
              p={'xs'}
              sx={{
                ':hover': {
                  background: `${theme.colors.gray[1]}`
                }
              }}
            >
              <Group position="apart" align="center">
                <Group>
                  <Avatar
                    size={'sm'}
                    src={user.avatarFileId || ''}
                    radius={'xl'}
                  />
                  <Text fz={'sm'} color="dimmed">
                    {user.email}
                  </Text>
                </Group>
                <Button
                  py={0}
                  size={'xs'}
                  color="gray.5"
                  fz={'xs'}
                  onClick={() => handleRemoveUser(user.id)}
                >
                  Loại
                </Button>
              </Group>
            </Card>
          );
        })}
      </ScrollArea>
      <Group position="right">
        <Button variant="outline" onClick={handleCancel}>
          Huỷ
        </Button>
        <Button onClick={handleConfirm}>Lưu</Button>
      </Group>
    </Stack>
  );
};
