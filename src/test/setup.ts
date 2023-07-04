import SequelizeConnection from "../utils/DbConnection";
import { db } from "../db/models";

beforeAll(async () => {
  try {
    await SequelizeConnection.connect();
    await db.sequelize.sync();
  } catch (error) {
    throw new Error("Database Connection Failed");
  }
});

beforeEach(async () => {
  try {
    await db.sequelize.truncate({ cascade: true, restartIdentity: true });
  } catch (error) {
    throw new Error("Failed to cleanup");
  }
});

afterAll(async () => {
  try {
    if (SequelizeConnection.getInstance()) {
      await db.sequelize.truncate({ cascade: true, restartIdentity: true });
      await SequelizeConnection.close();
    }
  } catch (error) {
    throw new Error("Failed to shutdown database connection");
  }
});
