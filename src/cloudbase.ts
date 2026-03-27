import cloudbase from '@cloudbase/js-sdk';

// ---------------- 直接把你的 ID 填在这里 ----------------
const envId = 'my-web-app-9g9c9095c3bc8b5f'; // 这里填你那一串真实的环境 ID
const region = 'ap-shanghai';      // 这里填你的地域（比如 ap-shanghai）
// -----------------------------------------------------

export const app = cloudbase.init({
  env: envId,
  region: region
});

export const auth = app.auth({
  persistence: 'local'
});

export const db = app.database();