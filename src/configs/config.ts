import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT ?? 3000,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DATABASE_NAME,
  dbHostname: process.env.DB_HOSTNAME,
  dialect: process.env.DIALECT
};
