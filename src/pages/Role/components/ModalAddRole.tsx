import { CreateRolePayload } from '@/configs/api/payload';
import { useAppDispatch } from '@/hooks/redux';
import { RoleActions } from '@/redux/reducers/role/role.action';
import { IRoleProperty } from '@/types/models/IRole';
import {
  Button,
  Checkbox,
  Group,
  MultiSelect,
  Stack,
  TextInput
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import React from 'react';

interface Props {
  close: () => void;
}

export const ModalAddRole: React.FC<Props> = ({ close }) => {
  const dispatch = useAppDispatch();
  const form = useForm<CreateRolePayload>({
    initialValues: {
      name: '',
      description: '',
      isRoot: false,
      properties: []
    },
    validate: {
      name: isNotEmpty('Bạn cần nhập tên'),
      description: isNotEmpty('Bạn cần nhập mô tả')
    }
  });
  return (
    <form
      id="form-add-role"
      onSubmit={form.onSubmit((values) =>
        dispatch(
          RoleActions.createRole(values, {
            onSuccess: () => {
              dispatch(RoleActions.getAllRole());
              close();
            }
          })
        )
      )}
    >
      <Stack>
        <TextInput
          label="Tên"
          withAsterisk
          placeholder="Nhập tên"
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Mô tả"
          withAsterisk
          placeholder="Nhập mô tả"
          {...form.getInputProps('description')}
        />
        <MultiSelect
          label="Thuộc tính"
          placeholder="Chọn thuộc tính"
          data={Object.values(IRoleProperty)}
          {...form.getInputProps('properties')}
        />
        <Checkbox
          label="Cấp toàn bộ quyền (isRoot)"
          {...form.getInputProps('isRoot')}
        />
        <Group position="right">
          <Button type={'submit'}>Tạo mới</Button>
        </Group>
      </Stack>
    </form>
  );
};
