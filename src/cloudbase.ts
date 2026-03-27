import cloudbase from '@cloudbase/js-sdk';

// 从环境变量读取腾讯云开发环境 ID
const envId = import.meta.env.VITE_TCB_ENV_ID || 'my-web-app-9g9c9095c3bc8b5f';
const region = import.meta.env.VITE_TCB_REGION || 'ap-shanghai';

export const app = cloudbase.init({
  env: envId,
  region: region
});

export const auth = app.auth({
  persistence: 'local'
});

export const db = app.database();
