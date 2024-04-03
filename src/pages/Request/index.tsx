import CustomLoader from '@/components/custom/CustomLoader';
import { ROUTER } from '@/configs/router';
import { useAuthContext } from '@/hooks/context';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import usePagination from '@/hooks/use-pagination';
import { RootState } from '@/redux/reducers';
import { TimeoffActions } from '@/redux/reducers/timeoff/timeoff.action';
import {
  IRequest,
  IRequestStatus,
  IRequestStatusDict,
  IRequestType,
  IRequestTypeDict
} from '@/types/models/IRequest';
import { RESOURCES, SCOPES, isGrantedPermission } from '@/utils/permissions';
import {
  Badge,
  Button,
  Center,
  Group,
  Select,
  Stack,
  Text,
  Tooltip
} from '@mantine/core';
import { DateInput, DateValue } from '@mantine/dates';
import { modals } from '@mantine/modals';
import {
  IconBarrierBlock,
  IconCalendar,
  IconChevronDown,
  IconDownload,
  IconFileLike
} from '@tabler/icons-react';

import dayjs from 'dayjs';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export const Requests = () => {
  const { state } = useAuthContext();
  const { authorities } = state;
  const [_authorities, setAuthorities] = useState(authorities);

  useEffect(() => {
    setAuthorities(authorities);
  }, [authorities]);

  const dispatch = useAppDispatch();
  const { allRequests } = useAppSelector((state: RootState) => state.timeoff);
  const [_allRequest, setAllRequest] = useState<IRequest[]>(allRequests);

  const [_startDate, setStartDate] = useState<DateValue | null>(null);
  const [_endDate, setEndDate] = useState<DateValue | null>(null);
  const [_requestType, setRequestType] = useState<IRequestType>(
    IRequestType.ALL
  );
  const [_requestStatus, setRequestStatus] = useState<IRequestStatus>(
    IRequestStatus.ALL
  );

  const getAllRequests = useCallback(() => {
    dispatch(TimeoffActions.getAllRequest());
  }, [dispatch]);

  useEffect(() => {
    getAllRequests();
  }, [getAllRequests]);

  useEffect(() => setAllRequest(allRequests), [allRequests]);

  useEffect(() => {
    const filteredData = allRequests.filter((request: IRequest) => {
      const isDateInRange =
        (!_startDate || dayjs(request.dateFrom).toDate() >= _startDate) &&
        (!_endDate || dayjs(request.dateTo).toDate() <= _endDate);

      const isTypeMatched =
        _requestType === IRequestType.ALL || request.type === _requestType;

      const isStatusMatched =
        _requestStatus === IRequestStatus.ALL ||
        request.status === _requestStatus;

      return isDateInRange && isTypeMatched && isStatusMatched;
    });
    setAllRequest(filteredData);
  }, [allRequests, _startDate, _endDate, _requestType, _requestStatus]);

  const handleChangeRequestStatus = (
    id: string | undefined,
    status: IRequestStatus
  ) => {
    dispatch(
      TimeoffActions.changeStatus(id, status, {
        onSuccess: () => dispatch(TimeoffActions.getAllRequest())
      })
    );
  };

  const handleDownloadFile = (url: string | undefined) => {
    if (url) {
      // Create a new XHR object
      const lastSlashIndex = url.lastIndexOf('/');
      const fileNameWithToken = url.substring(lastSlashIndex + 1);
      const questionMarkIndex = fileNameWithToken.indexOf('?');
      const fileName = fileNameWithToken.substring(0, questionMarkIndex);

      // Extract the extension from the file name
      const lastDotIndex = fileName.lastIndexOf('.');
      const extension = fileName.substring(lastDotIndex + 1);
      console.log(extension);
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      // Define the onload event handler
      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = xhr.response;
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = `Minh_chứng./${extension}`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        } else {
          console.error('File download failed:', xhr.statusText);
        }
      };
      xhr.onerror = () => {
        console.error('File download failed:', xhr.statusText);
      };
      xhr.open('GET', url);
      xhr.send();
    } else {
      console.error(
        'Could not determine the file extension from the URL:',
        url
      );
    }
  };

  const openAcceptModal = (id: string) =>
    modals.openConfirmModal({
      title: 'Chấn nhập yêu cầu nghỉ phép',
      labels: { confirm: 'Xác nhận', cancel: 'Huỷ' },
      // onCancel: () => {}
      onConfirm: () => {
        handleChangeRequestStatus(id, IRequestStatus.APPROVED);
      }
    });

  const openRejectModal = (id: string) =>
    modals.openConfirmModal({
      title: 'Từ chối yêu cầu nghỉ phép',
      labels: { confirm: 'Xác nhận', cancel: 'Huỷ' },
      // onCancel: () => {}
      onConfirm: () => {
        handleChangeRequestStatus(id, IRequestStatus.REJECTED);
      }
    });

  const {
    data: records,
    page,
    pageSize,
    changePage
  } = usePagination({
    data: _allRequest,
    defaultPaging: {
      page: 1,
      pageSize: 5
    }
  });

  const columns: DataTableColumn<IRequest>[] = [
    {
      accessor: 'employeeName',
      title: 'Người gửi'
    },
    {
      accessor: 'dateFrom',
      title: 'Từ'
    },
    {
      accessor: 'dateTo',
      title: 'Tới'
    },
    {
      accessor: 'dayOff',
      title: 'Tổng'
    },
    {
      accessor: 'type',
      title: 'Loại',
      render: ({ type }) => {
        return <Text>{IRequestTypeDict[type].label}</Text>;
      }
    },
    {
      accessor: 'fileId',
      title: 'Đính kèm',
      textAlignment: 'center',
      render: ({ fileId }) => {
        return fileId ? (
          <Button
            variant="outline"
            leftIcon={<IconDownload size={'1rem'} />}
            size="xs"
            onClick={() => handleDownloadFile(fileId)}
          >
            Tải xuống
          </Button>
        ) : null;
      }
    },
    {
      accessor: 'status',
      title: 'Trạng thái',
      render: (record) => {
        return (
          <Badge color={IRequestStatusDict[record.status].color}>
            {IRequestStatusDict[record.status].label}
          </Badge>
        );
      }
    },
    {
      accessor: '',
      render: (record) => {
        return record.status == IRequestStatus.PENDING ? (
          <Center>
            <Group align="center">
              <Tooltip label="Chấp thuận">
                <IconFileLike
                  cursor={'pointer'}
                  size={'1.2rem'}
                  onClick={() => openAcceptModal(record.id)}
                />
              </Tooltip>
              <Tooltip label="Từ chối">
                <IconBarrierBlock
                  cursor={'pointer'}
                  size={'1.2rem'}
                  onClick={() => openRejectModal(record.id)}
                />
              </Tooltip>
            </Group>
          </Center>
        ) : null;
      }
    }
  ];

  const TypeSelectData = Object.values(IRequestType);
  const StatusSelectData = Object.values(IRequestStatus);

  if (!_authorities) {
    return <CustomLoader />;
  }

  if (!isGrantedPermission(_authorities, RESOURCES.TIMEOFF, SCOPES.VIEW)) {
    return <Navigate to={ROUTER.UNAUTHORIZE} />;
  }

  return (
    <Stack spacing={'md'}>
      <Group>
        <Text fw={600} fz={'lg'}>
          Danh sách xin nghỉ phép
        </Text>
      </Group>
      <Group align="end" position="left">
        <DateInput
          clearable
          label="Từ"
          rightSection={<IconCalendar size="0.9rem" color="blue" />}
          value={_startDate}
          onChange={setStartDate}
        />
        <DateInput
          clearable
          label="Đến"
          rightSection={<IconCalendar size="0.9rem" color="blue" />}
          value={_endDate}
          onChange={setEndDate}
          minDate={_startDate || new Date()}
        />
        <Select
          label="Loại"
          data={TypeSelectData.map((type) => ({
            value: type,
            label: IRequestTypeDict[type].label
          }))}
          value={_requestType}
          onChange={(value: string | null) =>
            setRequestType(value as IRequestType)
          }
          rightSection={<IconChevronDown size="1rem" color="blue" />}
          styles={{ rightSection: { pointerEvents: 'none' } }}
          w={'150px'}
        />
        <Select
          label="Trạng thái"
          data={StatusSelectData.map((status) => ({
            value: status,
            label: IRequestStatusDict[status].label
          }))}
          value={_requestStatus}
          onChange={(value: string | null) =>
            setRequestStatus(value as IRequestStatus)
          }
          rightSection={<IconChevronDown size="1rem" color="blue" />}
          styles={{ rightSection: { pointerEvents: 'none' } }}
        />
      </Group>

      <DataTable
        minHeight={300}
        striped
        highlightOnHover
        withBorder
        withColumnBorders
        columns={columns}
        records={records}
        totalRecords={_allRequest?.length}
        page={page}
        onPageChange={changePage}
        recordsPerPage={pageSize}
        paginationText={() => null}
      />
    </Stack>
  );
};
