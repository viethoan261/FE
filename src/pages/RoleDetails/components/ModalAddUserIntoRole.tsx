import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import usePagination from '@/hooks/use-pagination';
import { RootState } from '@/redux/reducers';
import { RoleActions } from '@/redux/reducers/role/role.action';
import { UserActions } from '@/redux/reducers/user/user.action';
import { IUser, IUserStatus, IUserStatusDict } from '@/types/models/IUser';
import { removeVietnameseandLowercase } from '@/utils/helpers';
import { Badge, Button, Group, Input, Stack, Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useState } from 'react';

interface Props {
  roleId: string | undefined;
  close: () => void;
  getRoleDetails: () => void;
}
export const ModalAddUserIntoRole = ({
  roleId,
  close,
  getRoleDetails
}: Props) => {
  const [userList, setUserList] = useState<string[]>([]);
  const { users } = useAppSelector((state: RootState) => state.user);
  const [_users, setUsers] = useState(users);
  const [_query, setQuery] = useState('');
  const [debounceQuery] = useDebouncedValue(_query, 200);

  useEffect(() => {
    setUsers(
      users.filter((user) => {
        if (debounceQuery !== '') {
          if (
            removeVietnameseandLowercase(user.fullName).includes(
              removeVietnameseandLowercase(debounceQuery)
            ) ||
            removeVietnameseandLowercase(user.employeeCode).includes(
              removeVietnameseandLowercase(debounceQuery)
            )
          ) {
            return true;
          }
        } else {
          return true;
        }
      })
    );
  }, [debounceQuery, users]);

  const dispatch = useAppDispatch();

  const handleAdd = (id: string) => {
    if (userList.includes(id)) {
      const updatedUserList = userList.filter((userId) => userId !== id);
      setUserList(updatedUserList);
    } else {
      const updatedUserList = [...userList, id];
      setUserList(updatedUserList);
    }
  };

  const handleSubmit = () => {
    dispatch(
      RoleActions.addUser(roleId, userList, {
        onSuccess: () => {
          dispatch(UserActions.getAllUser());
          getRoleDetails();
          close();
        }
      })
    );
  };

  const handleCancel = () => {
    setUserList([]);
    close();
  };

  const columns: DataTableColumn<IUser>[] = [
    { accessor: 'employeeCode', title: 'Mã nhân sự' },
    { accessor: 'fullName', title: 'Họ tên' },
    { accessor: 'email', title: 'Email' },
    { accessor: 'phoneNumber', title: 'Số điện thoại' },
    {
      accessor: 'status',
      title: 'Trạng thái',
      render: ({ status }) => {
        return (
          <Badge color={IUserStatusDict[status].color}>
            {IUserStatusDict[status].label}
          </Badge>
        );
      }
    },
    {
      accessor: '',
      title: '',
      textAlignment: 'center',
      render: ({ id, roles, status }) =>
        status === IUserStatus.ACTIVE ? (
          <Group position="center">
            {!roles.map((role) => role.id).includes(roleId || '') ? (
              <Button onClick={() => handleAdd(id)}>
                {userList.includes(id) ? 'Bỏ chọn' : 'Chọn'}
              </Button>
            ) : null}
          </Group>
        ) : null
    }
  ];

  const {
    data: records,
    page,
    pageSize,
    changePage
  } = usePagination({
    data: _users,
    defaultPaging: {
      page: 1,
      pageSize: 10
    }
  });

  return (
    <Stack>
      <Text fw={600}>Danh sách toàn bộ nhân sự</Text>
      <Input
        placeholder="Tìm kiếm theo tên hoặc mã nhân sự"
        onChange={(e) => setQuery(e.target.value)}
      />
      <DataTable
        minHeight={200}
        withBorder
        withColumnBorders
        striped
        highlightOnHover
        columns={columns}
        records={records}
        totalRecords={_users.length}
        page={page}
        onPageChange={changePage}
        recordsPerPage={pageSize}
        paginationText={() => null}
      />
      <Group position="right">
        <Button variant="outline" onClick={handleCancel}>
          Huỷ
        </Button>
        <Button onClick={() => handleSubmit()} disabled={userList.length === 0}>
          Xác nhận
        </Button>
      </Group>
    </Stack>
  );
};
