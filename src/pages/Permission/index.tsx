import CustomLoader from '@/components/custom/CustomLoader';
import { ROUTER } from '@/configs/router';
import { useAuthContext } from '@/hooks/context';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import usePagination from '@/hooks/use-pagination';
import { RootState } from '@/redux/reducers';
import { PermissionActions } from '@/redux/reducers/permission/permission.action';
import { IPermission } from '@/types/models/IPermission';
import { RESOURCES, SCOPES, isGrantedPermission } from '@/utils/permissions';
import { Stack, Text } from '@mantine/core';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export const Permission = () => {
  const { state } = useAuthContext();
  const { authorities } = state;
  const [_authorities, setAuthorities] = useState(authorities);

  useEffect(() => {
    setAuthorities(authorities);
  }, [authorities]);

  const dispatch = useAppDispatch();
  const { permission } = useAppSelector((state: RootState) => state.permission);

  const [_records, setRecords] = useState(permission);

  useLayoutEffect(() => {
    dispatch(PermissionActions.getAllPermission());
  }, [dispatch]);

  useEffect(() => setRecords(permission), [permission]);

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

  const columns: DataTableColumn<IPermission>[] = [
    {
      accessor: 'resourceName',
      title: 'Resource name'
    },
    {
      accessor: 'resourceCode',
      title: 'Resource code'
    },
    {
      accessor: 'name',
      title: 'Tên'
    },
    {
      accessor: 'scope',
      title: 'Scope'
    }
  ];

  if (!_authorities) {
    return <CustomLoader />;
  }

  if (!isGrantedPermission(_authorities, RESOURCES.PERMISSION, SCOPES.VIEW)) {
    return <Navigate to={ROUTER.UNAUTHORIZE} />;
  }

  return (
    <Stack>
      <Text fw={600} size={'lg'}>
        Danh sách quyền
      </Text>
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
  );
};
