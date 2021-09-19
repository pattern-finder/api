export const dbConfig = {
  url: `mongodb://`//${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.PORT  || 5000}`,
};
