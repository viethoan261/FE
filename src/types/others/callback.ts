/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Callback<D = any, E = any> {
  onSuccess?: (data?: D) => void;
  onError?: (error?: E) => void;
  onFinally?: () => void;
}
