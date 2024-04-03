import { CreateNewsPayload } from '@/configs/api/payload';
import { ROUTER } from '@/configs/router';
import { useAppDispatch } from '@/hooks/redux';
import { NewsActions } from '@/redux/reducers/news/news.action';
import { INew, INewStatus, INewStatusDict } from '@/types/models/INew';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconChevronLeft,
  IconClock,
  IconFlag2,
  IconPaperBag,
  IconUserEdit,
  IconWorld
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import Markdown from 'markdown-to-jsx';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ModalSelectDepartment } from './ModalSelectDepartment';

export const UpdateNewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [_news, setNews] = useState<INew>();
  const [_isImportant, setIsImportant] = useState<boolean>();
  const [_isPublic, setIsPublic] = useState<boolean>();
  const [selectedStatus, setSelectedStatus] = useState(INewStatus.PUBLISHED);
  const [_userIds, setUserIds] = useState<string[]>([]);

  const form = useForm<CreateNewsPayload>({
    initialValues: {
      title: '',
      content: ''
    },
    validate: {
      title: isNotEmpty('Tiêu đề không được bỏ trống'),
      content: isNotEmpty('Nội dung không được bỏ trống')
    },
    transformValues: (values) => ({
      ...values,
      isImportant: _isImportant,
      isPublic: _isPublic,
      employeeIds: _userIds
    })
  });

  useEffect(() => {
    if (id) {
      console.log(id);
      dispatch(
        NewsActions.getDetailsNew(id, {
          onSuccess: (data: INew) => {
            setNews(data);
            form.setValues(data);
            setIsImportant(data.isImportant);
            setIsPublic(data.isPublic);
          }
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  const data = [
    {
      icon: <IconWorld />,
      label: 'Mọi người',
      value: 'isPublic'
    },
    {
      icon: <IconPaperBag />,
      label: 'Phòng ban, nhân sự cụ thể',
      value: 'isNotPublic'
    }
  ];

  const config = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        'alignment',
        'blockQuote',
        'undo',
        'redo'
      ]
    }
  };
  const [openedSelectDepartment, { open, close }] = useDisclosure();

  const handleSubmit = (values: CreateNewsPayload, status: INewStatus) => {
    if (_news?.id) {
      dispatch(
        NewsActions.updateNew(
          _news?.id,
          { ...values, status: status },
          {
            onSuccess: () => {
              dispatch(NewsActions.getAllNews());
              navigate(ROUTER.NEWS);
            }
          }
        )
      );
    }
  };

  const handleChangePublic = (value: string | null) => {
    if (value !== 'isPublic') {
      setIsPublic(false);
      open();
      return;
    }
    setIsPublic(true);
  };

  return (
    <Stack>
      {_news?.status === INewStatus.DRAFT ? (
        <form
          onSubmit={form.onSubmit((values) =>
            handleSubmit(values, selectedStatus)
          )}
        >
          <Stack spacing={'lg'} px={'xl'}>
            <Text fw={600} fz={'lg'}>
              Sửa thông báo
            </Text>
            <TextInput
              label="Tiêu đề"
              placeholder="Tiêu đề"
              {...form.getInputProps('title')}
            />
            <Checkbox
              checked={_isImportant}
              onChange={() => setIsImportant(!_isImportant)}
              label="Đánh dấu là quan trọng"
            />
            <Stack spacing={2}>
              <Text fw={600} fz={'sm'}>
                Nội dung
              </Text>
              <CKEditor
                editor={ClassicEditor}
                config={config}
                data={form.values.content}
                onChange={(_event, editor) => {
                  const data = editor.getData();
                  form.values.content = data;
                }}
              />
            </Stack>

            <Group>
              <Text fw={600} fz={'sm'}>
                Ai có thể thấy được thông báo này
              </Text>
              <Select
                data={data}
                defaultValue={'isPublic'}
                value={_isPublic ? 'isPublic' : 'isNotPublic'}
                onChange={(value) => handleChangePublic(value)}
              />
            </Group>

            <Group position="right">
              <Button
                variant="outline"
                color="gray"
                onClick={() => navigate(-1)}
              >
                Huỷ
              </Button>
              <Button
                type="submit"
                variant="outline"
                color="gray"
                onClick={() => setSelectedStatus(INewStatus.DRAFT)}
              >
                Lưu thành bản nháp
              </Button>
              <Button
                type="submit"
                onClick={() => setSelectedStatus(INewStatus.PUBLISHED)}
              >
                Lưu và Thông báo
              </Button>
            </Group>

            <Modal
              centered
              title="Gửi tới phòng ban"
              opened={openedSelectDepartment}
              onClose={() => {
                close();
                setIsPublic(true);
              }}
            >
              <ModalSelectDepartment
                close={close}
                setUserIds={setUserIds}
                userIds={[]}
              />
            </Modal>
          </Stack>
        </form>
      ) : (
        <NewsDetails news={_news} />
      )}
    </Stack>
  );
};

const NewsDetails: React.FC<{ news: INew | undefined }> = ({ news }) => {
  const navigate = useNavigate();

  return news ? (
    <Stack px="xl">
      <Group
        spacing={2}
        sx={{ cursor: 'pointer' }}
        onClick={() => navigate(-1)}
      >
        <IconChevronLeft size={'1rem'} />
        <Text>Quay lại</Text>
      </Group>
      <Card withBorder shadow="xs" radius={'xs'}>
        <Group spacing={2}>
          {news.isImportant ? <IconFlag2 color="red" /> : null}
          <Text fw={600} fz={'lg'}>
            {news.title}
          </Text>
        </Group>
        <Group align="center" mt={'md'}>
          <Badge
            radius={'sm'}
            color={INewStatusDict[news.status].color}
            size="lg"
          >
            {INewStatusDict[news.status].label}
          </Badge>
          <Group spacing={'xs'} align="center">
            <IconClock size={'0.8em'} />
            <Text color="dimmed" fz={'sm'}>
              {news.updatedAt
                ? dayjs(news.updatedAt).format('hh:mm - DD MMM').toString()
                : dayjs(news.createdAt).format('hh:mm - DD MMM').toString()}
            </Text>
          </Group>
          <Group spacing={'xs'}>
            <IconUserEdit size={'1em'} />
            <Text color="dimmed">{news.authorName}</Text>
          </Group>
        </Group>
        <Text>
          <Markdown>{news.content}</Markdown>
        </Text>
      </Card>
    </Stack>
  ) : null;
};
