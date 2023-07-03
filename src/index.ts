import { app } from "./app";

import SequelizeConnection from "./utils/DbConnection";
import config from "./configs/config";
import { db } from "./db/models";

const initializeDbAndStartServer = async () => {
  try {
    await SequelizeConnection.connect();
    await db.sequelize.sync();
    console.info(`Database connected!`);
    app.listen(config.port, () => {
      console.log(`Listening on port ${config.port}!`);
    });
  } catch (error) {
    console.error((error as Error).message);
  }
};

initializeDbAndStartServer();
