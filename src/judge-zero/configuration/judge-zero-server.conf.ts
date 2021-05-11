export const judgeConfig = {
  apiKey: process.env.API_KEY_JUDGEZERO || 'secret',
  baseUrl: `http://${process.env.JUDGEZERO_URL || 'judge-server'}:${
    process.env.JUDGEZERO_PORT || '2358'
  }`,
};
