export const godboxConfig = {
  baseUrl: `http://${process.env.GODBOX_URL || 'picspy-godbox'}:${
    process.env.GODBOX_PORT || '8080'
  }`,
};
