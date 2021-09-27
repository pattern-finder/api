export const dbConfig = {
  url: `mongodb://' + ${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.HOST}/${process.env.MONGO_DB}${process.env.OPTION}`;

};
