/* eslint-disable react-hooks/exhaustive-deps */
import CustomLoader from '@/components/custom/CustomLoader';
import { UpdateDepartmentPayload } from '@/configs/api/payload';
import { ROUTER } from '@/configs/router';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import usePagination from '@/hooks/use-pagination';
import { RootState } from '@/redux/reducers';
import { DepartmentActions } from '@/redux/reducers/department/department.action';
import { UserActions } from '@/redux/reducers/user/user.action';
import { IDepartment } from '@/types/models/IDepartment';
import { IUser, IUserGenderDict, IUserStatusDict } from '@/types/models/IUser';
import { NotiType, renderNotification } from '@/utils/notifications';
import {
  Badge,
  Button,
  Grid,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconChevronLeft,
  IconEdit,
  IconInfoCircle,
  IconLayoutGridRemove,
  IconUserPlus
} from '@tabler/icons-react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ModalAdduser } from './components/ModalAddUser';
import { useAuthContext } from '@/hooks/context';
import { RESOURCES, SCOPES, isGrantedPermission } from '@/utils/permissions';

export const DepartmentDetails = () => {
  const { state } = useAuthContext();
  const { authorities } = state;
  const [_authorities, setAuthorities] = useState(authorities);

  useEffect(() => {
    setAuthorities(authorities);
  }, [authorities]);

  const isGrantedUpdatePermission = isGrantedPermission(
    _authorities,
    RESOURCES.DEPARTMENT,
    SCOPES.UPDATE
  );

  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { departments } = useAppSelector(
    (state: RootState) => state.department
  );
  const [allDepartments, setAllDepartments] =
    useState<IDepartment[]>(departments);

  const getAllDepartments = useCallback(() => {
    dispatch(
      DepartmentActions.getAllDepartment({
        onSuccess: (data: IDepartment[]) => setAllDepartments(data)
      })
    );
  }, [dispatch]);

  useEffect(() => {
    getAllDepartments();
  }, []);

  const [_department, setDepartment] = useState<IDepartment>();
  const [_isEditing, setIsEditing] = useState<boolean>(false);

  const form = useForm<UpdateDepartmentPayload>({
    validate: {
      name: isNotEmpty('Không được để trống'),
      description: isNotEmpty('Không được để trống')
    }
  });

  const getDepartmentDetails = useCallback(() => {
    dispatch(
      DepartmentActions.getDetailsDepartment(id, {
        onSuccess: (data: IDepartment) => setDepartment(data)
      })
    );
  }, [dispatch, id]);

  useEffect(() => {
    getDepartmentDetails();
  }, [dispatch, id]);

  useEffect(() => {
    form.setValues({
      ...form.values,
      name: _department?.name,
      description: _department?.description,
      parentId: _department?.parentId
    });
  }, [_department]);

  const handleCancel = () => {
    if (_department) {
      form.setValues(_department);
    }
    setIsEditing(false);
  };

  const isDirtyForm = () => {
    const fieldsToCheck: (keyof UpdateDepartmentPayload)[] = [
      'description',
      'name',
      'parentId'
    ];

    for (const field of fieldsToCheck) {
      if (form.values[field] !== _department?.[field]) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = (values: UpdateDepartmentPayload) => {
    if (!_isEditing) {
      console.log('Editing');
      setIsEditing(true);
    } else {
      if (isDirtyForm()) {
        dispatch(
          DepartmentActions.updateDepartment(values, _department?.id, {
            onSuccess: () => {
              dispatch(
                DepartmentActions.getDetailsDepartment(id, {
                  onSuccess: (data: IDepartment) => {
                    setDepartment(data);
                    getAllDepartments();
                  }
                })
              );
            },
            onError: () => {
              handleCancel();
              setIsEditing(false);
            }
          })
        );
      } else {
        renderNotification('Bạn chưa thay đổi thông tin', NotiType.ERROR);
      }
      setIsEditing(false);
    }
  };

  const {
    data: records,
    page,
    pageSize,
    changePage
  } = usePagination({
    data: _department?.users || [],
    defaultPaging: {
      page: 1,
      pageSize: 10
    }
  });

  const navigate = useNavigate();

  const columns: DataTableColumn<IUser>[] = [
    { accessor: 'employeeCode', title: 'Mã nhân sự' },
    { accessor: 'fullName', title: 'Họ tên' },
    { accessor: 'email', title: 'Email' },
    { accessor: 'phoneNumber', title: 'Số điện thoại' },
    { accessor: 'dayOfBirth', title: 'Ngày sinh' },
    {
      accessor: 'gender',
      title: 'Giới tính',
      render: ({ gender }) => {
        return IUserGenderDict[gender].label;
      }
    },
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
      render: ({ id }) => (
        <Group position="center">
          <Tooltip label="Xem chi tiết">
            <IconInfoCircle
              cursor={'pointer'}
              size={'1rem'}
              onClick={() => navigate(`${ROUTER.USER}/${id}`)}
            />
          </Tooltip>
          {isGrantedUpdatePermission && (
            <Tooltip label="Xoá khỏi phòng ban">
              <IconLayoutGridRemove
                cursor={'pointer'}
                size={'1rem'}
                onClick={() => {
                  dispatch(
                    DepartmentActions.removeUser(id, _department?.id, {
                      onSuccess: () => {
                        getDepartmentDetails();
                        dispatch(UserActions.getAllUser());
                      }
                    })
                  );
                }}
              />
            </Tooltip>
          )}
        </Group>
      )
    }
  ];

  const [opened, { close, open }] = useDisclosure();

  return (
    <Stack>
      <Group position="apart">
        <Group spacing={'xs'}>
          <IconChevronLeft onClick={() => navigate(-1)} cursor={'pointer'} />
          <Text fw={600} size={'lg'}>
            Thông tin phòng ban
          </Text>
        </Group>
        {isGrantedUpdatePermission && (
          <Group>
            {_isEditing ? (
              <Button onClick={handleCancel} variant="outline">
                Huỷ
              </Button>
            ) : null}
            <Button
              leftIcon={<IconEdit size={'1rem'} />}
              type={'submit'}
              form={`update-department-form-${_department?.id}`}
            >
              {_isEditing ? 'Lưu thông tin' : 'Sửa thông tin'}
            </Button>
          </Group>
        )}
      </Group>
      {!_department || !allDepartments ? (
        <CustomLoader />
      ) : (
        <form
          id={`update-department-form-${_department?.id}`}
          onSubmit={form.onSubmit(
            (values) => handleSubmit(values),
            (err) => console.log(err)
          )}
        >
          <Grid gutter={'md'}>
            <Grid.Col span={4}>
              {renderLabelandValue('Mã phòng ban', _department?.code)}
            </Grid.Col>
            <Grid.Col span={4}>
              {_isEditing ? (
                <TextInput
                  label="Tên phòng ban"
                  placeholder="Nhập tên phòng ban"
                  {...form.getInputProps('name')}
                />
              ) : (
                renderLabelandValue('Tên phòng ban', _department?.name)
              )}
            </Grid.Col>
            <Grid.Col span={4}>
              {_isEditing ? (
                <Select
                  data={allDepartments.map((item: IDepartment) => ({
                    value: item.id,
                    label: item.name
                  }))}
                  label="Phòng ban cha"
                  placeholder="Chọn phòng ban cha"
                  {...form.getInputProps('parentId')}
                />
              ) : (
                renderLabelandValue(
                  'Phòng ban cha',
                  allDepartments.find(
                    (item: IDepartment) => item.id === _department?.parentId
                  )?.name
                )
              )}
            </Grid.Col>
            <Grid.Col span={12}>
              {_isEditing ? (
                <TextInput
                  withAsterisk
                  label="Mô tả"
                  placeholder="Nhập mô tả"
                  {...form.getInputProps('description')}
                />
              ) : (
                renderLabelandValue('Mô tả', _department.description)
              )}
            </Grid.Col>
          </Grid>
        </form>
      )}
      <Group position="apart">
        <Text fw={600} size={'lg'}>
          Danh sách nhân sự
        </Text>
        {isGrantedUpdatePermission && (
          <Button
            hidden={true}
            leftIcon={<IconUserPlus size={'1rem'} />}
            onClick={open}
          >
            Thêm nhân sự
          </Button>
        )}
      </Group>
      <DataTable
        minHeight={200}
        withBorder
        withColumnBorders
        striped
        highlightOnHover
        columns={columns}
        records={records}
        totalRecords={_department?.users?.length}
        page={page}
        onPageChange={changePage}
        recordsPerPage={pageSize}
        paginationText={() => null}
      />
      <Modal
        title="Thêm nhân sự vào phòng ban"
        centered
        opened={opened}
        onClose={close}
        size={'1000px'}
      >
        <ModalAdduser
          departmentId={_department?.id}
          close={close}
          getDepartmentDetails={getDepartmentDetails}
        />
      </Modal>
    </Stack>
  );
};

const renderLabelandValue = (label: string, value: string | undefined) => {
  return (
    <Stack spacing={'3px'}>
      <Text fw={600} mr={'md'}>
        {label}:
      </Text>
      <Text color="dimmed">{value}</Text>
    </Stack>
  );
};
