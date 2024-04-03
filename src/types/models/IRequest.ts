import { BaseModel } from '.';

export interface IRequest extends BaseModel {
  dateFrom: string;
  dateTo: string;
  type: IRequestType;
  status: IRequestStatus;
  note?: string;
  fileId?: string;
  dayOff: number;
  start?: number;
  end?: number;
  total?: number;
}

export enum IRequestType {
  ALL = 'ALL',
  ANNUAL = 'ANNUAL',
  UNPAID_TIME_OFF = 'UNPAID_TIME_OFF',
  WEDDING = 'WEDDING'
}

export enum IRequestStatus {
  ALL = 'ALL',
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED'
}

export const IRequestStatusDict: Record<
  IRequestStatus,
  { label: string; color: string }
> = {
  [IRequestStatus.ALL]: {
    label: 'Tất cả',
    color: ''
  },
  [IRequestStatus.APPROVED]: {
    label: 'Đã chấp thuận',
    color: 'green'
  },
  [IRequestStatus.PENDING]: {
    label: 'Đang chờ',
    color: 'orange'
  },
  [IRequestStatus.CANCELLED]: {
    label: 'Đã huỷ',
    color: 'yellow'
  },
  [IRequestStatus.REJECTED]: {
    label: 'Đã bị từ chối',
    color: 'red'
  }
};

export const IRequestTypeDict: Record<IRequestType, { label: string }> = {
  [IRequestType.ALL]: {
    label: 'Tất cả'
  },
  [IRequestType.ANNUAL]: {
    label: 'Nghỉ có lương'
  },
  [IRequestType.UNPAID_TIME_OFF]: {
    label: 'Nghỉ không lương'
  },
  [IRequestType.WEDDING]: {
    label: 'Đám cưới'
  }
};
