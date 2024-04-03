import { CreateNewsPayload } from '@/configs/api/payload';
import { useAppDispatch } from '@/hooks/redux';
import { NewsActions } from '@/redux/reducers/news/news.action';
import { INewStatus } from '@/types/models/INew';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Button,
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
import { IconPaperBag, IconWorld } from '@tabler/icons-react';
import { useState } from 'react';
import { ModalSelectDepartment } from './ModalSelectDepartment';
import { useNavigate } from 'react-router-dom';
import { ROUTER } from '@/configs/router';
import { NotiType, renderNotification } from '@/utils/notifications';

export const CreateNewsPage = () => {
  const navigate = useNavigate();
  const [_isImportant, setIsImportant] = useState(false);
  const [_isPublic, setIsPublic] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(INewStatus.PUBLISHED);
  const [_userIds, setUserIds] = useState<string[]>([]);

  const form = useForm<CreateNewsPayload>({
    initialValues: {
      title: '',
      content: ''
    },
    validate: {
      title: isNotEmpty('Tiêu đề không được bỏ trống')
    },
    transformValues: (values) => ({
      ...values,
      isImportant: _isImportant,
      isPublic: _isPublic,
      employeeIds: _userIds
    })
  });

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
  const dispatch = useAppDispatch();
  const [openedSelectDepartment, { open, close }] = useDisclosure();

  const handleSubmit = (values: CreateNewsPayload, status: INewStatus) => {
    if (values.content) {
      dispatch(
        NewsActions.createNews(
          { ...values, status: status },
          {
            onSuccess: () => {
              dispatch(NewsActions.getAllNews());
              navigate(ROUTER.NEWS);
            }
          }
        )
      );
    } else {
      renderNotification(
        'Nội dung của thông báo không được để trống',
        NotiType.INFO
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
    <form
      onSubmit={form.onSubmit((values) => handleSubmit(values, selectedStatus))}
    >
      <Stack spacing={'lg'} px={'xl'}>
        <Text fw={600} fz={'lg'}>
          Tạo thông báo mới
        </Text>
        <TextInput
          label="Tiêu đề"
          placeholder="Tiêu đề"
          required
          {...form.getInputProps('title')}
        />
        <Checkbox
          checked={_isImportant}
          onChange={() => setIsImportant(!_isImportant)}
          label="Đánh dấu là quan trọng"
        />
        <Stack spacing={2}>
          <Text fw={600} fz={'sm'}>
            Nội dung <span style={{ color: 'red' }}>*</span>
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
            Xác nhận
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
            userIds={_userIds}
          />
        </Modal>
      </Stack>
    </form>
  );
};
