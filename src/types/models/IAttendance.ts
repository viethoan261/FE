import { BaseModel } from '.';

export interface IAttendance extends BaseModel {
  date: string;
  start: string;
  end: string;
  note?: string;
  employeeName: string;
  employeeId: string;
}
