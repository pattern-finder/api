export const config = {
  MINIO_INTERNAL_ENDPOINT:
    process.env.MINIO_INTERNAL_ENDPOINT || 'picspy-minio',
  MINIO_EXTERNAL_ENDPOINT: process.env.MINIO_EXTERNAL_ENDPOINT || 'localhost',
  MINIO_INTERNAL_PORT: Number(process.env.MINIO_INTERNAL_PORT)// || 9000,
  MINIO_EXTERNAL_PORT: Number(process.env.MINIO_EXTERNAL_PORT)// || 9001,
  MINIO_ACCESSKEY: process.env.MINIO_ACCESS_KEY || 'miniokey',
  MINIO_SECRETKEY: process.env.MINIO_SECRET_KEY || 'miniosecret',
  MINIO_REGION: process.env.MINIO_REGION || '',
  MINIO_USESSL: process.env.USESSL === 'true' || false,
};
