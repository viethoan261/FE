import { RequestTimeoffPayload } from '@/configs/api/payload';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import usePagination from '@/hooks/use-pagination';
import { useUploadFirebase } from '@/hooks/use-upload-firebase';
import { RootState } from '@/redux/reducers';
import { TimeoffActions } from '@/redux/reducers/timeoff/timeoff.action';
import {
  IRequest,
  IRequestStatus,
  IRequestStatusDict,
  IRequestType,
  IRequestTypeDict
} from '@/types/models/IRequest';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  FileInput,
  Grid,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useMantineTheme
} from '@mantine/core';
import { DateInput, DateValue, TimeInput } from '@mantine/dates';
import { FileWithPath } from '@mantine/dropzone';
import { isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconArticle,
  IconCalendar,
  IconChevronDown,
  IconClock,
  IconDownload,
  IconFileUpload,
  IconNewSection,
  IconNote,
  IconPaperclip,
  IconPlane,
  IconUserCancel
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface MyRequestsProps {
  triggerBalanceHistory: () => void;
}

export const MyRequests = ({ triggerBalanceHistory }: MyRequestsProps) => {
  const theme = useMantineTheme();
  const dispatch = useAppDispatch();
  const { myRequests } = useAppSelector((state: RootState) => state.timeoff);
  const [_myRequest, setMyRequest] = useState<IRequest[]>(myRequests);

  const [_startDate, setStartDate] = useState<DateValue | null>(null);
  const [_endDate, setEndDate] = useState<DateValue | null>(null);
  const [_requestType, setRequestType] = useState<IRequestType>(
    IRequestType.ALL
  );
  const [_requestStatus, setRequestStatus] = useState<IRequestStatus>(
    IRequestStatus.ALL
  );

  const getMyRequests = useCallback(() => {
    dispatch(TimeoffActions.getMyRequest());
  }, [dispatch]);

  useEffect(() => {
    getMyRequests();
  }, [getMyRequests]);

  useEffect(() => setMyRequest(myRequests), [myRequests]);

  useEffect(() => {
    const filteredData = myRequests.filter((request: IRequest) => {
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
    setMyRequest(filteredData);
  }, [myRequests, _startDate, _endDate, _requestType, _requestStatus]);

  const handleChangeRequestStatus = (
    id: string | undefined,
    status: IRequestStatus
  ) => {
    dispatch(
      TimeoffActions.changeStatus(id, status, {
        onSuccess: () => dispatch(TimeoffActions.getMyRequest())
      })
    );
  };

  const {
    data: records,
    page,
    pageSize,
    changePage
  } = usePagination({
    data: _myRequest,
    defaultPaging: {
      page: 1,
      pageSize: 5
    }
  });

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

  const columns: DataTableColumn<IRequest>[] = [
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
        return (
          <Group>
            {record.fileId ? null : <IconFileUpload size={'1rem'} />}
            {record.status === IRequestStatus.PENDING ? (
              <Tooltip label="Huỷ yêu cầu">
                <IconUserCancel
                  size={'1rem'}
                  cursor={'pointer'}
                  onClick={() =>
                    handleChangeRequestStatus(
                      record.id,
                      IRequestStatus.CANCELLED
                    )
                  }
                />
              </Tooltip>
            ) : null}
          </Group>
        );
      }
    }
  ];

  const TypeSelectData = Object.values(IRequestType);
  const StatusSelectData = Object.values(IRequestStatus);
  const [openned, { close, open }] = useDisclosure();

  return (
    <>
      <Card withBorder p={'xl'} shadow={'xs'} bg={'gray.1'}>
        <Group spacing={'xs'} mb={'lg'}>
          <IconArticle
            size={'2rem'}
            style={{
              background: `${theme.colors.blue[7]}`,
              borderRadius: '50%',
              padding: '5px'
            }}
            color="white"
          />
          <Text fw={600} fz={'lg'}>
            Yêu cầu cá nhân
          </Text>
        </Group>

        <Group align="end" position="apart" mb={'lg'}>
          <Group>
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
          <Button leftIcon={<IconNewSection size={'1rem'} />} onClick={open}>
            Tạo yêu cầu
          </Button>
        </Group>

        <DataTable
          minHeight={300}
          striped
          highlightOnHover
          columns={columns}
          records={records}
          totalRecords={_myRequest?.length}
          page={page}
          onPageChange={changePage}
          recordsPerPage={pageSize}
          paginationText={() => null}
        />
      </Card>

      <Modal
        title={<Text>Tạo yêu cầu</Text>}
        centered
        opened={openned}
        onClose={close}
        size={'1000px'}
      >
        <ModalAddRequest
          close={close}
          triggerBalanceHistory={triggerBalanceHistory}
        />
      </Modal>
    </>
  );
};

interface Props {
  close: () => void;
  triggerBalanceHistory: () => void;
}

export const ModalAddRequest = ({ close, triggerBalanceHistory }: Props) => {
  const [_isSingleDay, setIsSingleDay] = useState(true);
  const [_dateFrom, setDateFrom] = useState<DateValue>();
  const [_dateTo, setDateTo] = useState<DateValue>();
  const [_start, setStart] = useState(0);
  const [_end, setEnd] = useState(0);
  const [, setPreviewImage] = useState<FileWithPath>();
  const [isLoadingUpload, , handleUploadImageOnFirebase] = useUploadFirebase();
  const form = useForm<RequestTimeoffPayload>({
    initialValues: {
      type: '',
      dateFrom: '',
      dateTo: '',
      note: '',
      fileId: '',
      start: 0,
      end: 0,
      dayOff: 0
    },
    validate: {
      type: isNotEmpty('Vui lòng lựa chọn loại yêu cầu')
      // dateFrom: isNotEmpty('Thời gian bắt đầu không được bỏ trống'),
      // dateTo: isNotEmpty('Thời gian kết thúc không được bỏ trống')
    }
  });

  const calculateDayoff = () => {
    if (_isSingleDay) {
      return Number(((_end - _start) / (8 * 60 * 60)).toFixed(2));
    } else {
      return dayjs(_dateTo).diff(_dateFrom, 'day') + 1;
    }
  };

  const handleChangeDateFrom = (value: DateValue) => {
    setDateFrom(value);
    form.values.dateFrom = dayjs(value).format('YYYY-MM-DD').toString();
  };
  const handleChangeDateTo = (value: DateValue) => {
    setDateTo(value);
    form.values.dateTo = dayjs(value).format('YYYY-MM-DD').toString();
  };

  const renderMultiDaysSelect = () => {
    return (
      <Stack>
        <Group spacing={'xl'}>
          <Group>
            <Text w={30}>Từ</Text>
            <DateInput
              rightSection={<IconCalendar size="0.9rem" color="blue" />}
              onChange={(value) => {
                handleChangeDateFrom(value);
              }}
              minDate={new Date()}
              size={'sm'}
              excludeDate={(date) => date.getDay() === 0 || date.getDay() === 6}
            />
          </Group>
          <Group>
            <Text w={30}>Đến</Text>
            <DateInput
              disabled={!_dateFrom}
              rightSection={<IconCalendar size="0.9rem" color="blue" />}
              onChange={(value) => handleChangeDateTo(value)}
              minDate={dayjs(_dateFrom).add(0, 'day').toDate()}
              excludeDate={(date) => date.getDay() === 0 || date.getDay() === 6}
            />
          </Group>
        </Group>
        <Group>
          {_dateTo &&
          _dateFrom &&
          dayjs(_dateTo).diff(_dateFrom, 'day') + 1 > 0 ? (
            <Text>
              {`Tổng thời gian: ${
                dayjs(_dateTo).diff(_dateFrom, 'day') + 1
              } ngày`}
            </Text>
          ) : null}
        </Group>
      </Stack>
    );
  };

  const refStart = useRef<HTMLInputElement>(null);
  const refEnd = useRef<HTMLInputElement>(null);

  const combineDateAndTime = (date: string, time: string) => {
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);

    const combinedDate = new Date(year, month - 1, day, hours, minutes);
    const combinedTimeInSeconds = combinedDate.getTime() / 1000;

    return combinedTimeInSeconds;
  };

  const renderSingleDaySelect = () => {
    return (
      <Group>
        <Group>
          <DateInput
            rightSection={<IconCalendar size="0.9rem" color="blue" />}
            onChange={(value) => {
              handleChangeDateFrom(value);
              handleChangeDateTo(value);
            }}
            minDate={new Date()}
            size={'sm'}
            excludeDate={(date) => date.getDay() === 0 || date.getDay() === 6}
          />
          <TimeInput
            ref={refStart}
            rightSection={
              <ActionIcon onClick={() => refStart.current?.showPicker()}>
                <IconClock size="1rem" stroke={1.5} />
              </ActionIcon>
            }
            maw={400}
            onChange={(value) => {
              const time = value.currentTarget.value;
              setStart(combineDateAndTime(form.values.dateFrom, time));
              form.values.start = combineDateAndTime(
                form.values.dateFrom,
                time
              );
            }}
          />
          <Text>Tới</Text>
          <TimeInput
            ref={refEnd}
            rightSection={
              <ActionIcon onClick={() => refEnd.current?.showPicker()}>
                <IconClock size="1rem" stroke={1.5} />
              </ActionIcon>
            }
            maw={400}
            onChange={(value) => {
              const time = value.currentTarget.value;
              setEnd(combineDateAndTime(form.values.dateFrom, time));
              form.values.end = combineDateAndTime(form.values.dateFrom, time);
            }}
          />
        </Group>
      </Group>
    );
  };
  const dispatch = useAppDispatch();

  const handleSubmit = (values: RequestTimeoffPayload) => {
    dispatch(
      TimeoffActions.requestTimeoff(
        { ...values, dayOff: calculateDayoff() },
        {
          onSuccess: () => {
            dispatch(TimeoffActions.getMyRequest());
            dispatch(TimeoffActions.getBalanceHistory());
            dispatch(TimeoffActions.getMyTimeoff());
            triggerBalanceHistory();
            close();
          }
        }
      )
    );
  };

  return (
    <form
      id="request-timeoff"
      onSubmit={form.onSubmit((values) => handleSubmit(values))}
    >
      <Stack spacing={'lg'} py={'lg'}>
        <Grid align="center">
          <Col span={1}>
            <IconPlane size={'1.5rem'} />
          </Col>
          <Col span={10} offset={1}>
            <Select
              data={Object.values(IRequestType)
                .filter((type) => type !== IRequestType.ALL)
                .map((type) => ({
                  value: type,
                  label: IRequestTypeDict[type].label
                }))}
              placeholder="Chọn loại yêu cầu"
              {...form.getInputProps('type')}
            />
          </Col>
        </Grid>

        <Grid align="center">
          <Col span={1}>
            <IconClock size={'1.5rem'} />
          </Col>
          <Col span={10} offset={1}>
            <Group spacing={'lg'}>
              <Card p={'xs'}>
                <Checkbox
                  size={'sm'}
                  label="Nghỉ trong ngày"
                  labelPosition="right"
                  radius={'xl'}
                  checked={_isSingleDay}
                  onChange={() => setIsSingleDay(!_isSingleDay)}
                />
              </Card>
              <Card p={'xs'}>
                <Checkbox
                  size={'sm'}
                  label="Nghỉ dài ngày"
                  labelPosition="right"
                  radius={'xl'}
                  checked={!_isSingleDay}
                  onChange={() => setIsSingleDay(!_isSingleDay)}
                />
              </Card>
            </Group>
          </Col>
        </Grid>

        <Grid>
          <Col offset={2} span={10}>
            {!_isSingleDay ? renderMultiDaysSelect() : renderSingleDaySelect()}
          </Col>
        </Grid>

        <Grid align="center">
          <Col span={1}>
            <IconNote size={'1.5rem'} />
          </Col>
          <Col span={10} offset={1}>
            <Textarea placeholder="Ghi chú (có thể để trống)" />
          </Col>
        </Grid>

        <Grid align="center">
          <Col span={1}>
            <IconPaperclip size={'1.5rem'} />
          </Col>
          <Col span={10} offset={1}>
            <FileInput
              placeholder="Tải tệp đính kém (có thể bỏ qua)"
              onChange={(files) => {
                if (files) {
                  setPreviewImage(files);
                  handleUploadImageOnFirebase(files, {
                    onSuccess: (downloadUrl) => {
                      form.setFieldValue('fileId', downloadUrl);
                    }
                  });
                }
              }}
            />
          </Col>
        </Grid>
        <Group position="right">
          <Button
            type={'submit'}
            form="request-timeoff"
            loading={isLoadingUpload}
          >
            Tạo yêu cầu
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
