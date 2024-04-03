import { RegisterPayload } from '@/configs/api/payload';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useUploadFirebase } from '@/hooks/use-upload-firebase';
import { RootState } from '@/redux/reducers';
import { DepartmentActions } from '@/redux/reducers/department/department.action';
import { RoleActions } from '@/redux/reducers/role/role.action';
import { UserActions } from '@/redux/reducers/user/user.action';
import { IUserGender, IUserGenderDict } from '@/types/models/IUser';
import { validateEmail, validatePassword } from '@/utils/helpers';
import {
  Button,
  Checkbox,
  Group,
  Image,
  MultiSelect,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  useMantineTheme
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { isNotEmpty, useForm } from '@mantine/form';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useLayoutEffect, useState } from 'react';

interface Props {
  closeModal: () => void;
}

export const ModalAddUser = ({ closeModal }: Props) => {
  const theme = useMantineTheme();
  const dispatch = useAppDispatch();
  const [previewImage, setPreviewImage] = useState<FileWithPath>();

  useLayoutEffect(() => {
    dispatch(DepartmentActions.getAllDepartment());
    dispatch(RoleActions.getAllRole());
  }, [dispatch]);

  const [isLoadingUpload, , handleUploadImageOnFirebase] = useUploadFirebase();

  const { roles } = useAppSelector((state: RootState) => state.role);
  console.log(roles);
  const { departments } = useAppSelector(
    (state: RootState) => state.department
  );
  const [selectedGender, setSelectedGender] = useState<IUserGender>(
    IUserGender.MALE
  );

  const form = useForm<RegisterPayload>({
    initialValues: {
      username: '',
      password: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      gender: IUserGender.MALE,
      roleIds: [],
      description: '',
      dayOfBirth: undefined,
      avatar: '',
      departmentId: ''
    },
    validate: {
      username: isNotEmpty('Tên đăng nhập không được bỏ trống'),
      password: (value) => {
        if (!value) {
          return 'Mật khẩu không được để trống';
        }
        if (!validatePassword(value)) {
          return 'Mật khẩu có độ dài tối thiếu 8 ký tự, chứa ít nhất 1 chữ số, 1 ký tự viết hoa và 1 ký tự đặc biệt';
        }
      },
      fullName: isNotEmpty('Họ tên không được bỏ trống'),
      email: (value) => {
        if (!value) {
          return 'Email không được để trống';
        }
        if (!validateEmail(value)) {
          return 'Email chưa đúng định dạng';
        }
      },
      phoneNumber: isNotEmpty('Số điện thoại không được bỏ trống'),
      dayOfBirth: isNotEmpty('Ngày sinh không được bỏ trống'),
      roleIds: isNotEmpty('Chưa lựa chọn vai trò'),
      departmentId: isNotEmpty('Chưa lựa chọn phòng ban')
    },
    transformValues: (values) => ({
      ...values,
      dayOfBirth: dayjs(values.dayOfBirth).toISOString()
    })
  });

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        dispatch(
          UserActions.createUser(values, {
            onSuccess: () => {
              dispatch(UserActions.getAllUser());
              closeModal();
            }
          })
        )
      )}
    >
      <ScrollArea h={500}>
        <Stack spacing={'sm'}>
          <TextInput
            withAsterisk
            label="Tên đăng nhập"
            placeholder="Nhập tên đăng nhập"
            {...form.getInputProps('username')}
          />
          <TextInput
            withAsterisk
            label="Họ tên"
            placeholder="Nhập họ tên"
            {...form.getInputProps('fullName')}
          />
          <TextInput
            withAsterisk
            label="Email"
            placeholder="Nhập email"
            {...form.getInputProps('email')}
          />
          <TextInput
            withAsterisk
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            {...form.getInputProps('password')}
          />
          <TextInput
            withAsterisk
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            {...form.getInputProps('phoneNumber')}
          />
          <DatePickerInput
            required
            label="Ngày sinh"
            placeholder="Nhập ngày sinh"
            {...form.getInputProps('dayOfBirth')}
          />
          <Group position="left">
            <Text fw={600} fz="sm">
              Giới tính
            </Text>

            <Checkbox
              label={IUserGenderDict[IUserGender.MALE].label}
              checked={selectedGender === IUserGender.MALE}
              onChange={() => setSelectedGender(IUserGender.MALE)}
            />
            <Checkbox
              label={IUserGenderDict[IUserGender.FEMALE].label}
              checked={selectedGender === IUserGender.FEMALE}
              onChange={() => setSelectedGender(IUserGender.FEMALE)}
            />
          </Group>
          <MultiSelect
            data={roles.map(({ name, id }) => ({
              value: id,
              label: name
            }))}
            required
            label="Vai trò"
            placeholder="Chọn vai trò"
            {...form.getInputProps('roleIds')}
          />

          <Select
            data={departments.map(({ name, id }) => ({
              value: id,
              label: name
            }))}
            label="Phòng ban"
            required
            placeholder="Chọn phòng ban"
            {...form.getInputProps('departmentId')}
          />

          <Stack spacing={0}>
            <Text fw={600} fz="sm">
              Ảnh đại diện
            </Text>
            <Dropzone
              onDrop={(files) => {
                setPreviewImage(files[0]);
                handleUploadImageOnFirebase(files[0], {
                  onSuccess: (downloadUrl) => {
                    form.setFieldValue('avatar', downloadUrl);
                  }
                });
              }}
              onReject={(files) => console.log('rejected files', files)}
              maxSize={3 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
              multiple={false}
              {...form.getInputProps(`image`)}
            >
              <Group
                position="center"
                spacing="xs"
                style={{ pointerEvents: 'none' }}
              >
                <Dropzone.Accept>
                  <IconUpload
                    size="2rem"
                    stroke={1.5}
                    color={theme.colors[theme.primaryColor][6]}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size="2rem" stroke={1.5} color={theme.colors.red[6]} />
                </Dropzone.Reject>

                {previewImage ? (
                  <ScrollArea h={300} w={300}>
                    <Image
                      src={URL.createObjectURL(previewImage)}
                      imageProps={{
                        onLoad: () =>
                          URL.revokeObjectURL(URL.createObjectURL(previewImage))
                      }}
                    />
                  </ScrollArea>
                ) : (
                  <>
                    <Dropzone.Idle>
                      <IconPhoto size="3.2rem" stroke={1.5} />
                    </Dropzone.Idle>
                    <Stack spacing={0} align="center">
                      <Text size="sm" inline>
                        Kéo thả hoặc nhấn để chọn file ảnh
                      </Text>
                      <Text size="xs" color="dimmed" inline mt={7}>
                        Chọn 1 ảnh duy nhất, kích cỡ không quá 5MB
                      </Text>
                    </Stack>
                  </>
                )}
              </Group>
            </Dropzone>
          </Stack>
        </Stack>
      </ScrollArea>
      <Group position="right" mt={'md'}>
        <Button loading={isLoadingUpload} type="submit">
          Thêm mới
        </Button>
      </Group>
    </form>
  );
};
