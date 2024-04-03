import { BaseModel } from '.';

export interface INew extends BaseModel {
  title: string;
  content: string;
  isImportant: boolean;
  isPublic: boolean;
  status: INewStatus;
  employeeIds?: string[];
  authorName: string;
  createdBy: string;
}

export enum INewStatus {
  ALL = 'ALL',
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export const INewStatusDict: Record<
  INewStatus,
  { label: string; color: string }
> = {
  [INewStatus.DRAFT]: {
    label: 'Bản nháp',
    color: 'yellow'
  },
  [INewStatus.PUBLISHED]: {
    label: 'Đã đăng',
    color: 'green'
  },
  [INewStatus.ALL]: {
    label: 'Tất cả',
    color: 'green'
  }
};
