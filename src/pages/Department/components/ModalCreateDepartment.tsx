import { CreateDepartmentPayload } from '@/configs/api/payload';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/reducers';
import { DepartmentActions } from '@/redux/reducers/department/department.action';
import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useLayoutEffect, useState } from 'react';

interface Props {
  closeModal: () => void;
}

const ModalCreateDepartment: React.FC<Props> = ({ closeModal }) => {
  const dispatch = useAppDispatch();
  useLayoutEffect(() => {
    dispatch(DepartmentActions.getAllDepartment);
  });
  const { departments } = useAppSelector(
    (state: RootState) => state.department
  );
  const [parentId, setParentId] = useState<string | null>();

  const form = useForm<CreateDepartmentPayload>({
    initialValues: {
      name: '',
      description: ''
    },
    validate: {
      name: isNotEmpty('Không được để trống'),
      description: isNotEmpty('Không được để trống')
    },
    transformValues: (values: CreateDepartmentPayload) => ({
      ...values
    })
  });
  return (
    <form
      id="form-create-department"
      onSubmit={form.onSubmit((values) => {
        dispatch(
          DepartmentActions.createDepartment(
            parentId ? { ...values, parentId: parentId } : values,
            {
              onSuccess: () => {
                closeModal();
                dispatch(DepartmentActions.getAllDepartment());
              }
            }
          )
        );
      })}
    >
      <Stack>
        <TextInput
          withAsterisk
          label="Tên phòng ban"
          placeholder="Nhập tên phòng ban"
          {...form.getInputProps('name')}
        />
        <TextInput
          withAsterisk
          label="Mô tả"
          placeholder="Nhập mô tả"
          {...form.getInputProps('description')}
        />
        <Select
          data={departments.map(({ name, id }) => ({
            value: id,
            label: name
          }))}
          label="Phòng ban cha"
          placeholder="Chọn phòng ban cha"
          onChange={(value) => setParentId(value)}
        />
        <Group position={'right'}>
          <Button type={'submit'}>Tạo</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ModalCreateDepartment;
