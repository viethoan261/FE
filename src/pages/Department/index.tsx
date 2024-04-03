import CustomLoader from '@/components/custom/CustomLoader';
import { api } from '@/configs/api';
import { API_URLS } from '@/configs/api/endpoint';
import { ROUTER } from '@/configs/router';
import { useAuthContext } from '@/hooks/context';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import usePagination from '@/hooks/use-pagination';
import { RootState } from '@/redux/reducers';
import { DepartmentActions } from '@/redux/reducers/department/department.action';
import { IDepartment } from '@/types/models/IDepartment';
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
import { IconDownload, IconInfoCircle, IconTrash } from '@tabler/icons-react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ModalCreateDepartment from './components/ModalCreateDepartment';
import { removeVietnameseandLowercase } from '@/utils/helpers';

const Department: React.FC = () => {
  const { state } = useAuthContext();
  const { authorities } = state;
  const [_authorities, setAuthorities] = useState(authorities);

  useEffect(() => {
    setAuthorities(authorities);
  }, [authorities]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { departments } = useAppSelector(
    (state: RootState) => state.department
  );
  const [_records, setRecords] = useState(departments);
  // const [_selectedRecord, setSelectedRecord] = useState<IDepartment | null>(
  //   null
  // );

  const [_query, setQuery] = useState('');
  const [debounceQuery] = useDebouncedValue(_query, 200);

  useEffect(() => {
    setRecords(
      departments.filter((department) => {
        if (debounceQuery !== '') {
          if (
            removeVietnameseandLowercase(department.name).includes(
              removeVietnameseandLowercase(debounceQuery)
            ) ||
            removeVietnameseandLowercase(department.code).includes(
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
  }, [departments, debounceQuery]);

  useLayoutEffect(() => {
    dispatch(DepartmentActions.getAllDepartment());
  }, [dispatch]);

  useEffect(() => setRecords(departments), [departments]);

  const [openedAddModal, { close: closeAddModal, open: openAddModal }] =
    useDisclosure();

  const handleDelete = (department: IDepartment) => {
    modals.openConfirmModal({
      title: 'Xác nhận xoá phòng ban',
      labels: { confirm: 'Xác nhận', cancel: 'Huỷ' },
      onConfirm: () => {
        dispatch(
          DepartmentActions.deleteDepartment(department.id, {
            onSuccess: () => dispatch(DepartmentActions.getAllDepartment())
          })
        );
      }
    });
  };

  const columns: DataTableColumn<IDepartment>[] = [
    {
      accessor: 'code',
      title: 'Mã phòng'
    },
    {
      accessor: 'name',
      title: 'Tên phòng'
    },
    {
      accessor: 'description',
      title: 'Mô tả'
    },
    {
      accessor: 'parentId',
      title: 'Phòng ban cha',
      render: (record: IDepartment) => {
        const parent = departments.find((item) => item.id === record.parentId);
        return <Text>{parent?.name}</Text>;
      }
    },
    {
      accessor: '',
      title: '',
      render: (department: IDepartment) => {
        return (
          <Group position="center">
            <Tooltip label="Xem chi tiết">
              <IconInfoCircle
                cursor={'pointer'}
                size={'1rem'}
                onClick={() =>
                  navigate(`${ROUTER.DEPARTMENT}/${department.id}`)
                }
              />
            </Tooltip>
            {isGrantedPermission(
              _authorities,
              RESOURCES.DEPARTMENT,
              SCOPES.DELETE
            ) ? (
              <Tooltip label="Xoá phòng ban">
                <IconTrash
                  cursor={'pointer'}
                  size={'1rem'}
                  onClick={() => handleDelete(department)}
                />
              </Tooltip>
            ) : null}
          </Group>
        );
      }
    }
  ];

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

  if (!_authorities) {
    return <CustomLoader />;
  }

  if (!isGrantedPermission(_authorities, RESOURCES.DEPARTMENT, SCOPES.VIEW)) {
    return <Navigate to={ROUTER.UNAUTHORIZE} />;
  }

  const handleDownloadExcel = async () => {
    const url = API_URLS.Department.exportExcel();
    const fileName = 'Danh_sách_phòng_ban.xlsx';

    await api
      .get(url.endPoint, { ...url, responseType: 'blob' })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      });
  };

  return (
    <Stack>
      <Text fw={600} size={'lg'}>
        Danh sách phòng ban
      </Text>
      <Group position={'apart'}>
        <Input
          placeholder="Tìm kiếm phòng ban theo tên hoặc mã"
          miw={300}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
        <Group>
          <Button
            variant="outline"
            leftIcon={<IconDownload size={'1rem'} />}
            onClick={handleDownloadExcel}
          >
            Excel
          </Button>
          {isGrantedPermission(
            _authorities,
            RESOURCES.DEPARTMENT,
            SCOPES.CREATE
          ) && (
            <Button onClick={openAddModal} hidden>
              Thêm mới
            </Button>
          )}
        </Group>
      </Group>
      <DataTable
        minHeight={200}
        withBorder
        withColumnBorders
        striped
        highlightOnHover
        columns={columns}
        records={records}
        totalRecords={_records?.length}
        page={page}
        onPageChange={changePage}
        recordsPerPage={pageSize}
        paginationText={() => null}
      />

      <Modal
        centered
        opened={openedAddModal}
        onClose={closeAddModal}
        title="Thêm phòng ban"
      >
        <ModalCreateDepartment closeModal={closeAddModal} />
      </Modal>

      {/* <Modal
        centered
        opened={openedUpdateModal}
        onClose={closeUpdateModal}
        title="Cập nhật thông tin phòng ban"
      >
        <ModalUpdateDepartment
          closeModal={closeUpdateModal}
          department={_selectedRecord}
        />
      </Modal> */}
    </Stack>
  );
};

export default Department;
