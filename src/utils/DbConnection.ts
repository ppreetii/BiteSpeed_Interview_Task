import { Dialect, Sequelize } from "sequelize";

import vars from "../configs/dbConfig";

class SequelizeConnection {
  private static instance: Sequelize;

  static getInstance(): Sequelize {
    if (!SequelizeConnection.instance) {
      SequelizeConnection.instance = new Sequelize(
        vars.database,
        vars.username as string,
        vars.password,
        {
          host: vars.host,
          dialect: vars.dialect as Dialect,
          logging: vars.logging,
          ssl: true, // Enable SSL
          dialectOptions: {
            ssl: {
              require: true, // Require SSL
            },
          },
        }
      );
    }

    return SequelizeConnection.instance;
  }

  static async connect(): Promise<Sequelize> {
    const sequelize = SequelizeConnection.getInstance();
    try {
      await sequelize.authenticate();
      console.log("Database connection authenticated successfully");
      return sequelize;
    } catch (err) {
      console.log(err)
      console.log("Error while creation connection to database");
      return sequelize;
    }
  }

  static async close(): Promise<Sequelize> {
    const sequelize = SequelizeConnection.getInstance();
    try {
      await sequelize.close();
      console.log("Database connection closed successfully");
      return sequelize;
    } catch (err: any) {
      console.log("Error while closing database connection :: " + err.message);
      return sequelize;
    }
  }
}

export default SequelizeConnection;