'use strict';
import SequelizeConnection from "../../utils/DbConnection";
import Contact from "./contact";

const sequelize = SequelizeConnection.getInstance();

Contact.initModel(sequelize);

export const db = {
  sequelize,
  Contact
}
