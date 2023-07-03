'use strict';
import { QueryInterface,Sequelize, DataTypes} from 'sequelize';
import { LinkType } from '../models/contact';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    await queryInterface.createTable("contacts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      linkedIn: {
        type: DataTypes.INTEGER,
      },
      linkPrecedence: {
        type: DataTypes.ENUM(...Object.values(LinkType)),
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue : new Date()
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    await queryInterface.dropTable("contacts");
  },
};
