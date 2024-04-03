import { UpdateRolePayload } from '@/configs/api/payload';
import { useAppDispatch } from '@/hooks/redux';
import { RoleActions } from '@/redux/reducers/role/role.action';
import { IRole, IRoleProperty } from '@/types/models/IRole';
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
  role: IRole | null;
}

export const ModalUpdateRole: React.FC<Props> = ({ close, role }) => {
  const dispatch = useAppDispatch();
  const form = useForm<UpdateRolePayload>({
    initialValues: {
      name: role?.name || '',
      description: role?.name || '',
      isRoot: role?.isRoot || false,
      properties: role?.properties || []
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
          RoleActions.updateRole(values, role?.id, {
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
          checked={form.values.isRoot}
          {...form.getInputProps('isRoot')}
        />
        <Group position="right">
          <Button type={'submit'}>Cập nhật</Button>
        </Group>
      </Stack>
    </form>
  );
};
