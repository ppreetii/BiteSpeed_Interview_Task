import config from "./config";
import process from "process";

const env = process.env.NODE_ENV || "development";

let database = config.dbName;
switch (env) {
  case "development":
    database = database + "_dev";
    break;
  case "test":
    database = database + "_test";
    break;
  case "production":
    database = database + "_prod";
    break;
  default:
    database = database + "_dev";
}

export default {
  username: config.dbUsername,
  password: config.dbPassword,
  database,
  host: config.dbHostname,
  dialect: config.dialect,
  logging: false,
  seederStorage: "sequelize",
};

//IMP: This export is necessary for migration and seeding to work, sequelize-cli doesn't understand TS default exports properly
module.exports = {
  username: config.dbUsername,
  password: config.dbPassword,
  database,
  host: config.dbHostname,
  dialect: config.dialect,
  logging: false,
  seederStorage: "sequelize",
};
