import { BaseModel } from '.';
import { IRequestType } from './IRequest';

export interface IBalance extends BaseModel {
  employeeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  type: IRequestType;
  event: IBalanceEvent;
  changedBy: string;
  changeDays: number;
  deleted?: boolean;
  date: string;
}

export enum IBalanceEvent {
  TAKE_TIME_OFF = 'TAKE_TIME_OFF',
  BALANCE_ADJUSTMENT = 'BALANCE_ADJUSTMENT',
  ACCRUAL = 'ACCRUAL'
}

export const IBalanceEventDict: Record<
  IBalanceEvent,
  {
    label: string;
  }
> = {
  [IBalanceEvent.TAKE_TIME_OFF]: {
    label: 'Take time off'
  },
  [IBalanceEvent.BALANCE_ADJUSTMENT]: {
    label: 'Balance adjustment'
  },
  [IBalanceEvent.ACCRUAL]: {
    label: 'Accrual'
  }
};
