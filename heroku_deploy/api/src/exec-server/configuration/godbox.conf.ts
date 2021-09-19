export const godboxConfig = {
  baseUrl: `http://${process.env.GODBOX_URL || 'picspy-godbox'}:${
    process.env.PORT || '8080'
  }`,
};
