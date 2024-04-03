import axios, { AxiosRequestConfig, AxiosResponse, ResponseType } from 'axios';
import { ApiEndPointPayload } from './payload';
import { CONFIG } from '../index';

export const api = axios.create({
  baseURL: CONFIG.APP_URL as string
});

interface UseCallApiProps {
  endPoint: string;
  method: AxiosRequestConfig['method'];
  payload?: ApiEndPointPayload;
  headers?: AxiosRequestConfig['headers'];
  params?: AxiosRequestConfig['params'];
  responseType?: ResponseType;
}

interface UseCallApiResponse {
  response: AxiosResponse | null;
  error: unknown;
}

export const useCallApi = async (
  props: UseCallApiProps
): Promise<UseCallApiResponse> => {
  const { endPoint, headers, method, params, payload } = props;

  try {
    const result = await api.request({
      method,
      url: endPoint,
      headers,
      data: payload,
      params
    });

    return {
      response: result,
      error: null
    };
  } catch (error) {
    return {
      response: null,
      error
    };
  }
};
