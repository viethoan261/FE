import CustomLoader from '@/components/custom/CustomLoader';
import { ROUTER } from '@/configs/router';
import { useAuthContext } from '@/hooks/context';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import usePagination from '@/hooks/use-pagination';
import { RootState } from '@/redux/reducers';
import { RoleActions } from '@/redux/reducers/role/role.action';
import { IRole, IRoleStatus } from '@/types/models/IRole';
import { removeVietnameseandLowercase } from '@/utils/helpers';
import { RESOURCES, SCOPES, isGrantedPermission } from '@/utils/permissions';
import {
  Button,
  Group,
  Input,
  Modal,
  Stack,
  Text,
  Tooltip
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import {
  IconBrandPowershell,
  IconInfoCircle,
  IconTrash
} from '@tabler/icons-react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ModalAddRole } from './components/ModalAddRole';
import { ModalAssignPermission } from './components/ModalAssignPermission';

export const Role = () => {
  const { state } = useAuthContext();
  const { authorities } = state;
  const [_authorities, setAuthorities] = useState(authorities);

  useEffect(() => {
    setAuthorities(authorities);
  }, [authorities]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { roles } = useAppSelector((state: RootState) => state.role);
  const [_records, setRecords] = useState(roles);
  const [_selectedRecord, setSelectedRecord] = useState<IRole | null>(null);

  const [openedAddModal, { close: closeAddModal, open: openAddModal }] =
    useDisclosure();
  // const [
  //   openedUpdateModal,
  //   { close: closeUpdateModal, open: openUpdateModal }
  // ] = useDisclosure();
  const [
    openedAssignModal,
    { close: closeAssignModal, open: openAssignModal }
  ] = useDisclosure();

  useLayoutEffect(() => {
    dispatch(RoleActions.getAllRole());
  }, [dispatch]);

  const [query, setQuery] = useState('');
  const [debounceQuery] = useDebouncedValue(query, 200);

  useEffect(() => {
    setRecords(
      roles.filter((role) => {
        if (debounceQuery !== '') {
          if (
            removeVietnameseandLowercase(role.name).includes(
              removeVietnameseandLowercase(debounceQuery)
            ) ||
            removeVietnameseandLowercase(role.code).includes(
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
  }, [roles, debounceQuery]);

  const {
    data: records,
    page,
    pageSize,
    changePage
  } = usePagination({
    data: _records,
    defaultPaging: {
      page: 1,
      pageSize: 10
    }
  });

  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    modals.openConfirmModal({
      title: 'Xác nhận xoá vai trò',
      labels: { confirm: 'Xác nhận', cancel: 'Huỷ' },
      onConfirm: () => {
        dispatch(
          RoleActions.deleteStatus(id, {
            onSuccess: () => dispatch(RoleActions.getAllRole())
          })
        );
      }
    });
  };

  // const handleToggleStatus = (id: string | undefined) => {
  //   if (!id) return;
  //   dispatch(
  //     RoleActions.toggleStatus(id, {
  //       onSuccess: () => dispatch(RoleActions.getAllRole())
  //     })
  //   );
  // };

  // const handleUpdate = (role: IRole) => {
  //   setSelectedRecord(role);
  //   openUpdateModal();
  // };

  const handleAssign = (role: IRole) => {
    setSelectedRecord(role);
    openAssignModal();
  };

  const columns: DataTableColumn<IRole>[] = [
    { accessor: 'code', title: 'Mã' },
    { accessor: 'name', title: 'Tên' },
    { accessor: 'description', title: 'Mô tả' },
    // {
    //   accessor: 'status',
    //   title: 'Trạng thái',
    //   render: ({ status }) => {
    //     return (
    //       <Badge color={IRoleStatusDict[status].color}>
    //         {IRoleStatusDict[status].label}
    //       </Badge>
    //     );
    //   }
    // },
    {
      accessor: '',
      title: '',
      render: (role: IRole) => {
        return (
          <Group position="center">
            <Tooltip label="Chi tiết">
              <IconInfoCircle
                size={'1rem'}
                cursor={'pointer'}
                onClick={() => navigate(`${ROUTER.ROLE}/${role.id}`)}
              />
            </Tooltip>
            {/* {isGrantedPermission(
              _authorities,
              RESOURCES.ROLE,
              SCOPES.UPDATE
            ) && (
              <Tooltip label="Thay đổi trạng thái">
                <IconStatusChange
                  size={'1rem'}
                  cursor={'pointer'}
                  onClick={() => handleToggleStatus(role.id)}
                />
              </Tooltip>
            )} */}
            {role.status === IRoleStatus.ACTIVE ? (
              <Group>
                {isGrantedPermission(
                  _authorities,
                  RESOURCES.ROLE,
                  SCOPES.DELETE
                ) && (
                  <Tooltip label="Xoá">
                    <IconTrash
                      cursor={'pointer'}
                      size={'1rem'}
                      onClick={() => handleDelete(role.id)}
                    />
                  </Tooltip>
                )}
                {isGrantedPermission(
                  _authorities,
                  RESOURCES.PERMISSION,
                  SCOPES.VIEW
                ) && (
                  <Tooltip label="Cập nhật phân quyền">
                    <IconBrandPowershell
                      size={'1rem'}
                      onClick={() => handleAssign(role)}
                    />
                  </Tooltip>
                )}
              </Group>
            ) : null}
          </Group>
        );
      }
    }
  ];

  if (!_authorities) {
    return <CustomLoader />;
  }

  if (!isGrantedPermission(_authorities, RESOURCES.ROLE, SCOPES.VIEW)) {
    return <Navigate to={ROUTER.UNAUTHORIZE} />;
  }

  return (
    <>
      <Stack>
        <Text fw={600} size={'lg'}>
          Danh sách vai trò
        </Text>
        <Group position="apart">
          <Input
            placeholder="Tìm theo tên vai trò hoặc mã"
            miw={300}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
          {isGrantedPermission(_authorities, RESOURCES.ROLE, SCOPES.CREATE) && (
            <Button onClick={openAddModal}>Thêm mới</Button>
          )}
        </Group>
        <DataTable
          minHeight={200}
          withBorder
          striped
          withColumnBorders
          highlightOnHover
          columns={columns}
          records={records}
          totalRecords={_records.length}
          page={page}
          onPageChange={changePage}
          recordsPerPage={pageSize}
          paginationText={() => null}
        />
      </Stack>
      <Modal
        centered
        title="Thêm vai trò"
        opened={openedAddModal}
        onClose={closeAddModal}
      >
        <ModalAddRole close={closeAddModal} />
      </Modal>

      <Modal
        centered
        title={`Phân quyền cho vai trò ${_selectedRecord?.name}`}
        opened={openedAssignModal}
        onClose={closeAssignModal}
        size={'xl'}
      >
        <ModalAssignPermission
          close={closeAssignModal}
          role={_selectedRecord}
        />
      </Modal>
    </>
  );
};
