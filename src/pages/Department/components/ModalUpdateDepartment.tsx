import { UpdateDepartmentPayload } from '@/configs/api/payload';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/reducers';
import { DepartmentActions } from '@/redux/reducers/department/department.action';
import { IDepartment } from '@/types/models/IDepartment';
import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';

interface Props {
  closeModal: () => void;
  department: IDepartment | null;
}

const ModalUpdateDepartment: React.FC<Props> = ({ closeModal, department }) => {
  const dispatch = useAppDispatch();
  const { departments } = useAppSelector(
    (state: RootState) => state.department
  );
  const form = useForm<UpdateDepartmentPayload>({
    initialValues: {
      name: department?.name || '',
      description: department?.description || '',
      parentId: department?.parentId || ''
    },
    validate: {
      name: isNotEmpty('Không được để trống'),
      description: isNotEmpty('Không được để trống'),
      parentId: isNotEmpty('Không được để trống')
    }
  });
  return (
    <form
      id="form-create-department"
      onSubmit={form.onSubmit((values) => {
        dispatch(
          DepartmentActions.updateDepartment(values, department?.id, {
            onSuccess: () => {
              closeModal();
              dispatch(DepartmentActions.getAllDepartment());
            }
          })
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
          {...form.getInputProps('parentId')}
        />
        <Group position={'right'}>
          <Button type={'submit'}>Cập nhật</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ModalUpdateDepartment;
