import { api } from '@/configs/api';
import { API_URLS } from '@/configs/api/endpoint';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import usePagination from '@/hooks/use-pagination';
import { RootState } from '@/redux/reducers';
import { AttendanceAction } from '@/redux/reducers/attendance/attendance.action';
import { IAttendance } from '@/types/models/IAttendance';
import { Button, Group, Stack, Text } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useLayoutEffect, useState } from 'react';

export const Attendance = () => {
  const dispatch = useAppDispatch();

  const { attendances } = useAppSelector(
    (state: RootState) => state.attendance
  );

  const [_attendance, setAttendance] = useState<IAttendance[]>(attendances);

  useLayoutEffect(() => {
    dispatch(
      AttendanceAction.getAllAttendances({
        onSuccess: (data: IAttendance[]) => setAttendance(data)
      })
    );
  }, [dispatch]);

  const columns: DataTableColumn<IAttendance>[] = [
    {
      accessor: 'employeeName',
      title: 'Tên nhân viên'
    },

    {
      accessor: 'start',
      title: 'Giờ vào làm',
      render: ({ start }) => (
        <Text>{dayjs(start).format('hh:mm - DD MMM').toString()}</Text>
      )
    },
    {
      accessor: 'end',
      title: 'Giờ tan làm',
      render: ({ end }) => (
        <Text>{dayjs(end).format('hh:mm - DD MMM').toString()}</Text>
      )
    },
    {
      accessor: 'note',
      title: 'Ghi chú'
    }
  ];

  const {
    data: records,
    page,
    pageSize,
    changePage
  } = usePagination({
    data: _attendance,
    defaultPaging: {
      page: 1,
      pageSize: 5
    }
  });

  const handleDownloadExcel = async () => {
    const url = API_URLS.Attendance.downloadExcel();
    const fileName = 'Danh_sách_chấm_công.xlsx';

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
      <Group position="apart">
        <Text fw={600} fz={'lg'}>
          Bảng chấm công
        </Text>
        <Button
          variant="outline"
          leftIcon={<IconDownload size={'1rem'} />}
          onClick={handleDownloadExcel}
        >
          Excel
        </Button>
      </Group>

      <DataTable
        minHeight={300}
        striped
        highlightOnHover
        withBorder
        withColumnBorders
        columns={columns}
        records={records}
        totalRecords={_attendance?.length}
        page={page}
        onPageChange={changePage}
        recordsPerPage={pageSize}
        paginationText={() => null}
      />
    </Stack>
  );
};
