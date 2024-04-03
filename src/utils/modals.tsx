import { Button, Center, Group, Modal, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useState } from 'react';
import Avatar from 'react-avatar-edit';
import { NotiType, renderNotification } from './notifications';
import { useUploadFirebase } from '@/hooks/use-upload-firebase';
import { FileWithPath } from '@mantine/dropzone';

interface OpenCustomConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  childrenText: string;
}

const openCustomConfirmModal = ({
  onConfirm,
  onCancel,
  childrenText,
  title
}: OpenCustomConfirmModalProps) => {
  modals.openConfirmModal({
    title,
    centered: true,
    children: <Text size={'sm'}>{childrenText}</Text>,
    confirmProps: { color: 'red' },
    labels: { confirm: 'Đồng ý', cancel: 'Huỷ bỏ' },
    onCancel,
    onConfirm
  });
};

interface OpenUploadModalProps {
  title: string;
  opened: boolean;
  onClose: () => void;
  afterUpload: (url: string) => void;
}

const OpenUploadModal = ({
  title,
  opened,
  onClose,
  afterUpload
}: OpenUploadModalProps) => {
  const [, setPreview] = useState<string>('');
  const [file, setFile] = useState<FileWithPath | null>(null);

  const handleClose = () => {
    setPreview('');
  };

  const handleCrop = (preview: string) => {
    setPreview(preview);
  };

  const handleBeforeFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0].size > 2 * 1024 * 1024) {
      renderNotification('Kích thước file quá lớn', NotiType.ERROR);
      event.target.value = '';
    }
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const [isLoadingUpload, , handleUploadImageOnFirebase] = useUploadFirebase();

  const handleUpload = () => {
    if (!file) return;
    handleUploadImageOnFirebase(file, {
      onSuccess: (url) => {
        if (!isLoadingUpload) {
          afterUpload(url);
          onClose();
          setFile(null);
        }
      }
    });
  };
  return (
    <Modal title={title} centered opened={opened} onClose={onClose}>
      <Center>
        <Stack>
          <Avatar
            label="Nhấn để tải ảnh lên"
            width={390}
            height={295}
            onClose={handleClose}
            onCrop={(preview: string) => handleCrop(preview)}
            onBeforeFileLoad={(e) => handleBeforeFileLoad(e)}
          />
          <Group position="right">
            <Button
              variant="outline"
              onClick={() => {
                onClose();
              }}
            >
              Huỷ
            </Button>
            <Button
              loading={isLoadingUpload}
              disabled={file ? false : true}
              onClick={handleUpload}
            >
              Lưu
            </Button>
          </Group>
        </Stack>
      </Center>
    </Modal>
  );
};
export const Modals = { openCustomConfirmModal, OpenUploadModal };
