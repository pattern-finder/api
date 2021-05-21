export const config = {
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || 'picspy-minio',
  MINIO_PORT: Number(process.env.MINIO_PORT) || 9000,
  MINIO_ACCESSKEY: process.env.MINIO_ACCESS_KEY || 'miniokey',
  MINIO_SECRETKEY: process.env.MINIO_SECRET_KEY || 'miniosecret',
  MINIO_REGION: process.env.MINIO_REGION || '',
  MINIO_USESSL: process.env.MINIO_USESSL === 'true' || false,
};
