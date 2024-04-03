import { BaseModel } from '.';

export interface ISession extends BaseModel {
  username: string;
  lastActivityTime: string;
}
