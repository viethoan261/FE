import { useCallApi } from '@/configs/api';
import { API_URLS } from '@/configs/api/endpoint';
import usePagination from '@/hooks/use-pagination';
import { ISession } from '@/types/models/ISession';
import { Stack, Text } from '@mantine/core';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useState } from 'react';

export const Session = () => {
  const [allSession, setAllSession] = useState<ISession[]>([]);

  const getSession = async () => {
    const api = API_URLS.Session.getAll();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { response, error } = await useCallApi({ ...api });
    if (!error && response) {
      console.log(response.data.data);
      setAllSession(response.data.data);
    }
  };
  useEffect(() => {
    getSession();
  }, []);

  function formatDate(timestamp: string) {
    const date = new Date(timestamp);

    // Extract date components
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Months are zero-based, so add 1
    const year = date.getUTCFullYear();

    // Format time components
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds() + 8).padStart(2, '0'); // Adding 8 seconds to match the provided time
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    // Create month names mapping
    const monthNames = [
      'Th01',
      'Th02',
      'Th03',
      'Th04',
      'Th05',
      'Th06',
      'Th07',
      'Th08',
      'Th09',
      'Th10',
      'Th11',
      'Th12'
    ];

    // Create the final formatted date string
    const formattedDate = `${formattedTime} ngày ${day} ${
      monthNames[month - 1]
    } ${year}`;

    return formattedDate;
  }

  const columns: DataTableColumn<ISession>[] = [
    {
      accessor: 'username',
      title: 'Tên tài khoản'
    },
    {
      title: 'Lần cuối đăng nhập',
      accessor: 'lastActivityTime',
      render: ({ lastActivityTime }) => {
        return <Text>{formatDate(lastActivityTime)}</Text>;
      }
    }
  ];
  const {
    data: records,
    page,
    pageSize,
    changePage
  } = usePagination({
    data: allSession,
    defaultPaging: {
      page: 1,
      pageSize: 10
    }
  });

  return (
    <Stack>
      <Text fw={600} size={'lg'}>
        Lịch sử đăng nhập
      </Text>
      <DataTable
        minHeight={200}
        withBorder
        striped
        withColumnBorders
        highlightOnHover
        columns={columns}
        records={records}
        totalRecords={allSession.length}
        page={page}
        onPageChange={changePage}
        recordsPerPage={pageSize}
        paginationText={() => null}
      />
    </Stack>
  );
};
