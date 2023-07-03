"use strict";
import { QueryInterface, Sequelize } from "sequelize";
import { contacts } from "../data/contacts";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    return queryInterface.bulkInsert("contacts", contacts);
  },

  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    return queryInterface.bulkDelete("contacts", {});
  },
};
