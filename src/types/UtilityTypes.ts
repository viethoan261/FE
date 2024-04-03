export type Modify<T, R> = Omit<T, keyof R> & R;

export type ModifyAllType<T, R> = Partial<{
  [Property in keyof T]: R;
}>;

export type ValueOf<T> = T[keyof T];

export type AtLeast<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

export type WithRequiredProperty<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};
