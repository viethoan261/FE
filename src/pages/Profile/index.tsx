import CustomLoader from '@/components/custom/CustomLoader';
import { ChangeProfilePayload } from '@/configs/api/payload';
import { useAuthContext } from '@/hooks/context';
import { IUser, IUserGender, IUserGenderDict } from '@/types/models/IUser';
import { Modals } from '@/utils/modals';
import { NotiType, renderNotification } from '@/utils/notifications';
import {
  Avatar,
  Box,
  Button,
  Center,
  Checkbox,
  Col,
  Grid,
  Group,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export const Profile = () => {
  const { state, updateProfile, getProfile } = useAuthContext();
  const { profile } = state;
  const [_profile, setProfile] = useState(profile);

  useEffect(() => {
    getProfile({
      onSuccess: (data: IUser) => {
        setProfile(data);
        form.setValues({
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          description: data.description,
          dayOfBirth: data.dayOfBirth,
          avatarFileId: data.avatarFileId,
          roleIds: data.roles.map(({ id }) => id),
          departmentId: data.departmentId
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProfile]);

  // const [previewImage, setPreviewImage] = useState<FileWithPath>();
  // const [isLoadingUpload, url, handleUploadImageOnFirebase] =
  //   useUploadFirebase();

  const form = useForm<ChangeProfilePayload>({
    validate: {
      fullName: isNotEmpty('Họ tên không được bỏ trống'),
      email: isEmail('Email không đúng định dạng'),
      phoneNumber: isNotEmpty('Số điện thoại không được bỏ trống'),
      dayOfBirth: isNotEmpty('Ngày sinh không được bỏ trống')
    }
  });
  const [_isEditing, setIsEditing] = useState(false);

  const handleCancel = () => {
    if (profile) {
      form.setValues(profile);
    }
    setIsEditing(false);
  };

  const afterUpload = (url: string) => {
    updateProfile({ ...form.values, avatarFileId: url }, profile?.id, {
      onSuccess: () => {
        form.values.avatarFileId = url;
        getProfile();
      },
      onError: () => handleCancel()
    });
  };

  const isDirty = () => {
    const fieldsToCheck: (keyof ChangeProfilePayload)[] = [
      'description',
      'fullName',
      'email',
      'phoneNumber',
      'dayOfBirth',
      'gender'
    ];
    for (const field of fieldsToCheck) {
      if (form.values[field] !== profile?.[field]) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = (values: ChangeProfilePayload) => {
    if (!_isEditing) {
      console.log('Editing');
      setIsEditing(true);
    } else {
      if (!isDirty()) {
        renderNotification('Bạn chưa thay đổi thông tin gì', NotiType.ERROR);
        setIsEditing(false);
        console.log('??');
      } else {
        updateProfile(values, profile?.id, {
          onSuccess: () => {
            getProfile();
            setIsEditing(false);
          },
          onError: () => {
            handleCancel();
            setIsEditing(false);
          }
        });
      }
    }
  };

  const [opened, { close, open }] = useDisclosure();
  return (
    <>
      {_profile ? (
        <>
          <Stack>
            <Text fw={600} size={'lg'}>
              Thông tin cá nhân
            </Text>
            <Grid>
              <Col span={6}>
                <Stack w={'100%'}>
                  <Text align="left" color="dimmed">
                    Ảnh đại diện
                  </Text>
                  <Center>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        size={250}
                        w={'100%'}
                        color="blue"
                        radius="xl"
                        src={form.values.avatarFileId}
                      />
                      <IconEdit
                        size={'1.8rem'}
                        style={{
                          position: 'absolute',
                          bottom: -5,
                          right: -5,
                          background: 'white',
                          borderRadius: '50%',
                          border: '2px solid blue',
                          padding: '3px'
                        }}
                        color="blue"
                        cursor={'pointer'}
                        onClick={() => {
                          open();
                        }}
                      />
                    </Box>
                  </Center>
                </Stack>
              </Col>
              <Col span={6}>
                <Stack spacing={'md'}>
                  <Text align="left" color="dimmed">
                    Thông tin cá nhân
                  </Text>
                  <form
                    id="form-update-profile"
                    onSubmit={form.onSubmit((value) => handleSubmit(value))}
                  >
                    <TextInput
                      label="Họ tên"
                      placeholder="Nhập họ tên"
                      disabled={!_isEditing}
                      size={'sm'}
                      {...form.getInputProps('fullName')}
                    />
                    <TextInput
                      label="Số điện thoại"
                      placeholder="Nhập số điện thoại"
                      disabled={!_isEditing}
                      size={'sm'}
                      {...form.getInputProps('phoneNumber')}
                    />
                    <TextInput
                      label="Email"
                      placeholder="Nhập email"
                      disabled={!_isEditing}
                      size={'sm'}
                      {...form.getInputProps('email')}
                    />
                    <DatePickerInput
                      label="Ngày sinh"
                      placeholder="Nhập ngày sinh"
                      disabled={!_isEditing}
                      value={dayjs(form.values.dayOfBirth).toDate()}
                      onChange={(value) => {
                        form.setValues({
                          ...form.values,
                          dayOfBirth: dayjs(value)
                            .format('YYYY-MM-DD')
                            .toString()
                        });
                      }}
                    />
                    <Group position="left" mt={'sm'}>
                      <Text fw={600} fz="sm">
                        Giới tính
                      </Text>
                      <Checkbox
                        disabled={!_isEditing}
                        label={IUserGenderDict[IUserGender.MALE].label}
                        checked={form.values.gender === IUserGender.MALE}
                        onChange={() =>
                          form.setValues({
                            ...form.values,
                            gender: IUserGender.MALE
                          })
                        }
                      />
                      <Checkbox
                        disabled={!_isEditing}
                        label={IUserGenderDict[IUserGender.FEMALE].label}
                        checked={form.values.gender === IUserGender.FEMALE}
                        onChange={() =>
                          form.setValues({
                            ...form.values,
                            gender: IUserGender.FEMALE
                          })
                        }
                      />
                    </Group>
                    <TextInput
                      label="Mô tả"
                      placeholder="Nhập mô tả"
                      disabled={!_isEditing}
                      {...form.getInputProps('description')}
                    />
                  </form>
                </Stack>
              </Col>
            </Grid>
            <Group position="right" mt={100}>
              {_isEditing ? (
                <Button onClick={handleCancel} variant="outline">
                  Huỷ
                </Button>
              ) : null}
              <Button
                leftIcon={<IconEdit size={'1rem'} />}
                form="form-update-profile"
                type={'submit'}
              >
                {_isEditing ? 'Lưu thông tin' : 'Sửa thông tin'}
              </Button>
            </Group>
          </Stack>

          <Modals.OpenUploadModal
            title="Cập nhật ảnh đại diện"
            opened={opened}
            onClose={close}
            afterUpload={afterUpload}
          />
        </>
      ) : (
        <CustomLoader />
      )}
    </>
  );
};
