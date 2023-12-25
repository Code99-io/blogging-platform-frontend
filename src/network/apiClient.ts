import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import { api } from '../constants';

const serialize = (
  baseUrl: string,
  path: string,
  obj: { [key: string]: string | number | boolean },
) => {
  const str = [];

  const isParamsEmpty = Object.keys(obj).length === 0;
  if (isParamsEmpty) return `${baseUrl}${path}`;

  for (const p in obj)
    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));

  return `${baseUrl}${path}?${str.join('&')}`;
};

export interface ApiClientRequestType {
  path: string;
  type: AxiosRequestConfig['method'];
  data?: any;
  token?: string;
  queryParams?: { [key: string]: string | number | boolean };
  additionalHeaders?: AxiosRequestHeaders;
  mockType?: 'swaggerMock' | 'localMock';
  timeout?: number;
}

interface SuccessType<T> {
  status: 'success';
  data: T;
}

interface ErrorType {
  status: 'error';
  errorCode: string;
  errorMessage: string;
}

const queryAsync = async <T>(request: ApiClientRequestType): Promise<T> => {
  const {
    path,
    type,
    data,
    queryParams = {},
    token = undefined,
    additionalHeaders = {},
    timeout,
  } = request;
  return new Promise<T>((resolve, reject) => {
    axios({
      method: type,
      url: serialize(api.BASE_URL, path, queryParams),
      data: JSON.stringify(data),
      ...(timeout && { timeout }),
      ...(additionalHeaders && {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...additionalHeaders,
        },
      }),
    })
      .then((result: AxiosResponse<SuccessType<T> | ErrorType>) => {
        if (result.data.status === 'success') {
          return resolve(result.data.data);
        } else {
          return reject(result.data);
        }
      })
      .catch((error) => {
        return reject(error?.response?.data);
      });
  });
};

export default queryAsync;
