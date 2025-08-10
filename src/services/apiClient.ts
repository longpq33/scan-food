import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {
  THIRD_PARTY_ENDPOINT,
  THIRD_PARTY_AUTH_HEADER_NAME,
  THIRD_PARTY_AUTH_TOKEN,
  SERVER_BASE_URL,
} from '../config';

// Cấu hình mặc định cho axios
const DEFAULT_CONFIG: AxiosRequestConfig = {
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Tạo instance axios cho server nội bộ
const serverClient: AxiosInstance = axios.create({
  baseURL: SERVER_BASE_URL,
  ...DEFAULT_CONFIG,
});

// Tạo instance axios cho third-party API (Clarifai)
const thirdPartyClient: AxiosInstance = axios.create({
  baseURL: THIRD_PARTY_ENDPOINT,
  ...DEFAULT_CONFIG,
});

// Hàm helper để build auth headers cho third-party API
function buildAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (THIRD_PARTY_AUTH_HEADER_NAME && THIRD_PARTY_AUTH_TOKEN) {
    headers[THIRD_PARTY_AUTH_HEADER_NAME] = THIRD_PARTY_AUTH_TOKEN;
  }
  return headers;
}

// Interceptor để xử lý request cho server nội bộ
serverClient.interceptors.request.use(
  config => {
    console.log(
      `🚀 Server API Request: ${config.method?.toUpperCase()} ${config.url}`,
    );
    return config;
  },
  error => {
    console.error('❌ Server Request Error:', error);
    return Promise.reject(error);
  },
);

// Interceptor để xử lý response cho server nội bộ
serverClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      `✅ Server API Response: ${response.status} ${response.config.url}`,
    );
    return response;
  },
  error => {
    console.error('❌ Server Response Error:', error);

    // Xử lý lỗi mạng
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Server request timeout');
    }

    // Xử lý lỗi HTTP
    if (error.response) {
      const {status, data} = error.response;
      console.error(`Server HTTP ${status}:`, data);
    }

    return Promise.reject(error);
  },
);

// Interceptor để xử lý request cho third-party API
thirdPartyClient.interceptors.request.use(
  config => {
    console.log(
      `🚀 Third-party API Request: ${config.method?.toUpperCase()} ${
        config.url
      }`,
    );
    // Tự động thêm auth headers
    if (config.headers) {
      config.headers = {
        ...config.headers,
        ...buildAuthHeaders(),
      } as any;
    }
    return config;
  },
  error => {
    console.error('❌ Third-party Request Error:', error);
    return Promise.reject(error);
  },
);

// Interceptor để xử lý response cho third-party API
thirdPartyClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      `✅ Third-party API Response: ${response.status} ${response.config.url}`,
    );
    return response;
  },
  error => {
    console.error('❌ Third-party Response Error:', error);

    // Xử lý lỗi mạng
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Third-party request timeout');
    }

    // Xử lý lỗi HTTP
    if (error.response) {
      const {status, data} = error.response;
      console.error(`Third-party HTTP ${status}:`, data);
    }

    return Promise.reject(error);
  },
);

// Hàm helper để tạo FormData
export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      if (typeof data[key] === 'object' && data[key].uri) {
        // Xử lý file upload
        formData.append(key, data[key] as any);
      } else {
        formData.append(key, String(data[key]));
      }
    }
  });

  return formData;
};

// Hàm helper để xử lý lỗi
export const handleApiError = (
  error: any,
  defaultMessage: string = 'Đã xảy ra lỗi',
): string => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }

  if (error.message) {
    return error.message;
  }

  return defaultMessage;
};

// Export các client và helper functions
export {serverClient, thirdPartyClient, buildAuthHeaders};
export default serverClient; // Export serverClient làm default
