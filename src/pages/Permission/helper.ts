import { IPermission } from '@/types/models/IPermission';
import { groupBy, map } from 'lodash';

export const groupPermissionByResourceName = (permissionArr: IPermission[]) => {
  const group = groupBy(permissionArr, 'resourceName');

  const result = map(group, (permissionArr, resourceName) => ({
    resourceName: resourceName,
    permission: permissionArr.map(({ id, name }) => ({
      permissionId: id,
      name: name
    }))
  }));

  return result;
};
