import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { groupPermissionByResourceName } from '@/pages/Permission/helper';
import { RootState } from '@/redux/reducers';
import { IRole } from '@/types/models/IRole';
import { Button, Group, ScrollArea, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useLayoutEffect, useState } from 'react';
import { GroupPermissionCollapse } from './GroupPermissionCollapse';
import { RoleActions } from '@/redux/reducers/role/role.action';
import { NotiType, renderNotification } from '@/utils/notifications';
import { PermissionActions } from '@/redux/reducers/permission/permission.action';

interface Props {
  close: () => void;
  role: IRole | null;
}

export const ModalAssignPermission: React.FC<Props> = ({ close, role }) => {
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(PermissionActions.getAllPermission());
  }, [dispatch]);

  const { permission } = useAppSelector((state: RootState) => state.permission);

  const form = useForm();
  const groupPermission = groupPermissionByResourceName(permission);

  const permissions = role?.permissions || [];
  const [_permissionIDs, setPermissionIDs] = useState<string[]>(
    permissions.map((permission) => permission.permissionId)
  );
  const [_togglePermissionIds, setTogglePermissionIds] = useState<string[]>([]);

  return (
    <form
      onSubmit={form.onSubmit(() => {
        if (_togglePermissionIds.length > 0) {
          dispatch(
            RoleActions.assignPermission(
              { permissionIds: _togglePermissionIds },
              role?.id,
              {
                onSuccess: () => {
                  dispatch(RoleActions.getAllRole());
                  close();
                }
              }
            )
          );
        } else {
          renderNotification('Bạn chưa thay đổi phân quyền', NotiType.ERROR);
        }
      })}
    >
      <ScrollArea h={500}>
        <Stack>
          {groupPermission.map((group) => (
            <GroupPermissionCollapse
              groupName={group.resourceName}
              groupPermission={group.permission}
              permissionIDs={_permissionIDs}
              setPermissionID={setPermissionIDs}
              togglePermissionIds={_togglePermissionIds}
              setTogglePermissionIds={setTogglePermissionIds}
            />
          ))}
        </Stack>
      </ScrollArea>

      <Group position="right" mt={'md'}>
        <Button type="submit">Cập nhật</Button>
      </Group>
    </form>
  );
};
