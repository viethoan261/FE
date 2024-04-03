import { IAttendance } from '@/types/models/IAttendance';
import { Stack } from '@mantine/core';
import { DataTable, DataTableColumn } from 'mantine-datatable';

export const MyAttendance = () => {
  const columns: DataTableColumn<IAttendance>[] = [
    {
      accessor: 'date',
      title: 'Ngày'
    },
    {
      accessor: 'checkin',
      title: 'Thời gian checkin'
    },
    {
      accessor: 'checkout',
      title: 'Thời gian checkout'
    },
    {
      accessor: 'note',
      title: 'Ghi chú'
    }
  ];

  return (
    <Stack>
      <DataTable
        minHeight={200}
        withBorder
        withColumnBorders
        striped
        highlightOnHover
        columns={columns}
      />
    </Stack>
  );
};
