import { notifications } from '@mantine/notifications';

export enum NotiType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INFO = 'INFO'
}

export interface NotiTypeDictFields {
  color: string;
  title: string;
}

export const NotiTypeDict: Record<NotiType, NotiTypeDictFields> = {
  [NotiType.ERROR]: {
    color: 'red',
    title: 'Thất Bại'
  },
  [NotiType.INFO]: {
    color: 'blue',
    title: 'Thông Tin'
  },
  [NotiType.SUCCESS]: {
    color: 'green',
    title: 'Thành Công'
  }
};

export const renderNotification = (message: string, type: NotiType) => {
  notifications.show({
    title: NotiTypeDict[type].title,
    message,
    color: NotiTypeDict[type].color,
    withCloseButton: true,
    autoClose: 1200
  });
};
